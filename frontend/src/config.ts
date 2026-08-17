const API_HOST = import.meta.env.VITE_API_HOST ?? "http://localhost:8000"
const WS_HOST = import.meta.env.VITE_WS_HOST ?? "ws://localhost:8000"

export const API_URL = `${API_HOST}/auth`
export const GAMES_API_URL = `${API_HOST}/games`
export const GAME_WS_URL = `${WS_HOST}/ws/game`
export const MATCHMAKING_WS_URL = `${WS_HOST}/ws/matchmaking`
