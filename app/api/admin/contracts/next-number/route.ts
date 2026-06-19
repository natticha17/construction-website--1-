import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const nextNumber = await store.getNextContractNumber()
        return NextResponse.json({ nextNumber })
    } catch (error) {
        console.error("Failed to get next contract number:", error)
        return NextResponse.json({ error: "Failed to get next number" }, { status: 500 })
    }
}
