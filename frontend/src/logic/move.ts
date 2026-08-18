import type { Chess, Move } from "chess.js"
import { toSquare } from "../utils/coordinates"


export function makeMove(
  game: Chess,
  from: [number, number],
  to: [number, number],
  promotion?: string,
): Move | null {
  const fromSq = toSquare(from[0], from[1])
  const toSq = toSquare(to[0], to[1])

  try {
    return game.move({ from: fromSq, to: toSq, promotion }) ?? null
  } catch {
    return null
  }
}
