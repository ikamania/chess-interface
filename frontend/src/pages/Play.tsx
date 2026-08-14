import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { findGame, getGame } from "../api/games"
import Loading from "./Loading"

function Play() {
  const navigate = useNavigate()

  const [gameId, setGameId] = useState<number | null>(null)
  const [error, setError] = useState("")

  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) {
      return
    }

    startedRef.current = true

    async function startGame() {
      try {
        const data = await findGame()

        setGameId(data.game_id)

        if (data.matched) {
          navigate(`/game/${data.game_id}`)
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Failed to find a game")
        }
      }
    }

    startGame()
  }, [navigate])

  useEffect(() => {
    if (!gameId) {
      return
    }

    const interval = setInterval(async () => {
      try {
        const game = await getGame(gameId)

        if (game.status === "active") {
          navigate(`/game/${gameId}`)
        }
      } catch (error) {
        console.error("Failed to check game:", error)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [gameId, navigate])

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">
          {error}
        </p>
      </main>
    )
  }

  return (
    <Loading message={"Finding opponent..."} />
  )
}

export default Play
