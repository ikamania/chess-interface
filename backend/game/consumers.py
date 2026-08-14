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

        game = await self.get_game()

        if not game:
            await self.close(code=4004)
            return

        if (
            self.user.id not in [game.white_player_id, game.black_player_id]
        ):
            await self.close(code=4003)
            return

        self.game_group_name = f"game_{self.game_id}"

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name,
        )

        await self.accept()

        player_color = (
            "white"
            if game.white_player_id == self.user.id
            else "black"
        )

        await self.send_json({
            "type": "game_state",
            "game_id": self.game_id,
            "fen": game.fen,
            "color": player_color,
        })

    async def disconnect(self, close_code):
        if hasattr(self, "game_group_name"):
            await self.channel_layer.group_discard(
                self.game_group_name,
                self.channel_name,
            )

    async def receive_json(self, content):
        message_type = content.get("type")

        if message_type == "move":
            await self.handle_move(content)
        elif message_type == "draw":
            await self.handle_draw(content)
        elif message_type == "resign":
            await self.handle_resign()
        else:
            await self.send_json({
                "type": "error",
                "message": "Unknown message type",
            })

    async def handle_move(self, content):
        from_square = content.get("from")
        to_square = content.get("to")

        if not from_square or not to_square:
            await self.send_json({
                "type": "error",
                "message": "Move requires from and to",
            })
            return

        # mian proccess

    async def handle_draw(self, content):
        return

    async def handle_resign(self):
        return

    async def game_message(self, event):
        await self.send_json({
            "type": "game_message",
            "data": event["data"],
        })

    @database_sync_to_async
    def get_game(self):
        try:
            return Game.objects.get(id=self.game_id)
        except Game.DoesNotExist:
            return None
