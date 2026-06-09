from app.models.game import Game
from app.schemas.types import Color
import uuid


class GameManager:
    def __init__(self) -> None:
        self.games: dict[str, Game] = {}

    def create_game(self, player_color: Color) -> str:
        game_id = str(uuid.uuid4())
        self.games[game_id] = Game(player_color=player_color)

        return game_id

    def get_game(self, game_id: str) -> Game:
        if game_id not in self.games:
            raise KeyError("game not found")

        return self.games[game_id]
