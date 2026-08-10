import random

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Game


STARTING_FEN = (
    "rnbqkbnr/pppppppp/8/8/8/8/"
    "PPPPPPPP/RNBQKBNR w KQkq - 0 1"
)


class FindGameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        game = (
            Game.objects
            .filter(
                status=Game.Status.WAITING,
                black_player__isnull=True,
            )
            .exclude(white_player=request.user)
            .first()
        )

        if game:
            if random.choice([True, False]):
                game.black_player = request.user
            else:
                game.black_player = game.white_player
                game.white_player = request.user

            game.status = Game.Status.ACTIVE
            game.save()

            return Response({
                "matched": True,
                "game_id": game.id,
                "white_player": game.white_player.username,
                "black_player": game.black_player.username,
            })

        game = Game.objects.create(
            white_player=request.user,
            fen=STARTING_FEN,
            status=Game.Status.WAITING,
        )

        return Response(
            {
                "matched": False,
                "game_id": game.id,
            },
            status=status.HTTP_201_CREATED,
        )


class GameView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response(
                {"detail": "Game not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if (
            game.white_player != request.user
            and game.black_player != request.user
        ):
            return Response(
                {"detail": "You are not part of this game"},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response({
            "id": game.id,
            "status": game.status,
            "white_player": (
                game.white_player.username
                if game.white_player
                else None
            ),
            "black_player": (
                game.black_player.username
                if game.black_player
                else None
            ),
            "fen": game.fen,
        })
