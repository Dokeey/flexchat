from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class ChatMatchSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['group_name']
