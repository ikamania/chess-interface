import { useState } from "react"
import type { Board, Piece } from "../logic/board"
import { movePiece } from "../logic/move"


type Dragging = {
  row: number
  col: number
  piece: Piece
  x: number
  y: number
} | null


export function useChessDrag(board: Board) {
  const [dragging, setDragging] = useState<Dragging>(null)

  function onPointerDown(
    e: React.PointerEvent,
    row: number,
    col: number,
    piece: Piece
  ) {
    if (!piece) return

    setDragging({
      row,
      col,
      piece,
      x: e.clientX,
      y: e.clientY,
    })
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return

    setDragging({
      ...dragging,
      x: e.clientX,
      y: e.clientY,
    })
  }

  function onPointerUp(gameId: string, row: number, col: number) {
    if (!dragging) return

    movePiece(gameId, board, [dragging.row, dragging.col], [row, col])

    setDragging(null)
  }

  function cancelDrag() {
    setDragging(null)
  }

  return {
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    cancelDrag
  }
}
