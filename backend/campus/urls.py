from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AnalyticsViewSet,
    BlockViewSet,
    ClassroomViewSet,
    CourseViewSet,
    EnrollmentViewSet,
    FacultyViewSet,
    StudentViewSet,
    FacultyUserViewSet,
    StudentUserViewSet,
)

router = DefaultRouter()
router.register(r"blocks", BlockViewSet)
router.register(r"classrooms", ClassroomViewSet)
router.register(r"faculty", FacultyViewSet)
router.register(r"courses", CourseViewSet)
router.register(r"students", StudentViewSet)
router.register(r"enrollments", EnrollmentViewSet)
router.register(r"analytics", AnalyticsViewSet, basename="analytics")
router.register(r"faculty-users", FacultyUserViewSet, basename="faculty-users")
router.register(r"student-users", StudentUserViewSet, basename="student-users")

urlpatterns = [
    path("", include(router.urls)),
]
