import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Game from "../pages/Game"


function App() {
  return (
    <div className="flex justify-center">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </div>
  )
}

export default App
