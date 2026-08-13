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

        self.game_group_name = f"game_{self.game_id}"

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name,
        )

        await self.accept()

        await self.send_json({
            "type": "connected",
            "game_id": self.game_id,
        })

    async def disconnect(self, close_code):
        if hasattr(self, "game_group_name"):
            await self.channel_layer.group_discard(
                self.game_group_name,
                self.channel_name,
            )

    async def receive_json(self, content):
        await self.channel_layer.group_send(
            self.game_group_name,
            {
                "type": "game_message",
                "data": content,
            },
        )

    async def game_message(self, event):
        await self.send_json({
            "type": "game_message",
            "data": event["data"],
        })

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
