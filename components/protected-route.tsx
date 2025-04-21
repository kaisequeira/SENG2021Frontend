"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for auth-related pages
    const isAuthPage = ["/login", "/register"].includes(pathname)

    if (!isLoading && !isAuthenticated && !isAuthPage) {
      router.push("/login")
    }

    // Redirect to dashboard if already authenticated and trying to access auth pages
    if (!isLoading && isAuthenticated && isAuthPage) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // For auth pages, render directly
  const isAuthPage = ["/login", "/register"].includes(pathname)
  if (isAuthPage) {
    return <>{children}</>
  }

  // For protected pages, only render if authenticated
  return isAuthenticated ? <>{children}</> : null
}
