import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "../auth/ProtectedRoute"
import Home from "../pages/Home"
import Auth from "../pages/Auth"
import Profile from "../pages/Profile"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<Auth />}></Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/:username" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
