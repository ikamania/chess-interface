import { MATCHMAKING_WS_URL } from "../config"

export function createMatchmakingSocket(
  onOpen: () => void,
  onMessage: (data: any) => void,
  onError?: () => void
) {
  const access = localStorage.getItem("access")

  const socket = new WebSocket(
    `${MATCHMAKING_WS_URL}/?token=${encodeURIComponent(access ?? "")}`
  )

  let connected = false
  let closed = false

  socket.onopen = () => {
    connected = true
    onOpen()
  }

  socket.onmessage = (event) => {
    onMessage(JSON.parse(event.data))
  }

  socket.onerror = (event) => {
    if (!connected && !closed) {
      onError?.()
    }
  }

  socket.onclose = () => {
    closed = true
  }

  return {
    close() {
      closed = true
      socket.close()
    },
  }
}
