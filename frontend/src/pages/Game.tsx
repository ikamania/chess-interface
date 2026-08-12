import { useEffect } from "react"
import { useParams } from "react-router-dom"

function Game() {
  const { id } = useParams()

  useEffect(() => {
    if (!id) {
      return
    }

    const socket = new WebSocket(
      `ws://localhost:8000/ws/game/${id}/`
    )

    socket.onopen = () => {
      console.log("WebSocket connected")
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      console.log("WebSocket message:", data)
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    socket.onclose = () => {
      console.log("WebSocket disconnected")
    }

    return () => {
      socket.close()
    }
  }, [id])

  return (
    <main>
      <h1>Game {id}</h1>
    </main>
  )
}

export default Game
