import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"
import mongoose from "mongoose"

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const cookieStore = await cookies()
    const customerId = cookieStore.get("customer_id")

    if (!customerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { milestoneId, paymentMethod, paymentSlip, transferDate } = body

        if (!milestoneId || !paymentMethod) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const progress = await store.getProjectProgress(id)
        if (!progress || progress.customerId !== customerId.value) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        // Update the specific milestone
        const updated = await store.updateMilestone(id, milestoneId, {
            paymentStatus: "waiting_verification",
            paymentMethod,
            paymentSlip,
            transferDate: transferDate ? new Date(transferDate).toISOString() : undefined,
            updatedAt: new Date().toISOString()
        })

        if (!updated) {
            return NextResponse.json({ error: "Failed to update milestone - not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Failed to notify payment:", error)
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}
