import type { Board } from "./board"
import { isValidMove } from "./rules"


export function  movePiece(
  gameId: string,
  board: Board,
  from: [number, number],
  to: [number, number]
): Board | null {
  if (!isValidMove(board, from, to)) {
    // move here
  }
  return null
}
