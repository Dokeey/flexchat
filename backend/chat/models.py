from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class Channel(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, verbose_name="사용자", on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True)
    group = models.CharField(max_length=50, blank=True)
