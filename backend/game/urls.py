from django.urls import path

from .views import FindGameView, GameView

urlpatterns = [
    path("find/", FindGameView.as_view(), name="find-game"),
    path("<int:game_id>/", GameView.as_view(), name="game"),
]
