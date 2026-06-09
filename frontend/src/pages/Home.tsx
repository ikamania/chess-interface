import { useNavigate } from "react-router-dom"
import { newGame } from "../services/api"
import PlayButton from "./home/playButton"


function Home() {
  const navigate = useNavigate()

  async function handleCreateGame(yourColor: "white" | "black") {
    const data = await newGame(yourColor)

    navigate(`/game/${data.game_id}`)
  }

  return (
    <div className="pt-[2rem] pl-[2rem] flex flex-col w-[15rem] gap-[0.5rem]">
      <PlayButton onClick={handleCreateGame} yourColor="white" />
      <PlayButton onClick={handleCreateGame} yourColor="black" />
    </div>
  )
}

export default Home
