"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { isAuthenticated, login, logout, register, setAuthToken, removeAuthToken, removeInvoiceApiToken, setInvoiceApiToken } from "../lib/auth"
import type { LoginCredentials, RegisterCredentials } from "../lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { loginToInvoiceApi } from "@/lib/invoice-api-service"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status on mount
    setIsAuth(isAuthenticated())
    setIsLoading(false)
  }, [])

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      const response = await login(credentials)
      setAuthToken(response.token)
      setIsAuth(true)

      try {
        const invoiceResponse = await loginToInvoiceApi()
        console.log("Invoice API Token:", invoiceResponse)
        setInvoiceApiToken(invoiceResponse.token)
      } catch (error) {
        toast.error("Error logging in to Invoice API", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        })
      }

      router.push("/dashboard")
      toast.success("Logged in successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      removeAuthToken()
      removeInvoiceApiToken()
      setIsAuth(false)
      router.push("/login")
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to logout")
      removeAuthToken()
      removeInvoiceApiToken()
      setIsAuth(false)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true)
      await register(credentials)
      toast.success("Registered successfully. Please log in.")
      router.push("/login")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuth,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
