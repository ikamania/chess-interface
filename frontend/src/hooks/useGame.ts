import { useEffect, useState } from "react"
import { getState, makeMove, resetGame } from "../services/api"
import { parseFEN } from "../utils/fen.ts"
import type { Board } from "../logic/board.ts"


type GameState = {
  playerColor: "white" | "black"
  fen: string
}


export function useGame(gameId: string) {
  const [state, setState] = useState<GameState | null>(null)

  useEffect(() => {
    load()
  }, [gameId])

  const board: Board | null = state?.fen ? parseFEN(state.fen) : null

  async function load() {
    const data = await getState(gameId)
    setState(data)
  }

  async function playMove(uci: string) {
    const data = await makeMove(gameId, uci)
    setState(data.state)
  }

  async function reset() {
    const data = await resetGame(gameId)
    setState(data)
  }

  return {
    state,
    board,
    playMove,
    reset,
  }
}
