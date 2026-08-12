from channels.generic.websocket import AsyncJsonWebsocketConsumer


class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        
        await self.accept()

        await self.send_json({
            "type": "connected",
            "game_id": self.game_id,
        })

    async def disconnect(self, close_code):
        print(
            f"Player disconnected from game {self.game_id}"
        )
