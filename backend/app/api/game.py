from fastapi import APIRouter, HTTPException
from app.schemas.game import MoveRequest, CreateGameRequest
from app.services.singletons import game_manager
from app.api.deps import get_game_or_404

router = APIRouter()


@router.post("/create")
def create_game(req: CreateGameRequest):
    game_id = game_manager.create_game(req.color)
    return {"game_id": game_id}


@router.get("/{game_id}/state")
def state(game_id: str):
    return get_game_or_404(game_id).state()


@router.post("/{game_id}/move")
def move(game_id: str, req: MoveRequest):
    pass


@router.post("/{game_id}/reset")
def reset(game_id: str):
    pass
