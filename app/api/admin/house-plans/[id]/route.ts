import { type NextRequest, NextResponse } from "next/server"
import { adminStore } from "@/lib/admin-store"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const plan = adminStore.getHousePlan(id)

  if (!plan) {
    return NextResponse.json({ error: "ไม่พบแบบบ้านที่ต้องการ" }, { status: 404 })
  }

  return NextResponse.json({ plan })
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const plan = adminStore.updateHousePlan(id, body)

    if (!plan) {
      return NextResponse.json({ error: "ไม่พบแบบบ้านที่ต้องการ" }, { status: 404 })
    }

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error("Error updating house plan:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const success = adminStore.deleteHousePlan(id)

  if (!success) {
    return NextResponse.json({ error: "ไม่พบแบบบ้านที่ต้องการ" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
