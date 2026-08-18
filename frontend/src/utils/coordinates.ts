import type { Square } from "chess.js"

export function toSquare(row: number, col: number): Square {
  const file = String.fromCharCode(97 + col)
  const rank = String(8 - row)

  return `${file}${rank}` as Square
}

export function fromSquare(square: Square): [number, number] {
  const col = square.charCodeAt(0) - 97
  const row = 8 - Number(square[1])

  return [row, col]
}
