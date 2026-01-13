import { type NextRequest, NextResponse } from "next/server"
import { adminStore } from "@/lib/admin-store"

export async function GET() {
  const housePlans = adminStore.getHousePlans()
  return NextResponse.json({ housePlans })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, image, area, bedrooms, bathrooms, price, description, features } = body

    if (!name || !area || !bedrooms || !bathrooms || !price || !description) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
    }

    const plan = adminStore.addHousePlan({
      name,
      image: image || "/house-design.jpg",
      area,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      price,
      description,
      features: features || [],
    })

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error("Error adding house plan:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 })
  }
}
