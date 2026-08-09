import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-[80rem] items-center justify-between px-[2rem] py-[1.5rem]">
        <button
          onClick={() => navigate("/")}
          className="text-[1.5rem] font-semibold tracking-tight"
        >
          Knightly
        </button>

        <div className="flex items-center gap-[2.5rem] text-[1rem]">
          <button onClick={() => navigate("/")}>
            Play
          </button>

          <button onClick={() => navigate("/puzzles")}>
            Puzzles
          </button>

          <button
            onClick={() => navigate(`/${user?.username}`)}
          >
            {user?.username}
          </button>
        </div>
      </nav>

      <section className="mx-auto flex max-w-[80rem] flex-col items-center gap-[5rem] px-[2rem] py-[8rem] lg:flex-row">
        <div className="max-w-[36rem]">
          <h1 className="text-[4.5rem] font-semibold tracking-tight">
            Play chess.
          </h1>

          <p className="text-[1.25rem] text-neutral-600">
            Simple, fast and beautiful.
          </p>

          <div className="mt-[2.5rem] flex gap-[1rem]">
            <button
              onClick={() => navigate("/play")}
              className="rounded-[0.5rem] bg-black px-[2rem] py-[1rem] text-[1.125rem] text-white"
            >
              Play Online
            </button>

            <button
              onClick={() => navigate("/play/computer")}
              className="rounded-[0.5rem] border border-neutral-300 px-[2rem] py-[1rem] text-[1.125rem]"
            >
              Play Computer
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
