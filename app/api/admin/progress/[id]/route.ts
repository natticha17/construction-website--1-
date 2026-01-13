import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const progress = store.getProjectProgress(id)
  if (!progress) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ progress })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { milestones } = body

    const progress = store.getProjectProgress(id)
    if (!progress) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Update each milestone
    for (const milestone of milestones) {
      store.updateMilestone(id, milestone.id, {
        progressPercentage: milestone.progressPercentage,
        paymentStatus: milestone.paymentStatus,
        images: milestone.images || [],
        paidAt: milestone.paymentStatus === "paid" && !milestone.paidAt ? new Date().toISOString() : milestone.paidAt,
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
