from django.conf import settings
from django.db import models


class Game(models.Model):
    class Status(models.TextChoices):
        WAITING = "waiting"
        ACTIVE = "active"
        FINISHED = "finished"

    white_player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="white_games",
        null=True,
        blank=True,
    )

    black_player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="black_games",
        null=True,
        blank=True,
    )

    fen = models.CharField(max_length=100)

    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.WAITING,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
