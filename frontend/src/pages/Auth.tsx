import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, register } from "../auth/AuthContext"

function Auth() {
  const [isLogin, setIsLogin] = useState(true)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      if (isLogin) {
        const data = await login({
          email,
          password
        })

        localStorage.setItem("access", data.access)
        localStorage.setItem("refresh", data.refresh)
      } else {
        const data = await register({
          username,
          email,
          password
        })

        localStorage.setItem("access", data.access)
        localStorage.setItem("refresh", data.refresh)
      }

      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="flex min-h-screen justify-center bg-white px-6 pt-[7rem]">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>

        <p className="mb-8 text-sm text-neutral-500">
          {isLogin
            ? "Sign in to continue."
            : "Create an account to continue."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full border-b border-neutral-300 py-3 outline-none focus:border-black"
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border-b border-neutral-300 py-3 outline-none focus:border-black"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border-b border-neutral-300 py-3 outline-none focus:border-black"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="mt-4 w-full rounded-md bg-black py-3 text-white transition hover:opacity-90">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-sm text-neutral-500 hover:text-black"
        >
          {isLogin
            ? "Create an account"
            : "Already have an account?"}
        </button>
      </div>
    </main>
  )
}

export default Auth
