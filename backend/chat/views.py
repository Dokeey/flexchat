from django.contrib.auth import get_user_model
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
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

    def get(self, request, *args, **kwargs):
        """
        유저들간의 매칭이 이루어 지는 메소드
        """
        # 유저 정보 가져오기
        user, gender, want_match = self.get_user_info()

        # 유저가 이미 매칭중이라면 Response
        if user.channel.is_matching:
            return self.group_name_response(request, **kwargs)

        # 상대방을 가져오고 없다면 대기열에 들어가기
        another = get_another(user, gender, want_match)

        # 상대방이 없다면 그룹명없이 Response
        if not another:
            return self.group_name_response(request, **kwargs)

        # 상대방을 만났다면 그룹명을 정하고 매칭 성공
        group_name = f'{another.pk}_{user.pk}'
        another.channel.group = group_name
        another.channel.is_matching = False
        another.channel.save()

        return self.group_name_response(request, group=group_name, **kwargs)
