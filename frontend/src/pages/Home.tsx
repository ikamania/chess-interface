import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-white text-black">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          Knightly
        </button>

        <div className="flex items-center gap-10 text-base">
          <button
            onClick={() => navigate("/")}
            className="transition-colors duration-200 hover:text-neutral-500"
          >
            Play
          </button>

          <button
            onClick={() => navigate("/puzzles")}
            className="transition-colors duration-200 hover:text-neutral-500"
          >
            Puzzles
          </button>
        </div>
      </nav>

      <section className="mx-auto flex max-w-7xl flex-col items-center gap-20 px-8 py-32 lg:flex-row">
        <div className="max-w-xl">
          <h1 className="text-7xl font-semibold tracking-tight">
            Play chess.
          </h1>

          <p className="mt-8 text-xl text-neutral-600">
            Simple, fast and beautiful.
          </p>

          <div className="mt-12 flex gap-4">
            <button
              onClick={() => navigate("/play")}
              className="rounded-lg bg-black px-8 py-4 text-lg text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0 active:scale-95"
            >
              Play Online
            </button>

            <button
              onClick={() => navigate("/play/computer")}
              className="rounded-lg border border-neutral-300 px-8 py-4 text-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-neutral-100 active:translate-y-0 active:scale-95"
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
