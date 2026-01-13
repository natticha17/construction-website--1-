import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { store } from "@/lib/store"
import { CustomerSidebar } from "@/components/customer/customer-sidebar"

export default async function CustomerProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("customer_token")?.value
  const customerId = cookieStore.get("customer_id")?.value

  if (!token || !customerId) {
    redirect("/customer/login")
  }

  const user = store.getUser(customerId)
  if (!user || user.role !== "customer") {
    redirect("/customer/login")
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <CustomerSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
