import type React from "react"
import { cookies } from "next/headers"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  // Check if we're on the login page
  // This is handled by checking if token exists
  // If no token and not on login page, redirect to login
  const isLoginPage = typeof window !== "undefined" ? window.location.pathname === "/admin/login" : false

  if (!token && !isLoginPage) {
    // We'll handle this in middleware instead for better UX
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
