
# routing.py
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from django.urls import re_path
from .consumers import TranscriptionConsumer

websocket_urlpatterns = [
    re_path(r'ws/transcribe/$', TranscriptionConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'http':get_asgi_application(),
    'websocket': URLRouter(websocket_urlpatterns),
})
