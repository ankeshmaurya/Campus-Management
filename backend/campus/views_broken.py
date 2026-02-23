from datetime import timedelta
import csv
import io

from django.db import models, transaction
from django.db.models import Avg, Count
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .ai import suggest_classroom
from .models import Block, Classroom, Course, Enrollment, Faculty, Student
from .permissions import IsSuperAdminOrReadOnly
from .serializers import (
    BlockSerializer,
    ClassroomSerializer,
    CourseSerializer,
    EnrollmentSerializer,
    FacultySerializer,
    StudentSerializer,
)
from users.models import User

# Create your views here.


def _role(user) -> str:
    return getattr(user, "role", "") or ""


def _faculty_for_user(user):
    return Faculty.objects.filter(user=user).first()


def _student_for_user(user):
    return Student.objects.filter(user=user).first()


class BlockViewSet(viewsets.ModelViewSet):
    queryset = Block.objects.all().order_by("block_name")
    serializer_class = BlockSerializer
    permission_classes = [IsSuperAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=["post"], url_path="csv-upload")
    def csv_upload(self, request):
        if request.user.role != "super_admin":
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        file = request.FILES.get("file")
        if not file or not file.name.endswith(".csv"):
            return Response({"detail": "Upload a CSV file"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded = file.read().decode("utf-8")
            io_string = io.StringIO(decoded)
            reader = csv.DictReader(io_string)
            required = {"block_name"}
            if not required.issubset(set(reader.fieldnames or [])):
                missing = required - set(reader.fieldnames or [])
                return Response({"detail": f"Missing columns: {missing}"}, status=status.HTTP_400_BAD_REQUEST)

            blocks_to_create = []
            for row in reader:
                if row["block_name"] and row["block_name"].strip():
                    blocks_to_create.append(Block(block_name=row["block_name"].strip()))
            Block.objects.bulk_create(blocks_to_create, ignore_conflicts=True)
            return Response({"created": len(blocks_to_create)})
        except Exception as e:
            return Response({"detail": f"Error parsing CSV: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.select_related("block").all().order_by("classroom_name")
    serializer_class = ClassroomSerializer
    permission_classes = [IsSuperAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=["post"], url_path="csv-upload")
    def csv_upload(self, request):
        if request.user.role != "super_admin":
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        file = request.FILES.get("file")
        if not file or not file.name.endswith(".csv"):
            return Response({"detail": "Upload a CSV file"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded = file.read().decode("utf-8")
            io_string = io.StringIO(decoded)
            reader = csv.DictReader(io_string)
            required = {"classroom_name", "block_name", "seating_capacity", "is_smart_class"}
            if not required.issubset(set(reader.fieldnames or [])):
                missing = required - set(reader.fieldnames or [])
                return Response({"detail": f"Missing columns: {missing}"}, status=status.HTTP_400_BAD_REQUEST)

            classrooms_to_create = []
            for row in reader:
                if row["classroom_name"] and row["classroom_name"].strip():
                    block = Block.objects.filter(block_name=row["block_name"].strip()).first()
                    if not block:
                        continue  # skip rows with invalid block
                    classrooms_to_create.append(
                        Classroom(
                            classroom_name=row["classroom_name"].strip(),
                            block=block,
                            seating_capacity=int(row["seating_capacity"] or 0),
                            is_smart_class=row["is_smart_class"].strip().lower() in {"true", "1", "yes"},
                        )
                    )
            Classroom.objects.bulk_create(classrooms_to_create, ignore_conflicts=True)
            return Response({"created": len(classrooms_to_create)})
        except Exception as e:
            return Response({"detail": f"Error parsing CSV: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], url_path="recalculate")
    def recalculate(self, request, pk=None):
        classroom: Classroom = self.get_object()
        classroom.recalculate_current_strength()
        classroom.save(update_fields=["current_strength"])
        return Response(self.get_serializer(classroom).data)


class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all().order_by("faculty_name")
    serializer_class = FacultySerializer
    permission_classes = [IsSuperAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=["post"], url_path="csv-upload")
    def csv_upload(self, request):
        if request.user.role != "super_admin":
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        file = request.FILES.get("file")
        if not file or not file.name.endswith(".csv"):
            return Response({"detail": "Upload a CSV file"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded = file.read().decode("utf-8")
            io_string = io.StringIO(decoded)
            reader = csv.DictReader(io_string)
            required = {"faculty_name", "registration_number", "department", "max_weekly_hours", "assigned_hours"}
            if not required.issubset(set(reader.fieldnames or [])):
                missing = required - set(reader.fieldnames or [])
                return Response({"detail": f"Missing columns: {missing}"}, status=status.HTTP_400_BAD_REQUEST)

            faculty_to_create = []
            for row in reader:
                if row["faculty_name"] and row["faculty_name"].strip():
                    faculty_to_create.append(
                        Faculty(
                            faculty_name=row["faculty_name"].strip(),
                            registration_number=row["registration_number"].strip(),
                            department=row["department"].strip(),
                            max_weekly_hours=int(row["max_weekly_hours"] or 0),
                            assigned_hours=int(row["assigned_hours"] or 0),
                        )
                    )
            Faculty.objects.bulk_create(faculty_to_create, ignore_conflicts=True)
            return Response({"created": len(faculty_to_create)})
        except Exception as e:
            return Response({"detail": f"Error parsing CSV: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related("faculty", "classroom").all().order_by("course_code")
    serializer_class = CourseSerializer
    permission_classes = [IsSuperAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=["post"], url_path="csv-upload")
    def csv_upload(self, request):
        if request.user.role != "super_admin":
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        file = request.FILES.get("file")
        if not file or not file.name.endswith(".csv"):
            return Response({"detail": "Upload a CSV file"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded = file.read().decode("utf-8")
            io_string = io.StringIO(decoded)
            reader = csv.DictReader(io_string)
            required = {"course_code", "course_name", "faculty_name", "classroom_name", "weekly_hours"}
            if not required.issubset(set(reader.fieldnames or [])):
                missing = required - set(reader.fieldnames or [])
                return Response({"detail": f"Missing columns: {missing}"}, status=status.HTTP_400_BAD_REQUEST)

            courses_to_create = []
            for row in reader:
                if row["course_code"] and row["course_code"].strip():
                    faculty = Faculty.objects.filter(faculty_name=row["faculty_name"].strip()).first()
                    classroom = Classroom.objects.filter(classroom_name=row["classroom_name"].strip()).first()
                    if not faculty or not classroom:
                        continue  # skip rows with invalid references
                    courses_to_create.append(
                        Course(
                            course_code=row["course_code"].strip(),
                            course_name=row["course_name"].strip(),
                            faculty=faculty,
                            classroom=classroom,
                            weekly_hours=int(row["weekly_hours"] or 0),
                        )
                    )
            Course.objects.bulk_create(courses_to_create, ignore_conflicts=True)
            return Response({"created": len(courses_to_create)})
        except Exception as e:
            return Response({"detail": f"Error parsing CSV: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if _role(user) == "faculty":
            faculty = _faculty_for_user(user)
            if not faculty:
                return qs.none()
            return qs.filter(faculty=faculty)
        if _role(user) == "student":
            student = _student_for_user(user)
            if not student:
                return qs.none()
            return qs.filter(enrollments__student=student).distinct()
        return qs

    @action(detail=False, methods=["get"], url_path="my")
    def my_courses(self, request):
        return Response(self.get_serializer(self.get_queryset(), many=True).data)

    @action(detail=False, methods=["post"], url_path="suggest-classroom")
    def suggest_classroom_action(self, request):
        try:
            enrolled_students = int(request.data.get("enrolled_students", 0))
        except (TypeError, ValueError):
            return Response({"detail": "Invalid enrolled_students"}, status=status.HTTP_400_BAD_REQUEST)

        prefer_smart = bool(request.data.get("prefer_smart", False))
        suggestion = suggest_classroom(enrolled_students=enrolled_students, prefer_smart=prefer_smart)
        if not suggestion:
            return Response({"detail": "No suitable classroom found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(
            {
                "classroom_id": suggestion.classroom_id,
                "classroom_name": suggestion.classroom_name,
                "block_name": suggestion.block_name,
                "seating_capacity": suggestion.seating_capacity,
            }
        )

    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=["post"], url_path="csv-upload")
    def csv_upload(self, request):
        if request.user.role != "super_admin":
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        file = request.FILES.get("file")
        if not file or not file.name.endswith(".csv"):
            return Response({"detail": "Upload a CSV file"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded = file.read().decode("utf-8")
            io_string = io.StringIO(decoded)
            reader = csv.DictReader(io_string)
            required = {"name", "registration_number", "course_name", "semester"}
            if not required.issubset(set(reader.fieldnames or [])):
                missing = required - set(reader.fieldnames or [])
                return Response({"detail": f"Missing columns: {missing}"}, status=status.HTTP_400_BAD_REQUEST)

            students_to_create = []
            for row in reader:
                if row["name"] and row["name"].strip():
                    students_to_create.append(
                        Student(
                            name=row["name"].strip(),
                            registration_number=row["registration_number"].strip(),
                            course_name=row["course_name"].strip(),
                            semester=int(row["semester"] or 1),
                        )
                    )
            Student.objects.bulk_create(students_to_create, ignore_conflicts=True)
            return Response({"created": len(students_to_create)})
        except Exception as e:
            return Response({"detail": f"Error parsing CSV: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="dashboard")
    def dashboard(self, request):
        total_students = Student.objects.count()
        total_faculty = Faculty.objects.count()
        total_classrooms = Classroom.objects.count()

        avg_util = (
            Classroom.objects.exclude(seating_capacity=0)
            .annotate(util=100.0 * models.F("current_strength") / models.F("seating_capacity"))
            .aggregate(avg=Avg("util"))
            .get("avg")
        )

        overloaded_rooms = (
            Classroom.objects.exclude(seating_capacity=0)
            .filter(current_strength__gt=models.F("seating_capacity"))
            .count()
        )

        return Response(
            {
                "total_students": total_students,
                "total_faculty": total_faculty,
                "total_classrooms": total_classrooms,
                "avg_utilization": float(avg_util or 0.0),
                "overloaded_rooms": overloaded_rooms,
            }
        )


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by("registration_number")
    serializer_class = StudentSerializer
    permission_classes = [IsSuperAdminOrReadOnly]


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related("student", "course").all().order_by("-enrolled_at")
    serializer_class = EnrollmentSerializer
            return qs.filter(course__faculty=faculty)
        if _role(user) == "student":
            student = _student_for_user(user)
            if not student:
                return qs.none()
            return qs.filter(student=student)
        return qs


class FacultyUserViewSet(viewsets.GenericViewSet):
    permission_classes = [IsSuperAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=["post"], url_path="csv-upload")
    def csv_upload(self, request):
        if request.user.role != "super_admin":
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        file = request.FILES.get("file")
        if not file or not file.name.endswith(".csv"):
            return Response({"detail": "Upload a CSV file"}, status=status.HTTP_400_BAD_REQUEST)
class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"], url_path="block-utilization")
    def block_utilization(self, request):
        blocks = Block.objects.all().order_by("block_name")
        payload = []
        for b in blocks:
            payload.append(
                {
                    "block_id": b.id,
                    "block_name": b.block_name,
                    "utilization_percent": float(b.utilization_percent),
                    "total_capacity": b.total_capacity,
                    "total_students": b.total_students_in_block,
                }
            )
        return Response(payload)

    @action(detail=False, methods=["get"], url_path="faculty-workload")
    def faculty_workload(self, request):
        qs = Faculty.objects.all().order_by("faculty_name")
        payload = [
            {
                "faculty_id": f.id,
                "faculty_name": f.faculty_name,
                "department": f.department,
                "assigned_hours": f.assigned_hours,
                "max_weekly_hours": f.max_weekly_hours,
                "workload_percent": float(f.workload_percent),
                "workload_status": f.workload_status,
            }
            for f in qs
        ]
        return Response(payload)

    @action(detail=False, methods=["get"], url_path="enrollment-trend")
    def enrollment_trend(self, request):
        days = 30
        try:
            days = int(request.query_params.get("days", 30))
        except (TypeError, ValueError):
            days = 30

        start = timezone.now() - timedelta(days=days)
        enrollments = (
            Enrollment.objects.filter(enrolled_at__gte=start)
            .annotate(day=models.functions.TruncDate("enrolled_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        payload = [{"date": str(row["day"]), "count": row["count"]} for row in enrollments]
        return Response(payload)

