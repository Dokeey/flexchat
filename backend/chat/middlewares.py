from urllib.parse import parse_qs
from channels.auth import AuthMiddlewareStack
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_jwt.utils import jwt_decode_handler, jwt_get_username_from_payload_handler

User = get_user_model()


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        try:
            token = parse_qs(scope['query_string'].decode('utf8'))["token"][0]
            payload = jwt_decode_handler(token)
            username = jwt_get_username_from_payload_handler(payload)
            scope['username'] = username
            # scope['user'] = get_user_model().objects.get(username=user)
            # close_old_connections()
        except:
            scope['user'] = AnonymousUser()

        return self.inner(scope)


TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
