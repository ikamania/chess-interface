import type { Board } from "../logic/board"


export function parseFEN(fen: string): Board{
  const boardPart = fen.split(" ")[0]
  const boardRows = boardPart.split("/")

  const board: string[][] = []
  for (const row of boardRows) {
    const parsedRow: string[] = []

    for (const char of row) {
      if (isNaN(Number(char))) {
        parsedRow.push(char)
      } else {
        const emptyCount = Number(char)
        for (let i = 0; i < emptyCount; i++) {
          parsedRow.push("")
        }
      }
    }
    board.push(parsedRow)
  }

  return board
}
