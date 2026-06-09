import Piece from "./Piece"
import type { Piece as PieceType } from "../../logic/board"


type Props = {
  isDark: boolean
  piece: PieceType
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: () => void
}


export default function Square({ isDark, piece, onPointerDown, onPointerUp }: Props) {
  return (
    <div
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
      className={`w-[5rem] h-[5rem] flex items-center justify-center ${
        isDark ? "bg-[#739552]" : "bg-[#ebecd0]"
      }`}
    >
      {piece && <Piece piece={piece} />}
    </div>
  )
}
