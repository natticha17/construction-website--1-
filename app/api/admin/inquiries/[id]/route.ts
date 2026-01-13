import { type NextRequest, NextResponse } from "next/server"
import { adminStore } from "@/lib/admin-store"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const success = adminStore.deleteInquiry(id)

  if (!success) {
    return NextResponse.json({ error: "ไม่พบข้อมูลที่ต้องการ" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
