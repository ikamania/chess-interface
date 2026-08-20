import type { Color } from "chess.js"
import type { PromotionPiece } from "../../websocket/gameSocket"
import Piece from "./Piece"


const PROMOTION_CHOICES: PromotionPiece[] = ["q", "r", "b", "n"]


type Props = {
  color: Color
  viewRow: number
  viewCol: number
  onSelect: (piece: PromotionPiece) => void
  onCancel: () => void
}


export default function PromotionDialog({
  color,
  viewRow,
  viewCol,
  onSelect,
  onCancel,
}: Props) {
  const fromTop = viewRow === 0

  return (
    <div
      className="absolute inset-0 z-10"
      onPointerDown={onCancel}
    >
      <div
        className={`absolute flex w-[5rem] flex-col overflow-hidden rounded-md bg-white shadow-lg ${
          fromTop ? "" : "bottom-0 flex-col-reverse"
        }`}
        style={{ left: `${viewCol * 5}rem` }}
        onPointerDown={e => e.stopPropagation()}
      >
        {PROMOTION_CHOICES.map(piece => (
          <button
            key={piece}
            onPointerDown={() => onSelect(piece)}
            className="flex h-[5rem] w-[5rem] items-center justify-center transition hover:bg-neutral-200"
            aria-label={`Promote to ${piece}`}
          >
            <Piece piece={piece} color={color} />
          </button>
        ))}
      </div>
    </div>
  )
}
