import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getGame } from "../api/games"

function Game() {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) {
      navigate("/")
      return
    }

    const access = localStorage.getItem("access")

    let socket: WebSocket | null = null
    let cancelled = false

    async function connectToGame() {
      try {
        const game = await getGame(Number(id))

        console.log("Game:", game)

        if (cancelled) {
          return
        }

        socket = new WebSocket(
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
          console.log(
            "WebSocket disconnected:",
            event.code
          )
        }
      } catch (error) {
        console.error("Failed to get game:", error)
        navigate("/")
      }
    }

    connectToGame()

    return () => {
      cancelled = true
      socket?.close()
    }
  }, [id, navigate])

  return (
    <main>
      <h1>Game {id}</h1>
    </main>
  )
}

export default Game
