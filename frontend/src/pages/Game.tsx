import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

function Game() {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) {
      navigate("/play")
      return
    }

    const access = localStorage.getItem("access")

    const socket = new WebSocket(
      `ws://localhost:8000/ws/game/${id}/?token=${encodeURIComponent(access)}`
    )

    socket.onopen = () => {
      console.log("WebSocket connected")
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "connected") {
        console.log(`Connected to game ${data.game_id}`)
      }
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    socket.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code)

      navigate("/")
    }

    return () => {
      socket.close()
    }
  }, [id, navigate])

  return (
    <main>
      <h1>Game {id}</h1>
    </main>
  )
}

export default Game
