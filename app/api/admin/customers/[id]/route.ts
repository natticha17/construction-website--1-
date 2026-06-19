import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, email, phone, customerType, houseNo, village, road, subDistrict, district, province } = body

        // Construction address summary string for compatibility
        const summaryAddress = [
            houseNo ? `บ้านเลขที่ ${houseNo}` : "",
            village ? `หมู่บ้าน ${village}` : "",
            road ? `ถนน ${road}` : "",
            subDistrict ? `ตำบล ${subDistrict}` : "",
            district ? `อำเภอ ${district}` : "",
            province ? `จังหวัด ${province}` : "",
        ].filter(Boolean).join(" ")

        const user = await store.updateUser(id, {
            name,
            email,
            phone,
            address: summaryAddress,
            customerType,
            houseNo,
            village,
            road,
            subDistrict,
            district,
            province
        })
        if (!user) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const success = await store.deleteUser(id)
        if (!success) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
    }
}
