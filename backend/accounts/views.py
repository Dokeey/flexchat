from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.generics import DestroyAPIView
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from .serializers import UserSerializer
from chat.models import Channel

User = get_user_model()


class UserViewSet(CreateModelMixin, UpdateModelMixin, viewsets.GenericViewSet):
    """
    기본 유저 생성 및 업데이트 뷰셋
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_username(self):
        """
        유저 생성시 랜덤 username 문자열 생성
        """
        while True:
            username = get_random_string(length=32)
            if not User.objects.filter(username=username).exists():
                return username

    def perform_create(self, serializer):
        """
        유저 생성시 username 지정 및 client_ip 값 파싱후 추가
        """
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ipaddress = x_forwarded_for.split(',')[-1].strip()
        else:
            ipaddress = self.request.META.get('REMOTE_ADDR')

        username = self.get_username()
        user = serializer.save(username=username, client_ip=ipaddress)
        user.set_password(username)
        user.save()

        # 유저 생성과 동시에 JWT 토큰 발급
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        serializer.save(token=token)

        # channel instance 생성
        Channel.objects.create(user=user)

        return super().perform_create(serializer)

    def perform_update(self, serializer):
        user = self.get_object()
        user.channel.is_matching = False
        user.channel.save()
        return super().perform_update(serializer)


class UserDeleteView(DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        """
        pk가 -1이라면 아직 회원이 아니라는 뜻
        """
        pk = self.kwargs.get('pk')

        if pk == '-1':
            return Response(status.HTTP_204_NO_CONTENT) # FIXME: 현재는 404 error를 반환하는데 정상 응답처리(204)로 고쳐야함.
        return self.destroy(request, *args, **kwargs)
