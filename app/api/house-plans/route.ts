import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
  const housePlans = store.getHousePlans()
  return NextResponse.json({ housePlans })
}
