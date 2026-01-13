import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const quotations = store.getQuotationsByCustomer(customerId.value)
  return NextResponse.json({ quotations })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = store.getUser(customerId.value)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { housePlanId, area, budget, materialType, additionalRequirements } = body

    const housePlan = store.getHousePlan(housePlanId)
    if (!housePlan) {
      return NextResponse.json({ error: "House plan not found" }, { status: 404 })
    }

    // Generate preliminary quotation items based on area
    const areaNum = Number.parseFloat(area) || 100
    const items = generateQuotationItems(areaNum, materialType)

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const laborCost = Math.round(subtotal * 0.35)
    const operationCost = Math.round(subtotal * 0.1)
    const tax = Math.round((subtotal + laborCost + operationCost) * 0.07)
    const grandTotal = subtotal + laborCost + operationCost + tax

    const quotation = store.createQuotation({
      customerId: customerId.value,
      customerName: user.name,
      housePlanId,
      housePlanName: housePlan.name,
      area: areaNum,
      budget,
      materialType,
      additionalRequirements,
      items,
      laborCost,
      operationCost,
      tax,
      subtotal,
      grandTotal,
      notes: "ราคานี้เป็นราคาประมาณการเบื้องต้น อาจมีการเปลี่ยนแปลงตามสภาพหน้างานจริง",
      conditions: "ใบเสนอราคานี้มีอายุ 30 วัน นับจากวันที่ออก ราคาไม่รวมค่าตกแต่งภายในและเฟอร์นิเจอร์",
      status: "pending",
    })

    return NextResponse.json({ quotation })
  } catch {
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 })
  }
}

function generateQuotationItems(
  area: number,
  materialType: string,
): { id: string; materialName: string; quantity: number; unit: string; pricePerUnit: number; totalPrice: number }[] {
  const multiplier = materialType === "พรีเมียม" ? 1.5 : materialType === "ประหยัด" ? 0.8 : 1

  const baseItems = [
    { name: "คอนกรีตผสมเสร็จ", qtyPerSqm: 0.4, unit: "คิว", basePrice: 2500 },
    { name: "เหล็กเส้น DB16", qtyPerSqm: 15, unit: "กก.", basePrice: 25 },
    { name: "อิฐมวลเบา", qtyPerSqm: 35, unit: "ก้อน", basePrice: 25 },
    { name: "กระเบื้องหลังคา", qtyPerSqm: 6, unit: "แผ่น", basePrice: 150 },
    { name: "กระเบื้องพื้น", qtyPerSqm: 1.1, unit: "ตร.ม.", basePrice: 350 },
    { name: "สายไฟและอุปกรณ์", qtyPerSqm: 1, unit: "จุด", basePrice: 800 },
    { name: "ท่อประปาและอุปกรณ์", qtyPerSqm: 0.5, unit: "จุด", basePrice: 1200 },
    { name: "สีทาภายนอก-ภายใน", qtyPerSqm: 0.3, unit: "แกลลอน", basePrice: 1500 },
  ]

  return baseItems.map((item, index) => {
    const quantity = Math.round(area * item.qtyPerSqm)
    const pricePerUnit = Math.round(item.basePrice * multiplier)
    return {
      id: `item-${index + 1}`,
      materialName: item.name,
      quantity,
      unit: item.unit,
      pricePerUnit,
      totalPrice: quantity * pricePerUnit,
    }
  })
}
