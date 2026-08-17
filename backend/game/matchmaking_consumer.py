from channels.generic.websocket import AsyncJsonWebsocketConsumer


class MatchmakingConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user")

        if not self.user or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        self.group_name = f"matchmaking_{self.user.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

        await self.send_json({
            "type": "connected",
        })

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name,
            )

    async def matched(self, event):
        await self.send_json({
            "type": "matched",
            "game_id": event["game_id"],
        })
