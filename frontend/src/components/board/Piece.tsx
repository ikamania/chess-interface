import type { PieceSymbol } from "../../logic/board"

const PIECES_ASSET_PATH = "/pieces/"

type Props = {
  piece: PieceSymbol
}

export default function Piece({ piece }: Props) {
  return (
    <img src={`${PIECES_ASSET_PATH}${piece}.png`} className="w-[5rem] h-[5rem] select-none cursor-grab" />
  )
}
