from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class GenderChoices(models.TextChoices):
        MALE = "M", "Male"
        FEMALE = "F", "Female"

    class MatchChoices(models.TextChoices):
        MALE = "M", "Male"
        FEMALE = "F", "Female"
        ANY = "A", "Any"

    password = models.CharField('password', max_length=128, blank=True)
    gender = models.CharField(max_length=1, choices=GenderChoices.choices)
    want_match = models.CharField(max_length=1, choices=MatchChoices.choices)
    group_name = models.CharField(max_length=50, blank=True)
    client_ip = models.GenericIPAddressField(null=True)
    created_at = models.DateTimeField(verbose_name="생성일", auto_now_add=True)
