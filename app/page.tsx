"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/storage"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      router.push("/auth/login")
    } else {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Загрузка...</p>
      </div>
    </div>
  )
}
