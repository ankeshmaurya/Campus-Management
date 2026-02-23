from rest_framework import serializers

from .models import Block, Classroom, Course, Enrollment, Faculty, Student


class BlockSerializer(serializers.ModelSerializer):
    occupied_classrooms = serializers.IntegerField(read_only=True)
    utilization_percent = serializers.FloatField(read_only=True)
    total_students_in_block = serializers.IntegerField(read_only=True)

    class Meta:
        model = Block
        fields = [
            "id",
            "block_name",
            "total_classrooms",
            "total_capacity",
            "description",
            "occupied_classrooms",
            "total_students_in_block",
            "utilization_percent",
        ]


class ClassroomSerializer(serializers.ModelSerializer):
    utilization_percent = serializers.FloatField(read_only=True)
    utilization_status = serializers.CharField(read_only=True)
    block_name = serializers.CharField(source="block.block_name", read_only=True)

    class Meta:
        model = Classroom
        fields = [
            "id",
            "classroom_name",
            "block",
            "block_name",
            "seating_capacity",
            "current_strength",
            "is_smart_class",
            "utilization_percent",
            "utilization_status",
        ]


class FacultySerializer(serializers.ModelSerializer):
    workload_percent = serializers.FloatField(read_only=True)
    workload_status = serializers.CharField(read_only=True)

    class Meta:
        model = Faculty
        fields = [
            "id",
            "user",
            "faculty_name",
            "registration_number",
            "department",
            "max_weekly_hours",
            "assigned_hours",
            "workload_percent",
            "workload_status",
        ]


class CourseSerializer(serializers.ModelSerializer):
    utilization_percent = serializers.FloatField(read_only=True)
    faculty_name = serializers.CharField(source="faculty.faculty_name", read_only=True)
    classroom_name = serializers.CharField(source="classroom.classroom_name", read_only=True)
    block_name = serializers.CharField(source="classroom.block.block_name", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "course_code",
            "course_name",
            "faculty",
            "faculty_name",
            "classroom",
            "classroom_name",
            "block_name",
            "enrolled_students",
            "weekly_hours",
            "utilization_percent",
        ]


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "user",
            "username",
            "name",
            "registration_number",
            "course_name",
            "semester",
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    student_registration_number = serializers.CharField(
        source="student.registration_number", read_only=True
    )
    course_code = serializers.CharField(source="course.course_code", read_only=True)
    course_name = serializers.CharField(source="course.course_name", read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "student_registration_number",
            "course",
            "course_code",
            "course_name",
            "enrolled_at",
        ]
