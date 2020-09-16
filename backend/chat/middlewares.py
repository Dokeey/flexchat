from urllib.parse import parse_qs
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_jwt.utils import jwt_decode_handler, jwt_get_username_from_payload_handler

User = get_user_model()


@database_sync_to_async
def get_user(username):
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware:

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)


class TokenAuthMiddlewareInstance:
    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        try:
            token = parse_qs(self.scope['query_string'].decode('utf8'))["token"][0]
            payload = jwt_decode_handler(token)
            username = jwt_get_username_from_payload_handler(payload)
            self.scope['user'] = await get_user(username)
        except:
            self.scope['user'] = AnonymousUser()
        inner = self.inner(self.scope)
        return await inner(receive, send)


TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
