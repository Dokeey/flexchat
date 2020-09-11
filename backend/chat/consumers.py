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
        text_data_json = json.loads(text_data)
        users = ""
        if text_data_json:
            group = text_data_json['group']
            if group:
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
        if close_code != 4000:
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
        # text_data_json = json.loads(text_data)
        # put = text_data_json['put']
        print("왔어")
        user, gender, want_match = await self.get_user_info()
        currunt_queue = views.get_queue(gender, want_match)
        if currunt_queue != self.my_queue:
            await self.disconnect(1000)
            await self.connect()

    async def disconnect(self, close_code):
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

        try:
            count = self.my_queue.index(self.scope['user'])
            await self.send(text_data=json.dumps({
                'waiters_count': count,
            }))
        except:
            pass
