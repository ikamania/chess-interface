export type Color = "w" | "b"

export type PieceType = "p" | "n" | "b" | "r" | "q" | "k"

export type PieceSymbol = "P" | "N" | "B" | "R" | "Q" | "K" | "p" | "n" | "b" | "r" | "q" | "k"

export type Piece = PieceSymbol | null

export type Board = Piece[][]
