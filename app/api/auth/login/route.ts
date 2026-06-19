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

        if (!user) {
            return NextResponse.json(
                { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            )
        }

        // Check password based on role or try both for compatibility
        let isMatch = false

        // Attempt bcrypt first (standard for customers and future-proof)
        try {
            isMatch = await bcrypt.compare(password, user.password)
        } catch {
            // If error (not a bcrypt hash), fallback to plain text if admin
            if (user.role === "admin") {
                isMatch = user.password === password
            }
        }

        // Second chance fallback for admin if bcrypt.compare didn't match but isn't hashed
        if (!isMatch && user.role === "admin") {
            isMatch = user.password === password
        }

        if (!isMatch) {
            return NextResponse.json(
                { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            )
        }

        // ✅ Setup Response
        const response = NextResponse.json({
            success: true,
            role: user.role
        })

        // ✅ Set cookies based on role
        if (user.role === "admin") {
            response.cookies.set("admin_token", `admin_${user._id}`, {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24, // 24 hours
            })
        } else {
            response.cookies.set("customer_id", user._id.toString(), {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24, // 24 hours
            })
            response.cookies.set("customer_token", "logged-in", {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24, // 24 hours
            })
        }

        return response
    } catch (error) {
        console.error("Unified login error:", error)
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" },
            { status: 500 }
        )
    }
}
