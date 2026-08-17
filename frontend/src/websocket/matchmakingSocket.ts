export function createMatchmakingSocket(
  onOpen: () => void,
  onMessage: (data: any) => void,
  onError?: () => void
) {
  const access = localStorage.getItem("access")

  const socket = new WebSocket(
    `ws://localhost:8000/ws/matchmaking/?token=${encodeURIComponent(
      access ?? ""
    )}`
  )

  let connected = false
  let closed = false

  socket.onopen = () => {
    connected = true
    console.log("Matchmaking WebSocket connected")
    onOpen()
  }

  socket.onmessage = (event) => {
    console.log("Matchmaking message:", event.data)
    onMessage(JSON.parse(event.data))
  }

  socket.onerror = (event) => {
    console.error("Matchmaking WebSocket error:", event)

    if (!connected && !closed) {
      onError?.()
    }
  }

  socket.onclose = (event) => {
    console.log(
      "Matchmaking WebSocket closed:",
      event.code,
      event.reason
    )
  }

  return {
    close() {
      closed = true
      socket.close()
    },
  }
}
