const API_URL = "http://localhost:8000/games"

export interface FindGameResponse {
  matched: boolean
  game_id: number
}

export interface GameResponse {
  id: number
  status: string
  white_player: string | null
  black_player: string | null
  fen: string
}

export async function findGame(): Promise<FindGameResponse> {
  const access = localStorage.getItem("access")

  const response = await fetch(`${API_URL}/find/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to find a game")
  }

  return response.json()
}

export async function getGame(
  gameId: number
): Promise<GameResponse> {
  const access = localStorage.getItem("access")

  const response = await fetch(`${API_URL}/${gameId}/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to get game")
  }

  return response.json()
}

export async function cancelGame(gameId: number): Promise<void> {
  const access = localStorage.getItem("access")

  const response = await fetch(`${API_URL}/${gameId}/cancel`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to cancel game")
  }
}
