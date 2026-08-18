import type { Board, Piece } from "../logic/board"


export function parseFEN(fen: string): Board {
  const boardPart = fen.split(" ")[0]
  const boardRows = boardPart.split("/")

  const board: Piece[][] = []
  for (const row of boardRows) {
    const parsedRow: Piece[] = []

    for (const char of row) {
      if (isNaN(Number(char))) {
        parsedRow.push(char as Piece)
      } else {
        const emptyCount = Number(char)
        for (let i = 0; i < emptyCount; i++) {
          parsedRow.push(null)
        }
      }
    }
    board.push(parsedRow)
  }

  return board
}
