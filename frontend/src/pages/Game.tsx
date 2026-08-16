import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { sendGameMessage } from "../websocket/gameSocket"
import ChessBoard from "../components/board/ChessBoard"
import type { Board } from "../logic/board"
import { parseFEN } from "../utils/fen"
import Loading from "./Loading"

function Game() {
  const { id } = useParams()
  const navigate = useNavigate()

  const socketRef = useRef<WebSocket | null>(null)

  const [board, setBoard] = useState<Board | null>(null)
  const [color, setColor] = useState<"white" | "black">("white")

  const [gameOver, setGameOver] = useState<{
    reason: string
    winner: "white" | "black" | null
  } | null>(null)

  const [drawOffer, setDrawOffer] = useState<
    "none" | "sent" | "received"
  >("none")

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
        if (data.status !== "active") {
          navigate("/")
          return
        }

        setBoard(parseFEN(data.fen))
        setColor(data.color)
      }
      if (data.type === "draw_offer") {
        setDrawOffer("received")
      }
      if (data.type === "draw_declined") {
        setDrawOffer("none")
      }
      if (data.type === "game_over") {
        setGameOver({
          reason: data.reason,
          winner: data.winner ?? null,
        })

        setDrawOffer("none")
      }
    }

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [id, navigate])

  function sendMessage(type: "draw" | "resign") {
    sendGameMessage(socketRef.current, {
      type,
    })
  }

  function handleDraw() {
    if (drawOffer === "none") {
      sendMessage("draw")
      setDrawOffer("sent")
    }
  }

  function respondToDraw(accepted: boolean) {
    sendGameMessage(socketRef.current, {
      type: "draw_response",
      accepted,
    })

    setDrawOffer("none")
  }

  if (!board) {
    return <Loading message="Loading game..." />
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-[2rem]">
        <div className="relative">
          <ChessBoard
            gameId={id!}
            board={board}
            orientation={color}
          />

          {gameOver && (
            <div className="absolute left-1/2 top-1/2 w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-neutral-200 bg-white p-[1.5rem] text-center shadow-lg">
              <p className="text-sm font-bold text-neutral-500">
                {gameOver.reason === "draw"
                  ? "Draw"
                  : gameOver.reason === "resignation"
                    ? gameOver.winner === color
                      ? "Opponent resigned"
                      : "You resigned"
                    : "Game over"}
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-[1rem] w-full rounded-md bg-black px-[1rem] py-[0.5rem] text-sm text-white transition hover:opacity-90"
              >
                Home
              </button>
            </div>
          )}
        </div>

        <div className="flex w-[8rem] flex-col gap-[0.75rem]">
          {drawOffer === "received" ? (
            <div className="flex w-full overflow-hidden rounded-md border border-neutral-300">
              <button
                onClick={() => respondToDraw(true)}
                disabled={!!gameOver}
                className="flex-1 px-[0.5rem] py-[0.5rem] text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Accept draw"
              >
                ✓
              </button>

              <button
                onClick={() => respondToDraw(false)}
                disabled={!!gameOver}
                className="flex-1 border-l border-neutral-300 px-[0.5rem] py-[0.5rem] text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Decline draw"
              >
                x
              </button>
            </div>
          ) : (
            <button
              onClick={handleDraw}
              disabled={!!gameOver || drawOffer === "sent"}
              className="w-full rounded-md border border-neutral-300 px-[1rem] py-[0.5rem] text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {drawOffer === "sent"
                ? "Offered"
                : "Draw"}
            </button>
          )}

          <button
            onClick={() => sendMessage("resign")}
            disabled={!!gameOver}
            className="w-full rounded-md bg-black px-[1rem] py-[0.5rem] text-sm text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Resign
          </button>
        </div>
      </div>
    </main>
  )
}

export default Game
