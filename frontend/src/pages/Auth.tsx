import { useState } from "react"

function Auth() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <main className="flex min-h-screen justify-center bg-white px-6 text-black pt-[5rem]">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-4xl font-semibold tracking-tight">
          Knightly
        </h1>

        <p className="mt-3 text-center text-base text-neutral-500">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </p>

        <form className="mt-10 space-y-5">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-lg border border-neutral-200 px-5 py-4 text-base outline-none transition focus:border-black"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-neutral-200 px-5 py-4 text-base outline-none transition focus:border-black"
          />

          <input
            type="password"
            placeholder="Password"
              className="w-full rounded-lg border border-neutral-200 px-5 py-4 text-base outline-none transition focus:border-black"
          />

          <button
            className="w-full rounded-lg bg-black py-4 text-base text-white transition hover:bg-neutral-800 active:scale-[0.98]"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-8 text-center text-base text-neutral-500">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="font-medium text-black underline-offset-4 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="font-medium text-black underline-offset-4 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  )
}

export default Auth
