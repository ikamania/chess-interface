from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import Game


class GameConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.user = self.scope.get("user")

        if not self.user or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        if not await self.is_game_player():
            await self.close(code=4003)
            return

        await self.accept()

        await self.send_json({
            "type": "connected",
            "game_id": self.game_id,
        })

    async def disconnect(self, close_code):
        print(
            f"User {self.user} disconnected "
            f"from game {self.game_id}"
        )

    @database_sync_to_async
    def is_game_player(self):
        try:
            game = Game.objects.get(id=self.game_id)
        except Game.DoesNotExist:
            return False

        return (
            game.white_player_id == self.user.id
            or game.black_player_id == self.user.id
        )
