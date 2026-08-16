from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import Game


class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        url_route = self.scope.get("url_route")

        if not url_route:
            await self.close(code=4000)
            return

        self.game_id = url_route["kwargs"]["game_id"]
        self.user = self.scope.get("user")

        if not self.user or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        game = await self.get_game()

        if not game:
            await self.close(code=4004)
            return

        if self.user.id not in [
            game.white_player_id,
            game.black_player_id,
        ]:
            await self.close(code=4003)
            return

        self.player_color = (
            "white"
            if game.white_player_id == self.user.id
            else "black"
        )

        self.game_group_name = f"game_{self.game_id}"

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name,
        )

        await self.accept()

        await self.send_json({
            "type": "game_state",
            "game_id": self.game_id,
            "fen": game.fen,
            "color": self.player_color,
            "status": game.status,
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
            await self.handle_draw()
        elif message_type == "draw_response":
            await self.handle_draw_response(content)
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

        # Move processing will go here

    async def handle_draw(self):
        game = await self.get_active_game()

        if not game:
            return

        await self.channel_layer.group_send(
            self.game_group_name,
            {
                "type": "draw_offer",
                "sender": self.player_color,
            }
        )

    async def draw_offer(self, event):
        if event["sender"] == self.player_color:
            return

        await self.send_json({
            "type": "draw_offer"
        })

    async def handle_draw_response(self, content):
        accepted = content.get("accepted")

        if accepted is None:
            return

        game = await self.get_active_game()

        if not game:
            return

        if accepted:
            await self.end_game()

            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "game_message",
                    "data": {
                        "type": "game_over",
                        "reason": "draw",
                        "winner": None,
                    },
                },
            )
        else:
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "draw_declined",
                },
            )

    async def draw_declined(self, event):
        await self.send_json({
            "type": "draw_declined",
        })

    async def handle_resign(self):
        game = await self.get_active_game()

        if not game:
            return

        winner = (
            "black"
            if self.player_color == "white"
            else "white"
        )

        await self.end_game()

        await self.channel_layer.group_send(
            self.game_group_name,
            {
                "type": "game_message",
                "data": {
                    "type": "game_over",
                    "reason": "resignation",
                    "winner": winner,
                },
            },
        )

    async def game_message(self, event):
        await self.send_json(event["data"])

    async def get_active_game(self):
        game = await self.get_game()

        if not game:
            return
        if game.status != Game.Status.ACTIVE:
            return

        return game

    @database_sync_to_async
    def get_game(self):
        try:
            return Game.objects.get(id=self.game_id)
        except Game.DoesNotExist:
            return None

    @database_sync_to_async
    def end_game(self):
        game = Game.objects.get(id=self.game_id)

        game.status = Game.Status.FINISHED
        game.save(update_fields=["status"])
