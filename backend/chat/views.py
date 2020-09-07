import time

from django.contrib.auth import get_user_model
from rest_framework.generics import RetrieveAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import ChatMatchSerializer
from collections import deque
User = get_user_model()

male_want_male = deque()
male_want_female = deque()
male_want_any = deque()
female_want_male = deque()
female_want_female = deque()
female_want_any = deque()


def get_another(user, gender, want_match):
    another = None

    if gender == 'M':
        if want_match == 'M':
            if len(male_want_male):
                another = male_want_male.popleft()
            if len(male_want_any):
                another = male_want_any.popleft()
            if not another:
                user.channel.is_matching = True
                male_want_male.append(user)

        elif want_match == 'F':
            if len(female_want_male):
                another = female_want_male.popleft()
            if len(female_want_any):
                another = female_want_any.popleft()
            if not another:
                user.channel.is_matching = True
                male_want_female.append(user)

        else:
            if len(female_want_male):
                another = female_want_male.popleft()
            if len(male_want_male):
                another = male_want_male.popleft()
            if len(female_want_any):
                another = female_want_any.popleft()
            if len(male_want_any):
                another = male_want_any.popleft()
            if not another:
                user.channel.is_matching = True
                male_want_any.append(user)

    else:
        if want_match == 'M':
            if len(male_want_female):
                another = male_want_female.popleft()
            if len(male_want_any):
                another = male_want_any.popleft()
            if not another:
                user.channel.is_matching = True
                female_want_male.append(user)
        elif want_match == 'F':
            if len(female_want_female):
                another = female_want_female.popleft()
            if len(female_want_any):
                another = female_want_any.popleft()
            if not another:
                user.channel.is_matching = True
                female_want_female.append(user)
        else:
            if len(male_want_female):
                another = male_want_female.popleft()
            if len(female_want_female):
                another = female_want_female.popleft()
            if len(male_want_any):
                another = male_want_any.popleft()
            if len(female_want_any):
                another = female_want_any.popleft()
            if not another:
                user.channel.is_matching = True
                female_want_any.append(user)

    user.channel.save()
    return another


def get_queue(gender, want_match):
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

    def get_group_hook(self, gender, want_match, request, **kwargs):
        while not self.get_object().group:
            user = self.get_object().user
            if not User.objects.filter(pk=user.pk).exists():
                get_queue(gender, want_match).remove(user)
                return self.group_name_response(request, **kwargs)
            if user.gender != gender or user.want_match != want_match:
                get_queue(gender, want_match).remove(user)
                user.channel.is_matching = False
                user.channel.save()
                return self.group_name_response(request, **kwargs)
            time.sleep(1)
        return self.group_name_response(request, group=self.get_object().group, ** kwargs)

    def get(self, request, *args, **kwargs):
        """
        매칭시작버튼 누를시 동작
        """
        # 유저 정보 가져오기
        user, gender, want_match = self.get_user_info()

        # 유저가 이미 매칭중이라면 Response
        if user.channel.is_matching:
            return self.group_name_response(request, **kwargs)

        # 상대방을 가져오고 없다면 대기열에 들어가기
        another = get_another(user, gender, want_match)

        # 상대방이 있지만, 매칭중 나간 유저라면 상대방 다시 고르기
        if another:
            while not User.objects.filter(pk=another.pk).exists():
                another = get_another(user, gender, want_match)
                if not another:
                    return self.get_group_hook(gender, want_match, request, **kwargs)
        # 대기열에서 상대방이 날 꺼내줄때까지 기다리기
        else:
            return self.get_group_hook(gender, want_match, request, **kwargs)


        # 상대방을 만났다면 그룹명을 정하고 매칭 성공
        group_name = f'{another.pk}_{user.pk}'
        another.channel.group = group_name
        another.channel.is_matching = False
        another.channel.save()

        return self.group_name_response(request, group=group_name, **kwargs)


class GetGroupNameAndWaitersCountView(RetrieveAPIView):
    """
    본인의 Group 명과 본인 앞 대기자수를 받아오는 뷰
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

    def get(self, request, *args, **kwargs):
        user, gender, want_match = self.get_user_info()
        my_queue = get_queue(gender, want_match)
        try:
            count = my_queue.index(user)
        except:
            count = 0
        return self.waiters_count_response(request, count=count, **kwargs)

    def waiters_count_response(self, request, count=0, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save(waiters_count=count)
        return Response(serializer.data)


class GetAllUsersCountView(GenericAPIView):
    """
    현재 접속자들의 수를 보여주는 뷰
    """
    queryset = User.objects.all().filter(is_staff=False)
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        count = self.get_queryset().count()
        return Response({'count': count})
