import { useState } from "react"
import type { Chess, Color, PieceSymbol } from "chess.js"
import { isLegalMove, getLegalMoves } from "../logic/rules"
import { fromSquare } from "../utils/coordinates"


type Dragging = {
  row: number
  col: number
  piece: PieceSymbol
  color: Color
  x: number
  y: number
} | null


export function useChessDrag(
  game: Chess,
  playerColor: Color,
  onMove: (from: [number, number], to: [number, number]) => void,
) {
  const [dragging, setDragging] = useState<Dragging>(null)
  const [legalTargets, setLegalTargets] = useState<[number, number][]>([])

  function onPointerDown(
    e: React.PointerEvent,
    row: number,
    col: number,
    cell: { type: PieceSymbol; color: Color } | null,
  ) {
    if (!cell) return
    if (cell.color !== playerColor) return
    if (cell.color !== game.turn()) return

    setDragging({
      row,
      col,
      piece: cell.type,
      color: cell.color,
      x: e.clientX,
      y: e.clientY,
    })

    const targets = getLegalMoves(game, [row, col]).map(m => fromSquare(m))
    setLegalTargets(targets)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return

    setDragging({
      ...dragging,
      x: e.clientX,
      y: e.clientY,
    })
  }

  function onPointerUp(row: number, col: number) {
    if (!dragging) return

    const from: [number, number] = [dragging.row, dragging.col]
    const to: [number, number] = [row, col]

    if (isLegalMove(game, from, to)) {
      onMove(from, to)
    }

    setDragging(null)
    setLegalTargets([])
  }

  function cancelDrag() {
    setDragging(null)
    setLegalTargets([])
  }

  return {
    dragging,
    legalTargets,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    cancelDrag,
  }
}
