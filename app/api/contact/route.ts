import { type NextRequest, NextResponse } from "next/server"
import { adminStore } from "@/lib/admin-store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, message } = body

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
    }

    const inquiry = adminStore.addInquiry({
      name,
      phone,
      email: email || "",
      message,
    })

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error("Error saving contact:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" }, { status: 500 })
  }
}

export async function GET() {
  const inquiries = adminStore.getInquiries()
  return NextResponse.json({ inquiries })
}
