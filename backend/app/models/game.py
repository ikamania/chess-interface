from app.core.c_engine import send
from app.schemas.types import Color

START_FEN = "startpos"


class Game:
    def __init__(self, color: Color) -> None:
        self.color = color
        self.fen: str = START_FEN
        self.history: list[str] = []

        send("ucinewgame")

    def state(self):
        return {
            "fen": self.fen,
            "history": self.history
        }

    def reset(self):
        self.fen = START_FEN
        self.history = []

        send("ucinewgame")

        return self.state()

    def make_move(self, move: str):
        turn = self.current_turn()

        if turn != self.color:
            return {
                "ok": False,
            }

    def current_turn(self) -> str:
        if len(self.history) % 2 == 0:
            return "white"
        return "black"

