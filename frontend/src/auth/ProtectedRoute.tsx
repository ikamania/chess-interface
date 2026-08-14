import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { refreshAccessToken } from "../api/auth"
import Loading from "../pages/Loading"

function ProtectedRoute() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuthentication() {
      const access = localStorage.getItem("access")
      const refresh = localStorage.getItem("refresh")

      if (!access && refresh) {
        await refreshAccessToken()
      }

      setLoading(false)
    }

    checkAuthentication()
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  const access = localStorage.getItem("access")

  if (!access) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
