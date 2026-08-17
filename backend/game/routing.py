from django.urls import path

from .consumers import GameConsumer
from .matchmaking_consumer import MatchmakingConsumer


websocket_urlpatterns = [
    path(
        "ws/game/<int:game_id>/",
        GameConsumer.as_asgi(),
    ),
    path(
        "ws/matchmaking/",
        MatchmakingConsumer.as_asgi(),
    ),
]
