import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("customer_token")
  const customerId = cookieStore.get("customer_id")

  if (!token || !customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = store.getUser(customerId.value)
  if (!user || user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      customerType: user.customerType,
    },
  })
}
