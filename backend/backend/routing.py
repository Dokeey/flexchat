from channels.routing import ProtocolTypeRouter, URLRouter

from chat.middlewares import TokenAuthMiddleware, TokenAuthMiddlewareStack
from chat.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    'websocket': TokenAuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})