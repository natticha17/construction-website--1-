import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newPlan = await store.addHousePlan(data)
    return NextResponse.json({ success: true, plan: newPlan })
  } catch (error) {
    console.error("Error creating house plan:", error)
    return NextResponse.json({ error: "Failed to create house plan" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const plans = await store.getHousePlans()
    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Error fetching house plans:", error)
    return NextResponse.json({ error: "Failed to fetch house plans" }, { status: 500 })
  }
}
