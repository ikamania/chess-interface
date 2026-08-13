from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware


class JWTAuthMiddleware(BaseMiddleware):
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope["query_string"].decode()

        query_params = parse_qs(query_string)
        token = query_params.get("token", [None])[0]

        if token is None:
            scope["user"] = None
            return await self.app(scope, receive, send)

        try:
            from rest_framework_simplejwt.tokens import AccessToken

            access_token = AccessToken(token)

            user = await self.get_user(
                access_token["user_id"]
            )
            scope["user"] = user
        except Exception:
            scope["user"] = None

        return await self.app(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        from django.contrib.auth import get_user_model

        User = get_user_model()

        return User.objects.get(id=user_id)
