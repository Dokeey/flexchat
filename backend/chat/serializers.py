from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Channel

User = get_user_model()


class ChatMatchSerializer(serializers.ModelSerializer):
    group = serializers.CharField(read_only=True, default='')
    waiters_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Channel
        fields = ['group', 'waiters_count']
