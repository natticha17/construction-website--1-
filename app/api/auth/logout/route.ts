import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
    const response = NextResponse.json({ success: true })

    // Clear all auth cookies
    response.cookies.delete("customer_id")
    response.cookies.delete("customer_token")
    response.cookies.delete("admin_token")

    return response
}
