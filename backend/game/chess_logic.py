import chess


def validate_and_apply_move(fen: str, from_sq: str, to_sq: str) -> dict:
    board = chess.Board(fen)

    from_square = chess.parse_square(from_sq)
    to_square = chess.parse_square(to_sq)
    move = chess.Move(from_square, to_square)

    if move not in board.legal_moves:
        return {"valid": False}
    
    board.push(move)

    checkmate = board.is_checkmate()
    stalemate = board.is_stalemate()


    result = {
        "valid": True,
        "new_fen": board.fen(),
        "is_checkmate": checkmate, 
        "is_stalmate": stalemate,
        "is_game_over": stalemate or checkmate,
    }
    return result
