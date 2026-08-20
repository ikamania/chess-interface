import type { Chess } from "chess.js"
import type { Square } from "chess.js"
import { toSquare } from "../utils/coordinates"


export function getLegalMoves(game: Chess, from: [number, number]): Square[] {
  const square = toSquare(from[0], from[1])
  return game.moves({ square, verbose: true }).map(m => m.to)
}


export function isLegalMove(
  game: Chess,
  from: [number, number],
  to: [number, number],
): boolean {
  const fromSq = toSquare(from[0], from[1])
  const toSq = toSquare(to[0], to[1])
  const moves = game.moves({ square: fromSq, verbose: true })
  return moves.some(m => m.to === toSq)
}
