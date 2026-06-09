import type { Board } from "../../logic/board"
import Square from "./Square"
import Piece from "./Piece"
import { useChessDrag } from "../../hooks/useChessDrag"


type Props = {
  gameId: string
  board: Board
  orientation: "white" | "black"
}


export default function ChessBoard({ gameId, board, orientation }: Props) {
  const {
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    cancelDrag,
  } = useChessDrag(board)

  if (!board) return null

  return (
    <div
      className={`w-fit border select-none relative ${dragging ? "cursor-grabbing" : ""}`}
      onPointerMove={onPointerMove}
      onPointerLeave={cancelDrag}
    >
      {board.map((_, r) => (
        <div key={r} className="flex">
          {board.map((_, c) => {
            const viewR = orientation === "white" ? r : 7 - r
            const viewC = orientation === "white" ? c : 7 - c
            const piece = board[viewR][viewC]

            const isDark = (viewR + viewC) % 2 === 1;

            const hidden =
              dragging?.row === viewR &&
              dragging?.col === viewC

            return (
              <Square
                key={`${r}-${c}`}
                isDark={isDark}
                piece={hidden ? null : piece}
                onPointerDown={(e) => onPointerDown(e, viewR, viewC, piece)}
                onPointerUp={() => onPointerUp(gameId, viewR, viewC)}
              />
            );
          })}
        </div>
      ))}

      {dragging && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: dragging.x,
            top: dragging.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Piece piece={dragging.piece} />
        </div>
      )}
    </div>
  )
}
