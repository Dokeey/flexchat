from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin

from .serializers import UserSerializer

User = get_user_model()


def get_username():
    while True:
        username = get_random_string(length=32)
        if not User.objects.filter(username=username).exists():
            return username


class UserViewSet(CreateModelMixin, UpdateModelMixin, viewsets.GenericViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ipaddress = x_forwarded_for.split(',')[-1].strip()
        else:
            ipaddress = self.request.META.get('REMOTE_ADDR')

        serializer.save(username=get_username(), client_ip=ipaddress)
        return super().perform_create(serializer)

