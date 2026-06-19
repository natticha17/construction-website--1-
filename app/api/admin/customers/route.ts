import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, email, phone, customerType, houseNo, village, road, subDistrict, district, province } = body

        if (!email || !name || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await store.getUserByEmail(email)
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 })
        }

        // Construction address summary string for compatibility
        const summaryAddress = [
            houseNo ? `บ้านเลขที่ ${houseNo}` : "",
            village ? `หมู่บ้าน ${village}` : "",
            road ? `ถนน ${road}` : "",
            subDistrict ? `ตำบล ${subDistrict}` : "",
            district ? `อำเภอ ${district}` : "",
            province ? `จังหวัด ${province}` : "",
        ].filter(Boolean).join(" ")

        // Create user with a default password (they can change it later if they ever log in)
        // For walk-in customers, we use a random or placeholder password since they don't log in themselves initially.
        const defaultPassword = "password123" // In a real app, this should be more secure or handled via reset link

        const user = await store.createUser({
            name,
            email,
            phone,
            password: defaultPassword,
            address: summaryAddress,
            customerType: customerType || "general",
            houseNo,
            village,
            road,
            subDistrict,
            district,
            province
        })

        return NextResponse.json({ user }, { status: 201 })
    } catch (error) {
        console.error("API Error: Failed to create customer:", error)
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
    }
}
