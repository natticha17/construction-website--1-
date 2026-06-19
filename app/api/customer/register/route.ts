import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      name,
      phone,
      customerType,
      houseNo,
      village,
      road,
      subDistrict,
      district,
      province
    } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 })
    }

    await connectDB()

    // Construction address summary string
    const summaryAddress = [
      houseNo ? `บ้านเลขที่ ${houseNo}` : "",
      village ? `หมู่บ้าน ${village}` : "",
      road ? `ถนน ${road}` : "",
      subDistrict ? `ตำบล ${subDistrict}` : "",
      district ? `อำเภอ ${district}` : "",
      province ? `จังหวัด ${province}` : "",
    ].filter(Boolean).join(" ")

    // ตรวจสอบอีเมลซ้ำ
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // สร้าง user (pre save จะ hash password ตาม schema ถ้ามี แต่ในที่นี้เราทำที่นี่เลยเพื่อความชัดเจน)
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: "customer",
      phone,
      address: summaryAddress,
      houseNo,
      village,
      road,
      subDistrict,
      district,
      province,
      customerType,
    })
    await user.save()

    // ตั้ง cookie (สำคัญ: path "/" เพื่อให้ถูกส่งข้าม endpoint)
    const token = `customer_${user._id}_${Date.now()}`
    const cookieStore = await cookies()
    cookieStore.set("customer_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    cookieStore.set("customer_id", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    })
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 })
    }
    console.error("Customer register error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 })
  }
}