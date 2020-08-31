from django.urls import include, path
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path("token/", obtain_jwt_token),
    path("token/refresh/", refresh_jwt_token),
    path("token/verify/", verify_jwt_token),
    path('', include(router.urls)),
]