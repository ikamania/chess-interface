import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react"
import {
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  register,
  type User
} from "./auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  loginUser: typeof login
  registerUser: typeof register
  logoutUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const access = localStorage.getItem("access")

      if (!access) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch {
        const newAccess = await refreshAccessToken()

        if (newAccess) {
          try {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
          } catch {
            setUser(null)
          }
        }
      }

      setLoading(false)
    }

    loadUser()
  }, [])

  async function loginUser(
    ...args: Parameters<typeof login>
  ) {
    const data = await login(...args)

    localStorage.setItem("access", data.access)
    localStorage.setItem("refresh", data.refresh)

    const currentUser = await getCurrentUser()

    setUser(currentUser)

    return data
  }

  async function registerUser(
    ...args: Parameters<typeof register>
  ) {
    const data = await register(...args)

    localStorage.setItem("access", data.access)
    localStorage.setItem("refresh", data.refresh)

    const currentUser = await getCurrentUser()

    setUser(currentUser)

    return data
  }

  function logoutUser() {
    logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
