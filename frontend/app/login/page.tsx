"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import HomePage from "../page" // tu login de tabs cliente/admin

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("LoginPage - Estado del usuario:", user)
    
    if (user?.rol === "ADMIN") {
      console.log("Redirigiendo a ADMIN")
      router.replace("/admin")
    }
    if (user?.rol === "CLIENTE") {
      console.log("Redirigiendo a CLIENTE")
      router.replace("/cliente")
    }
  }, [user, router])

  return <HomePage />
}
