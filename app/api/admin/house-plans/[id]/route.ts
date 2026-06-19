import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

interface RouteParams {
  params: Promise<{ id: string }>
}

/* ================= GET ================= */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params

  const plan = await store.getHousePlan(id)

  if (!plan) {
    return NextResponse.json(
      { error: "ไม่พบแบบบ้านที่ต้องการ" },
      { status: 404 }
    )
  }

  return NextResponse.json({ plan })
}

/* ================= PUT ================= */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const { name, image, area, bedrooms, bathrooms, kitchens, livingRooms, parking, price, description, type, style, floorPlanImages } = data

    if (!type || !style) {
      return NextResponse.json({ error: "Type and Style are required" }, { status: 400 })
    }

    const updatedPlan = await store.updateHousePlan(id, {
      name,
      image,
      area,
      bedrooms,
      bathrooms,
      kitchens,
      livingRooms,
      parking,
      price,
      description,
      type,
      style,
      floorPlanImages
    })

    if (!updatedPlan) {
      return NextResponse.json(
        { error: "ไม่พบแบบบ้านที่ต้องการ" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, plan: updatedPlan })
  } catch (error) {
    console.error("Error updating house plan:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    )
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params

  const success = await store.deleteHousePlan(id)

  if (!success) {
    return NextResponse.json(
      { error: "ไม่พบแบบบ้านที่ต้องการ" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
