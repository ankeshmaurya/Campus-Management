from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Sum

from campus.models import Block, Classroom, Course, Enrollment, Faculty, Student
from users.models import User


class Command(BaseCommand):
    help = "Seed demo data for dashboards (safe to run multiple times)."

    @transaction.atomic
    def handle(self, *args, **options):
        # --- Users ---
        admin, _ = User.objects.get_or_create(
            username="admin",
            defaults={"role": User.Role.SUPER_ADMIN, "is_staff": True, "is_superuser": True},
        )
        if not admin.check_password("Demo@123"):
            admin.set_password("Demo@123")
            admin.role = User.Role.SUPER_ADMIN
            admin.is_staff = True
            admin.is_superuser = True
            admin.save(update_fields=["password", "role", "is_staff", "is_superuser"])

        fac_user, _ = User.objects.get_or_create(
            username="faculty1",
            defaults={"role": User.Role.FACULTY},
        )
        if not fac_user.check_password("Demo@123"):
            fac_user.set_password("Demo@123")
            fac_user.role = User.Role.FACULTY
            fac_user.save(update_fields=["password", "role"])

        stu_user, _ = User.objects.get_or_create(
            username="student1",
            defaults={"role": User.Role.STUDENT},
        )
        if not stu_user.check_password("Demo@123"):
            stu_user.set_password("Demo@123")
            stu_user.role = User.Role.STUDENT
            stu_user.save(update_fields=["password", "role"])

        # --- Faculty / Student profiles ---
        faculty, _ = Faculty.objects.get_or_create(
            registration_number="F-DEMO-001",
            defaults={
                "user": fac_user,
                "faculty_name": "Demo Faculty",
                "department": "Computer Science",
                "max_weekly_hours": 20,
                "assigned_hours": 8,
            },
        )
        if faculty.user_id != fac_user.id:
            faculty.user = fac_user
            faculty.save(update_fields=["user"])

        student, _ = Student.objects.get_or_create(
            registration_number="S-DEMO-001",
            defaults={
                "user": stu_user,
                "name": "Demo Student",
                "course_name": "B.Tech CSE",
                "semester": 3,
            },
        )
        if student.user_id != stu_user.id:
            student.user = stu_user
            student.save(update_fields=["user"])

        # --- Campus infra ---
        block, _ = Block.objects.get_or_create(
            block_name="Block A",
            defaults={"total_classrooms": 2, "total_capacity": 120, "description": "Demo block"},
        )

        room1, _ = Classroom.objects.get_or_create(
            block=block,
            classroom_name="A-101",
            defaults={"seating_capacity": 60, "current_strength": 0, "is_smart_class": True},
        )
        room2, _ = Classroom.objects.get_or_create(
            block=block,
            classroom_name="A-102",
            defaults={"seating_capacity": 60, "current_strength": 0, "is_smart_class": False},
        )

        # --- Courses ---
        c1, _ = Course.objects.get_or_create(
            course_code="CSE101",
            defaults={
                "course_name": "Intro to Programming",
                "faculty": faculty,
                "classroom": room1,
                "weekly_hours": 4,
                "enrolled_students": 35,
            },
        )
        c2, _ = Course.objects.get_or_create(
            course_code="CSE102",
            defaults={
                "course_name": "Data Structures",
                "faculty": faculty,
                "classroom": room2,
                "weekly_hours": 4,
                "enrolled_students": 45,
            },
        )

        # Ensure relations are set even if course existed
        updates = []
        if c1.faculty_id != faculty.id:
            c1.faculty = faculty
            updates.append(c1)
        if c1.classroom_id != room1.id:
            c1.classroom = room1
            updates.append(c1)
        if c2.faculty_id != faculty.id:
            c2.faculty = faculty
            updates.append(c2)
        if c2.classroom_id != room2.id:
            c2.classroom = room2
            updates.append(c2)
        for obj in {id(x): x for x in updates}.values():
            obj.save()

        # --- Enrollments ---
        Enrollment.objects.get_or_create(student=student, course=c1)
        Enrollment.objects.get_or_create(student=student, course=c2)

        # Recalculate classroom strengths
        for room in (room1, room2):
            room.recalculate_current_strength()
            room.save(update_fields=["current_strength"])

        # Update faculty assigned hours (simple sum of weekly_hours)
        assigned = Course.objects.filter(faculty=faculty).aggregate(total=Sum("weekly_hours")).get("total")
        faculty.assigned_hours = int(assigned or 0)
        faculty.save(update_fields=["assigned_hours"])

        self.stdout.write(self.style.SUCCESS("Demo data seeded/updated successfully."))
