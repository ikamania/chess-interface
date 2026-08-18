import Piece from "./Piece"
import type { Piece as PieceType } from "chess.js"


type Props = {
  isDark: boolean
  piece: PieceType | null
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: () => void
  isLegalTarget: boolean
}


export default function Square({ isDark, piece, onPointerDown, onPointerUp, isLegalTarget }: Props) {
  return (
    <div
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
      className={`w-[5rem] h-[5rem] flex items-center justify-center relative ${
        isDark ? "bg-[#739552]" : "bg-[#ebecd0]"
      }`}
    >
      {piece && <Piece piece={piece.type} color={piece.color} />}

      {isLegalTarget && (
        <div className="absolute w-3 h-3 rounded-full bg-black/20" />
      )}
    </div>
  )
}
