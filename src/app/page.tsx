"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import LoginPage from "./login/page"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      console.log('User authenticated, redirecting to dashboard')
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // Always show login page for now to debug the issue
  return <LoginPage />
}