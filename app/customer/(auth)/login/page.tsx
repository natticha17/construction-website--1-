"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectToUnifiedLogin() {
  const router = useRouter()
  useEffect(() => {
    window.location.replace("/login")
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="h-10 w-10 bg-primary/20 rounded-full"></div>
        <p className="text-sm text-muted-foreground">กำลังนำคุณไปหน้าเข้าสู่ระบบใหม่...</p>
      </div>
    </div>
  )
}
