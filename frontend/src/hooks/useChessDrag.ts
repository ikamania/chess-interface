import { useState } from "react"
import type { Chess, Color, PieceSymbol } from "chess.js"
import { isLegalMove, getLegalMoves } from "../logic/rules"
import { fromSquare, toSquare } from "../utils/coordinates"
import type { PromotionPiece } from "../websocket/gameSocket"


type Dragging = {
  row: number
  col: number
  piece: PieceSymbol
  color: Color
  x: number
  y: number
} | null

type PendingPromotion = {
  from: [number, number]
  to: [number, number]
} | null


export function useChessDrag(
  game: Chess,
  playerColor: Color,
  onMove: (
    from: [number, number],
    to: [number, number],
    promotion?: PromotionPiece,
  ) => void,
) {
  const [dragging, setDragging] = useState<Dragging>(null)
  const [legalTargets, setLegalTargets] = useState<[number, number][]>([])
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion>(null)

  function isPromotionMove(
    from: [number, number],
    to: [number, number],
  ): boolean {
    const fromSq = toSquare(from[0], from[1])
    const toSq = toSquare(to[0], to[1])

    return game
      .moves({ square: fromSq, verbose: true })
      .some(m => m.to === toSq && m.promotion !== undefined)
  }

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
      if (isPromotionMove(from, to)) {
        setPendingPromotion({ from, to })
      } else {
        onMove(from, to)
      }
    }

    setDragging(null)
    setLegalTargets([])
  }

  function resolvePromotion(piece: PromotionPiece) {
    if (!pendingPromotion) return

    onMove(pendingPromotion.from, pendingPromotion.to, piece)
    setPendingPromotion(null)
  }

  function cancelPromotion() {
    setPendingPromotion(null)
  }

  function cancelDrag() {
    setDragging(null)
    setLegalTargets([])
  }

  return {
    dragging,
    legalTargets,
    pendingPromotion,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    resolvePromotion,
    cancelPromotion,
    cancelDrag,
  }
}
