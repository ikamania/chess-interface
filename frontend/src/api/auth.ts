import { API_URL } from "../config"

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh: string
}

export interface User {
  username: string
  email: string
}

export interface UserProfile {
  username: string
  email: string
}

export async function getUserProfile(username: string): Promise<UserProfile> {
  const access = localStorage.getItem("access")

  const response = await fetch(
    `${API_URL}/users/${username}/`,
    {
      headers: {
        Authorization: `Bearer ${access}`
      }
    }
  )

  if (!response.ok) {
    throw new Error("Failed to load profile")
  }

  return response.json()
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error("Invalid email or password")
  }

  return response.json()
}

export async function register(
  data: RegisterData
): Promise<AuthResponse> {
  if (data.password.length < 8) {
    throw new Error("Password must be at least 8 characters")
  }

  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(
      error.detail ||
      error.email?.[0] ||
      error.username?.[0] ||
      "Registration failed"
    )
  }

  return response.json()
}

export async function getCurrentUser(): Promise<User> {
  const access = localStorage.getItem("access")

  const response = await fetch(`${API_URL}/me/`, {
    headers: {
      Authorization: `Bearer ${access}`
    }
  })

  if (!response.ok) {
    throw new Error("Failed to get user")
  }

  return response.json()
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem("refresh")

  if (!refresh) {
    return null
  }

  const response = await fetch(`${API_URL}/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      refresh
    })
  })

  if (!response.ok) {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")

    return null
  }

  const data = await response.json()

  localStorage.setItem("access", data.access)

  return data.access
}

export function logout() {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
}
