/**
 * Authentication utilities for the application.
 * Provides functions for login, logout, registration, and token management.
 */

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

/**
 * Interface for authentication token response
 */
export interface AuthTokenResponse {
  token: string
  expiresIn?: number
}

/**
 * Interface for user registration response
 */
export interface RegisterResponse {
  id: string
  email: string
}

/**
 * Interface for login credentials
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Interface for registration credentials
 */
export interface RegisterCredentials {
  email: string
  password: string
}

/**
 * Logs in a user with the provided credentials
 * @param credentials - The login credentials
 * @returns Promise with auth token or error
 */
export async function login(credentials: LoginCredentials): Promise<AuthTokenResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to login")
    }

    return await response.json()
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

/**
 * Registers a new user with the provided credentials
 * @param credentials - The registration credentials
 * @returns Promise with user data or error
 */
export async function register(credentials: RegisterCredentials): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to register")
    }

    return await response.json()
  } catch (error) {
    console.error("Error registering:", error)
    throw error
  }
}

/**
 * Logs out the current user
 * @returns Promise with success or error
 */
export async function logout(): Promise<{ message: string }> {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to logout")
    }

    // Clear the token from localStorage
    removeAuthToken()

    return await response.json()
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

/**
 * Stores the authentication token in localStorage
 * @param token - The authentication token
 */
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

/**
 * Retrieves the authentication token from localStorage
 * @returns The authentication token or null
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

/**
 * Removes the authentication token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

/**
 * Checks if the user is authenticated
 * @returns True if authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}
