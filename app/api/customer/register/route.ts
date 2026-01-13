import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, phone, address, customerType } = body

    // Check if user already exists
    const existingUser = store.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 })
    }

    // Create new user
    const user = store.createUser({
      email,
      password, // In production, hash this password
      name,
      phone,
      address,
      customerType: customerType || "general",
    })

    // Set auth cookie
    const token = `customer_${user.id}_${Date.now()}`
    const cookieStore = await cookies()
    cookieStore.set("customer_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    cookieStore.set("customer_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 })
  }
}
