const API_URL = "http://localhost:8000"


export async function newGame(playerColor: "white" | "black") {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerColor }),
  })

  return response.json()
}


export async function getState(gameId: string) {
  const response = await fetch(`${API_URL}/${gameId}/state`)

  return response.json()
}


export async function makeMove(gameId: string, move: string) {
  const response = await fetch(`${API_URL}/${gameId}/move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ move }),
  })

  return response.json()
}


export async function resetGame(gameId: string) {
  const response = await fetch(`${API_URL}/${gameId}/reset`, {
    method: "POST",
  })

  return response.json()
}
