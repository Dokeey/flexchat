from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import render
from rest_framework.generics import RetrieveAPIView, GenericAPIView
from rest_framework.response import Response

from .serializers import ChatMatchSerializer
from queue import Queue

User = get_user_model()

male_want_male = Queue()
male_want_female = Queue()
male_want_any = Queue()
female_want_male = Queue()
female_want_female = Queue()
female_want_any = Queue()

def get_another(user, gender, want_match):
    another = None

    if gender == 'M':
        if want_match == 'M':
            if not male_want_male.empty():
                another = male_want_male.get()
            if not male_want_any.empty():
                another = male_want_any.get()
            if not another:
                male_want_male.put(user)

        elif want_match == 'F':
            if not female_want_male.empty():
                another = female_want_male.get()
            if not female_want_any.empty():
                another = female_want_any.get()
            if not another:
                male_want_female.put(user)

        else:
            if not female_want_male.empty():
                another = female_want_male.get()
            if not male_want_male.empty():
                another = male_want_male.get()
            if not female_want_any.empty():
                another = female_want_any.get()
            if not male_want_any:
                another = male_want_any.get()
            if not another:
                male_want_any.put(user)

    else:
        if want_match == 'M':
            if not male_want_female.empty():
                another = male_want_female.get()
            if not male_want_any.empty():
                another = male_want_any.get()
            if not another:
                female_want_male.put(user)
        elif want_match == 'F':
            if not female_want_female.empty():
                another = female_want_female.get()
            if not female_want_any.empty():
                another = female_want_any.get()
            if not another:
                female_want_female.put(user)
        else:
            if not male_want_female.empty():
                another = male_want_female.get()
            if not female_want_female.empty():
                another = female_want_female.get()
            if not male_want_any.empty():
                another = male_want_any.get()
            if not female_want_any.empty():
                another = female_want_any.get()
            if not another:
                female_want_any.put(user)

    return another


class ChatMatchView(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = ChatMatchSerializer

    def get_object(self):
        obj = super().get_object()
        return obj.channel

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        user = User.objects.get(pk=pk)
        gender = user.gender
        want_match = user.want_match  # Any 일수도

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        another = get_another(user, gender, want_match)
        if not another:
            group_name = ''
            serializer.save(group=group_name)
            return Response(serializer.data)

        while not User.objects.filter(pk=another.pk).exists():
            another = get_another(user, gender, want_match)
            if not another:
                get_another(user, gender, want_match)
                group_name = ''
                serializer.save(group=group_name)
                return Response(serializer.data)

        group_name = f'{another.pk}_{user.pk}'
        another.channel.group = group_name
        another.channel.save()
        serializer.save(group=group_name)

        return Response(serializer.data)


class GetGroupNameView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = ChatMatchSerializer

    def get_object(self):
        obj = super().get_object()
        return obj.channel
