import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import HousePlan from "@/models/HousePlan"

export async function GET() {
  try {
    await connectDB()

    const housePlans = await HousePlan.find().sort({ createdAt: -1 })

    return NextResponse.json({ housePlans })
  } catch (error) {
    console.error("Error fetching house plans:", error)
    return NextResponse.json(
      { housePlans: [] },
      { status: 500 }
    )
  }
}
