from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Super Admin"
        FACULTY = "faculty", "Faculty"
        STUDENT = "student", "Student"

    role = models.CharField(max_length=32, choices=Role.choices, default=Role.STUDENT)

    def __str__(self) -> str:
        return self.get_username()
