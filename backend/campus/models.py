from django.db import models
from django.conf import settings
from django.db.models import Sum

# Create your models here.


class Block(models.Model):
    block_name = models.CharField(max_length=128, unique=True)
    total_classrooms = models.PositiveIntegerField(default=0)
    total_capacity = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.block_name

    @property
    def occupied_classrooms(self) -> int:
        return self.classrooms.filter(courses__isnull=False).distinct().count()

    @property
    def total_students_in_block(self) -> int:
        value = (
            Course.objects.filter(classroom__block=self)
            .aggregate(total=Sum("enrolled_students"))
            .get("total")
        )
        return int(value or 0)

    @property
    def utilization_percent(self) -> float:
        if not self.total_capacity:
            return 0.0
        return (self.total_students_in_block / self.total_capacity) * 100


class Classroom(models.Model):
    classroom_name = models.CharField(max_length=128)
    block = models.ForeignKey(Block, on_delete=models.CASCADE, related_name="classrooms")
    seating_capacity = models.PositiveIntegerField(default=0)
    current_strength = models.PositiveIntegerField(default=0)
    is_smart_class = models.BooleanField(default=False)

    class Meta:
        unique_together = ("block", "classroom_name")

    def __str__(self) -> str:
        return f"{self.block.block_name} - {self.classroom_name}"

    def recalculate_current_strength(self) -> int:
        value = self.courses.aggregate(total=Sum("enrolled_students")).get("total")
        self.current_strength = int(value or 0)
        return self.current_strength

    @property
    def utilization_percent(self) -> float:
        if not self.seating_capacity:
            return 0.0
        enrolled = self.current_strength
        return (enrolled / self.seating_capacity) * 100

    @property
    def utilization_status(self) -> str:
        util = self.utilization_percent
        if util > 100:
            return "overloaded"
        if 60 <= util <= 90:
            return "optimal"
        if util < 50:
            return "underutilized"
        return "normal"


class Faculty(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    faculty_name = models.CharField(max_length=128)
    registration_number = models.CharField(max_length=64, unique=True, blank=True, null=True)
    department = models.CharField(max_length=128)
    max_weekly_hours = models.PositiveIntegerField(default=0)
    assigned_hours = models.PositiveIntegerField(default=0)

    def __str__(self) -> str:
        return self.faculty_name

    @property
    def workload_percent(self) -> float:
        if not self.max_weekly_hours:
            return 0.0
        return (self.assigned_hours / self.max_weekly_hours) * 100

    @property
    def workload_status(self) -> str:
        pct = self.workload_percent
        if pct > 100:
            return "overloaded"
        if pct < 50:
            return "underutilized"
        return "balanced"


class Course(models.Model):
    course_code = models.CharField(max_length=32, unique=True)
    course_name = models.CharField(max_length=255)
    faculty = models.ForeignKey(
        Faculty, on_delete=models.SET_NULL, null=True, blank=True, related_name="courses"
    )
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses",
    )
    enrolled_students = models.PositiveIntegerField(default=0)
    weekly_hours = models.PositiveIntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.course_code} - {self.course_name}"

    @property
    def utilization_percent(self) -> float:
        if not self.classroom or not self.classroom.seating_capacity:
            return 0.0
        return (self.enrolled_students / self.classroom.seating_capacity) * 100


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    name = models.CharField(max_length=128)
    registration_number = models.CharField(max_length=64, unique=True)
    course_name = models.CharField(max_length=128, blank=True, null=True)
    semester = models.PositiveIntegerField(default=1)

    def __str__(self) -> str:
        return self.registration_number


class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self) -> str:
        return f"{self.student.registration_number} -> {self.course.course_code}"
