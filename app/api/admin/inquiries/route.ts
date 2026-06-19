import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
  const inquiries = await store.getInquiries()
  return NextResponse.json({ inquiries })
}
