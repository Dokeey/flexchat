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
                user.channel.is_matching = True
                male_want_male.put(user)

        elif want_match == 'F':
            if not female_want_male.empty():
                another = female_want_male.get()
            if not female_want_any.empty():
                another = female_want_any.get()
            if not another:
                user.channel.is_matching = True
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
                user.channel.is_matching = True
                male_want_any.put(user)

    else:
        if want_match == 'M':
            if not male_want_female.empty():
                another = male_want_female.get()
            if not male_want_any.empty():
                another = male_want_any.get()
            if not another:
                user.channel.is_matching = True
                female_want_male.put(user)
        elif want_match == 'F':
            if not female_want_female.empty():
                another = female_want_female.get()
            if not female_want_any.empty():
                another = female_want_any.get()
            if not another:
                user.channel.is_matching = True
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
                user.channel.is_matching = True
                female_want_any.put(user)

    user.channel.save()
    return another


class ChatMatchView(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = ChatMatchSerializer

    def get_object(self):
        obj = super().get_object()
        return obj.channel

    def group_name_response(self, request, group='', **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save(group=group)
        return Response(serializer.data)

    def get_user_info(self):
        pk = self.kwargs.get('pk')
        user = User.objects.get(pk=pk)
        return user, user.gender, user.want_match

    def get(self, request, *args, **kwargs):
        """
        매칭 시작 버튼시 동작
        """
        # 유저 정보 가져오기
        user, gender, want_match = self.get_user_info()

        # 유저가 이미 매칭중이라면 Response
        if user.channel.is_matching:
            return self.group_name_response(request, **kwargs)

        # 상대방이 없다면 대기열에 들어가기
        another = get_another(user, gender, want_match)
        if not another:
            return self.group_name_response(request, **kwargs)

        # 상대방이 있지만, 매칭중 나간 유저라면 상대방 다시 고르기
        while not User.objects.filter(pk=another.pk).exists():
            another = get_another(user, gender, want_match)
            if not another:
                return self.group_name_response(request, **kwargs)

        # 상대방을 만났다면 그룹명을 정하고 매칭 성공
        group_name = f'{another.pk}_{user.pk}'
        another.channel.group = group_name
        another.channel.is_matching = False
        another.channel.save()

        return self.group_name_response(request, group=group_name, **kwargs)


class GetGroupNameView(RetrieveAPIView):
    """
    주기적으로 대기열 사람들의 Group 명과 본인 앞 대기자수를 받아오는 곳 (Polling)
    """
    queryset = User.objects.all()
    serializer_class = ChatMatchSerializer

    def get_object(self):
        obj = super().get_object()
        return obj.channel

    def get_user_info(self):
        pk = self.kwargs.get('pk')
        user = User.objects.get(pk=pk)
        return user, user.gender, user.want_match

    def get_queue(self, gender, want_match):
        if gender == 'M' and want_match == 'M':
            return male_want_male
        if gender == 'M' and want_match == 'F':
            return male_want_female
        if gender == 'M' and want_match == 'A':
            return male_want_any
        if gender == 'F' and want_match == 'M':
            return female_want_male
        if gender == 'F' and want_match == 'F':
            return female_want_female
        if gender == 'F' and want_match == 'A':
            return female_want_any

    def get_waiter_count(self, user, waiters):
        for index, waiter in enumerate(waiters):
            if user == waiter:
                return index
        return 0

    def get(self, request, *args, **kwargs):
        user, gender, want_match = self.get_user_info()
        my_queue = self.get_queue(gender, want_match)
        waiters = list(my_queue.queue)
        count = self.get_waiter_count(user, waiters)
        return self.waiters_count_response(request, count=count, **kwargs)

    def waiters_count_response(self, request, count=0, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save(waiters_count=count)
        return Response(serializer.data)
