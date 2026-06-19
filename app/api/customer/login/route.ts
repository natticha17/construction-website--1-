import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมลและรหัสผ่าน" },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ email })

    if (!user || user.role !== "customer") {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      )
    }

    // ✅ สร้าง response ก่อน
    const response = NextResponse.json({ success: true })

    // ✅ set cookie ผ่าน response เท่านั้น
    response.cookies.set("customer_id", user._id.toString(), {
      httpOnly: true,
      path: "/",
    })

    response.cookies.set("customer_token", "logged-in", {
      httpOnly: true,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Customer login error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    )
  }
}
