import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ChessBoard from "../components/board/ChessBoard"
import type { Board } from "../logic/board"
import { parseFEN } from "../utils/fen"

function Game() {
  const { id } = useParams()
  const navigate = useNavigate()

  const socketRef = useRef<WebSocket | null>(null)

  const [board, setBoard] = useState<Board | null>(null)
  const [color, setColor] = useState<"white" | "black">("white")

  useEffect(() => {
    if (!id) {
      navigate("/")
      return
    }

    const access = localStorage.getItem("access")

    if (!access) {
      navigate("/")
      return
    }

    const socket = new WebSocket(
      `ws://localhost:8000/ws/game/${id}/?token=${encodeURIComponent(access)}`
    )

    socketRef.current = socket

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "game_state") {
        setBoard(parseFEN(data.fen))
        setColor(data.color)
      }
    }

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [id, navigate])

  if (!board) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading game...</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <ChessBoard
        gameId={id!}
        board={board}
        orientation={color}
      />
    </main>
  )
}

export default Game
