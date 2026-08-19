import { GAME_WS_URL } from "../config"

export type GameMessage =
  | {
      type: "resign"
    }
  | {
      type: "draw"
    }
  |
    {
      type: "draw_response"
      accepted: boolean
    }
  | {
      type: "move"
      from: string
      to: string
    }

export type ServerMessage =
  | {
      type: "game_state"
      game_id: string
      fen: string
      color: "white" | "black"
      status: string
    }
  | {
      type: "move_made"
      from: string
      to: string
    }
  | {
      type: "opponent_move"
      from: string
      to: string
    }
  | {
      type: "draw_offer"
    }
  | {
      type: "draw_declined"
    }
  | {
      type: "game_over"
      reason: string
      winner: "white" | "black" | null
    }

export function createGameSocket(
  gameId: string,
  onMessage: (data: any) => void
) {
  const access = localStorage.getItem("access")

  const socket = new WebSocket(
    `${GAME_WS_URL}/${gameId}/?token=${encodeURIComponent(access ?? "")}`
  )

  let closed = false

  socket.onmessage = (event) => {
    onMessage(JSON.parse(event.data))
  }

  socket.onclose = () => {
    closed = true
  }

  return {
    send(message: GameMessage) {
      if (!closed && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message))
      }
    },
    close() {
      closed = true
      socket.close()
    },
  }
}
