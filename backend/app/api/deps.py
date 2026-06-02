from fastapi import HTTPException
from app.services.singletons import game_manager
from app.models.game import Game


def get_game_or_404(game_id: str) -> Game:
    try:
        return game_manager.get_game(game_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="game not found")
