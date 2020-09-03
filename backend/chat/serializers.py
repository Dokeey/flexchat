from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Channel

User = get_user_model()


class ChatMatchSerializer(serializers.ModelSerializer):
    group = serializers.CharField(read_only=True)

    class Meta:
        model = Channel
        fields = ['group']
