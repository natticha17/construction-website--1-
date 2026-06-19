import { type NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

// Trigger recompile to pick up store changes

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const data = await request.json()
  const inquiry = await store.updateInquiry(id, data)

  if (!inquiry) {
    return NextResponse.json({ error: "ไม่พบข้อมูลที่ต้องการ" }, { status: 404 })
  }

  return NextResponse.json({ success: true, inquiry })
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const success = await store.deleteInquiry(id)

  if (!success) {
    return NextResponse.json({ error: "ไม่พบข้อมูลที่ต้องการ" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
