import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getUserProfile, type UserProfile } from "../auth/auth"

function Profile() {
  const { username } = useParams()
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

  if (loading) {
    return null
  }

  if (error) {
    return (
      <div className="py-[1rem] flex justify-center">
          <p className="text-[3rem] font-bold">
            {error}
          </p>
      </div>
    )
  }

  return (
    <div className="p-[2rem]">
      <h1 className="text-[2rem] font-semibold">
        {user?.username}
      </h1>

      <p className="mt-[0.1rem] text-neutral-500">
        {user?.email}
      </p>
    </div>
  )
}

export default Profile
