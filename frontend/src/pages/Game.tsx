import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getGame } from "../api/games"

function Game() {
  const { id } = useParams()
  const navigate = useNavigate()

  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!id) {
      navigate("/")
      return
    }

    const access = localStorage.getItem("access")

    let cancelled = false

    async function connectToGame() {
      try {
        await getGame(Number(id))

        if (cancelled) {
          return
        }

        const socket = new WebSocket(
          `ws://localhost:8000/ws/game/${id}/?token=${encodeURIComponent(access)}`
        )

        socketRef.current = socket

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

        socket.onclose = (event) => {
          console.log(
            "WebSocket disconnected:",
            event.code
          )
        }
      } catch (error) {
        console.error("Failed to connect to game:", error)
        navigate("/")
      }
    }

    connectToGame()

    return () => {
      cancelled = true

      socketRef.current?.close()
      socketRef.current = null
    }
  }, [id, navigate])

  function sendTestMessage() {
    const socket = socketRef.current

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected")
      return
    }

    socket.send(
      JSON.stringify({
        type: "test",
        message: "Hello from player!",
      })
    )
  }

  return (
    <main>
      <h1>Game {id}</h1>

      <button onClick={sendTestMessage}>
        Send test message
      </button>
    </main>
  )
}

export default Game
