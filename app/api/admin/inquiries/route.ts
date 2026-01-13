import { NextResponse } from "next/server"
import { adminStore } from "@/lib/admin-store"

export async function GET() {
  const inquiries = adminStore.getInquiries()
  return NextResponse.json({ inquiries })
}
