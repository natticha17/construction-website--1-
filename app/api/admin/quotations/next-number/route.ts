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
        const nextNumber = await store.getNextQuotationNumber()
        return NextResponse.json({ nextNumber })
    } catch (error) {
        console.error("Failed to fetch next quotation number:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
