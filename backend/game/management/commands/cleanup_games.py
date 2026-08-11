from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from game.models import Game


class Command(BaseCommand):
    help = "Delete abandoned waiting games"

    def handle(self, *args, **kwargs):
        timeout = timezone.now() - timedelta(seconds=30)

        games = Game.objects.filter(
            status=Game.Status.WAITING,
            updated_at__lt=timeout,
        )

        count = games.count()

        games.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"Deleted {count} abandoned waiting games."
            )
        )

