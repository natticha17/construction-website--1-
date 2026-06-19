import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const customerId = cookieStore.get("customer_id")?.value
        const adminToken = cookieStore.get("admin_token")?.value

        await connectDB()
        let user = null

        if (customerId) {
            user = await User.findById(customerId).select("-password").lean()
        } else if (adminToken) {
            // admin_token is stored as admin_<id>
            const adminId = adminToken.replace("admin_", "")
            user = await User.findById(adminId).select("-password").lean()
        }

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Convert to plain object safely for JSON serialization
        const userData = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            houseNo: user.houseNo,
            village: user.village,
            road: user.road,
            subDistrict: user.subDistrict,
            district: user.district,
            province: user.province,
            customerType: user.customerType
        }

        return NextResponse.json({ user: userData })
    } catch (error) {
        console.error("Auth me error:", error)
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        )
    }
}
