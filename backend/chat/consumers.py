import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from . import views

User = get_user_model()


def get_another_pk(group, user):
    users = group.split('_')
    if int(users[0]) == user.pk:
        return users[1]
    else:
        return users[0]


@database_sync_to_async
def get_group(user):
    return user.channel.group


class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_user(self, pk):
        return User.objects.get(pk=pk)

    @database_sync_to_async
    def remove_group(self, user):
        user.channel.group = ''
        user.channel.save()

    async def connect(self):
        """
        유저의 group 정보를 기반으로 channel layer에 그대로 그룹정보로 활용
        한명이라도 JWT Token 값이 잘못된 값이면 연결종료.
        """
        if not self.scope['user'].is_authenticated:
            await self.close()

        self.room_group_name = await get_group(self.scope['user'])

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def kick_user(self, pk):
        user = await self.get_user(int(pk))
        group = await get_group(user)
        await self.channel_layer.group_send(
            group,
            {
                'type': 'websocket.close',
            }
        )
        await self.remove_group(user)

    async def disconnect(self, close_code):
        """
        연결을 종료하면 상대방도 종료
        """
        another_pk = get_another_pk(self.room_group_name, self.scope['user'])
        await self.kick_user(another_pk)

        await self.remove_group(self.scope['user'])
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        """
        그룹의 모든 구성원에게 나의 pk, gender 값을 전송
        """
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'pk': self.scope['user'].pk,
                'gender': self.scope['user'].gender,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        """
        pk, gender 값으로 클라이언트 측에서 상대방과 성별을 구분할 수 있게함.
        """
        message = event['message']
        pk = event['pk']
        gender = event['gender']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'pk': pk,
            'gender': gender,
        }))


class AllUserConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_user_count(self):
        return User.objects.all().filter(is_staff=False).count()

    async def connect(self):
        """
        모든 유저는 'users' 그룹아래에 소비자들로 구성된다.
        새로 접속한 유저의 한해서 개별적으로 현재 유저수 정보를 얻게된다.
        """
        self.room_group_name = "users"

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'user_count': await self.get_user_count(),
        }))

    async def receive(self, text_data):
        """
        그룹정보를 보냈다면 'users' 변수를 통해 그룹원 정보를 전송
        """
        text_data_json = json.loads(text_data)
        users = ""
        if text_data_json:
            group = text_data_json['group']
            if group:
                # ex)['12', '13] > [12, 13]
                users = list(map(int, group.split('_')))

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_message',
                'user_count': await self.get_user_count(),
                'users': users
            }
        )

    async def disconnect(self, close_code):
        """
        유저가 페이지를 벗어났을때 유저는 삭제가 될것이기 때문에 남은 유저들에게 현재 유저수 - 1값을 전송.
        """
        if close_code != 4000 and self.scope['user'].is_authenticated:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_message',
                    'user_count': await self.get_user_count() - 1,
                    'users': ''
                }
            )
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def user_message(self, event):
        """
        users에 해당하는 유저가 존재한다면 그 유저의 group 정보를 전송.
        """
        user_count = event['user_count']
        users = event['users']
        group = ''

        try:
            if self.scope['user'].pk in users:
                group = await get_group(self.scope['user'])
        except:
            group = ''

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'user_count': user_count,
            'group': group
        }))


class WaiterConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_user_info(self):
        pk = self.scope['user'].pk
        user = User.objects.get(pk=pk)
        return user, user.gender, user.want_match

    async def connect(self):
        """
        본인의 큐를 찾고 내 앞의 대기자수를 반환
        """
        user, gender, want_match = await self.get_user_info()
        self.my_queue = views.get_queue(gender, want_match)
        try:
            count = self.my_queue.index(user)
        except:
            count = 0

        self.room_group_name = gender + '_' + want_match

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'waiters_count': count,
        }))

    async def receive(self, text_data):
        """
        유저가 정보를 변경하고 새로 채팅시작을 눌렀을때 실행
        유저가 다른 큐에서 대기중일때 기존 큐에서 빠져나오고 새로운 큐로 들어감.
        """
        user, gender, want_match = await self.get_user_info()
        currunt_queue = views.get_queue(gender, want_match)
        if currunt_queue != self.my_queue:
            await self.disconnect(1000)
            await self.connect()

    async def disconnect(self, close_code):
        """
        유저가 매칭이 성공되었다면 기존 큐에서 삭제되고, 대기자들에게 현재 순번을 새로 알려줌.
        """
        self.my_queue.remove(self.scope['user'])
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'waiter_message',
            }
        )
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def waiter_message(self, event):
        """
        개별적으로 자신의 순서를 계산하여 정보를 받음.
        """
        try:
            count = self.my_queue.index(self.scope['user'])
            await self.send(text_data=json.dumps({
                'waiters_count': count,
            }))
        except:
            pass
