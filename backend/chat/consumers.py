import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels_redis.core import RedisChannelLayer
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_user(self, pk):
        return User.objects.get(pk=pk)

    @database_sync_to_async
    def get_group(self, user):
        return user.channel.group

    @database_sync_to_async
    def get_channel(self, user):
        return user.channel.name

    @database_sync_to_async
    def set_channelName(self):
        self.scope['user'].channel.name = self.channel_name
        self.scope['user'].channel.save()

    async def connect(self):
        if not self.scope['user'].is_authenticated:
            await self.close()

        self.room_group_name = await self.get_group(self.scope['user'])
        await self.set_channelName()

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def kick_user(self, pk):
        user = await self.get_user(int(pk))
        group = await self.get_group(user)
        channel = await self.get_channel(user)
        await self.channel_layer.group_send(
            group,
            {
                'type': 'websocket.close',
            }
        )
        await self.channel_layer.group_discard(
            group,
            channel
        )

    async def disconnect(self, close_code):
        users = self.room_group_name.split('_')
        if int(users[0]) == self.scope['user'].pk:
            await self.kick_user(users[1])
        else:
            await self.kick_user(users[0])

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
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
