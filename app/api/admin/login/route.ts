import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    await connectDB()

    const user = await User.findOne({ email })

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      )
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      )
    }

    const res = NextResponse.json({ success: true })

    res.cookies.set("admin_token", `admin_${user._id}`, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "server error" }, { status: 500 })
  }
}
