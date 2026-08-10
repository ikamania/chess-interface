import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getUserProfile, logout, type UserProfile } from "../api/auth"

function Profile() {
  const { username } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!username) {
      return
    }

    async function fetchUser() {
      try {
        const data = await getUserProfile(username)
        setUser(data)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Failed to load profile")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username])

  function handleLogout() {
    logout()
    navigate("/auth")
  }

  if (loading) {
    return null
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <main className="min-h-screen bg-white px-[2rem] py-[1.5rem]">
      <button
        onClick={handleLogout}
        className="absolute right-[2rem] top-[1.5rem] font-bold"
      >
        Logout
      </button>

      <h1 className="text-[2rem] font-semibold tracking-tight">
        {user?.username}
      </h1>

      <p className="mt-[0.1rem] text-neutral-500">
        {user?.email}
      </p>
    </main>
  )
}

export default Profile
