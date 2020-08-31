from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.utils.crypto import get_random_string

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    token = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['gender', 'want_match', 'token']
