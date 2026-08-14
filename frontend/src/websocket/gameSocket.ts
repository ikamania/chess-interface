export type GameMessage =
  | {
      type: "resign"
    }
  | {
      type: "draw"
    }
  | {
      type: "move"
      from: string
      to: string
    }

export function sendGameMessage(
  socket: WebSocket | null,
  message: GameMessage
) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return
  }

  socket.send(JSON.stringify(message))
}
