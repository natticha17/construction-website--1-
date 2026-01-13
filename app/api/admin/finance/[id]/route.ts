import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const deleted = store.deleteFinancialRecord(id)
  if (!deleted) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
