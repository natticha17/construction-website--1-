import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function PATCH(request: Request) {
    const cookieStore = await cookies()
    const customerId = cookieStore.get("customer_id")?.value

    if (!customerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, phone, houseNo, village, road, subDistrict, district, province } = body

        // Construction address summary string for compatibility
        const summaryAddress = [
            houseNo ? `บ้านเลขที่ ${houseNo}` : "",
            village ? `หมู่บ้าน ${village}` : "",
            road ? `ถนน ${road}` : "",
            subDistrict ? `ตำบล ${subDistrict}` : "",
            district ? `อำเภอ ${district}` : "",
            province ? `จังหวัด ${province}` : "",
        ].filter(Boolean).join(" ")

        const user = await store.updateUser(customerId, {
            name,
            phone,
            address: summaryAddress,
            houseNo,
            village,
            road,
            subDistrict,
            district,
            province
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
