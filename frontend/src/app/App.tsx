import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "../auth/ProtectedRoute"
import Home from "../pages/Home"
import Auth from "../pages/Auth"
import Profile from "../pages/Profile"
import Play from "../pages/Play"
import Game from "../pages/Game"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<Auth />}></Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/play" element={<Play />} />  
          <Route path="/game/:id" element={<Game />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
