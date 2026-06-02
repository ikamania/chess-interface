from app.schemas.types import Color
from pydantic import BaseModel


class MoveRequest(BaseModel):
    move: str


class CreateGameRequest(BaseModel):
    color: Color
