import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "../auth/ProtectedRoute"
import Home from "../pages/Home"
import Auth from "../pages/Auth.tsx"
import Game from "../pages/Game"


function App() {
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<Auth />}></Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
