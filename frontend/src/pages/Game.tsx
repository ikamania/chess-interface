import { useParams } from "react-router-dom"
import { useGame } from "../hooks/useGame"
import ChessBoard from "../components/board/ChessBoard"

function Game() {
  const { id } = useParams<{ id: string }>()
  
  if (!id) return "loading"

  const {
    state,
    board,
  } = useGame(id ?? "")
  
  if (!state || !board) return "loading"

  return (
    <div className="pt-[2rem] pl-[2rem]">
      <ChessBoard gameId={id} board={board} orientation={state.playerColor}/>
    </div>
  )
}

export default Game 
