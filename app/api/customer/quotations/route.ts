import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId || !/^[0-9a-fA-F]{24}$/.test(customerId.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const quotations = await store.getQuotationsByCustomer(customerId.value)
  return NextResponse.json({ quotations })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId || !/^[0-9a-fA-F]{24}$/.test(customerId.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await store.getUser(customerId.value)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { housePlanId, area, budget, additionalRequirements } = body

    const housePlan = await store.getHousePlan(housePlanId)
    if (!housePlan) {
      return NextResponse.json({ error: "House plan not found" }, { status: 404 })
    }

    const areaNum = Number.parseFloat(area) || 0

    // Initialize with empty items and zero costs for admin to fill later
    const items: any[] = []
    const subtotal = 0
    const laborCost = 0
    const operationCost = 0
    const grandTotal = 0

    const quotationNumber = await store.getNextQuotationNumber("CUST")

    const quotation = await store.createQuotation({
      quotationNumber,
      customerId: customerId.value,
      customerName: user.name,
      housePlanId,
      housePlanName: housePlan.name,
      houseImage: housePlan.image,
      floorPlanImages: housePlan.floorPlanImages,
      area: areaNum,
      budget,
      additionalRequirements,
      items,
      laborCost,
      operationCost,
      tax: 0,
      subtotal,
      grandTotal,
      notes: "เจ้าหน้าที่กำลังประเมินราคาตามรายละเอียดที่คุณต้องการ",
      conditions: "ใบเสนอราคาตัวจริงจะออกให้หลังจากเจ้าหน้าที่ตรวจสอบรายละเอียดครบถ้วน",
      status: "pending",
    })

    return NextResponse.json({ quotation })
  } catch (error) {
    console.error("Quotation creation error:", error)
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 })
  }
}

function generateQuotationItems(
  area: number,
  isTwoStory = false,
  rooms = { bedrooms: 0, bathrooms: 0, kitchens: 0, livingRooms: 0, parking: 0 }
): { id: string; materialName: string; quantity: number; unit: string; pricePerUnit: number; totalPrice: number }[] {
  // Helper vars
  const footprint = isTwoStory ? area / 2 : area

  // Concrete: Industry standard
  // 1-Story: 0.10 คิว/ตร.ม.
  // 2-Story: 0.18 คิว/ตร.ม.
  const concreteQty = Math.ceil(area * (isTwoStory ? 0.18 : 0.10))

  const items = [
    // 0. งานเตรียมการ/ฐานราก
    { name: "ปรับหน้าดิน", quantity: Math.ceil(area * 0.8), unit: "ตร.ม.", pricePerUnit: 60 },
    {
      name: "เสาเข็ม (Micropile)",
      // 1-Story: Area/30 (Ultra sparse)
      // 2-Story: (Area/2)/12 (Dense footprint)
      quantity: Math.ceil(footprint / (isTwoStory ? 12 : 30)) + Math.ceil(rooms.parking / 15),
      unit: "ต้น",
      pricePerUnit: 4000
    },
    { name: "ฐานรากคอนกรีต", quantity: Math.ceil(footprint / (isTwoStory ? 12 : 18)), unit: "ฐาน", pricePerUnit: 3000 },

    // 1. หมวดวัสดุหลัก
    {
      name: "คอนกรีตผสมเสร็จ",
      quantity: concreteQty,
      unit: "คิว",
      pricePerUnit: 2100
    },
    {
      name: "เหล็กเส้น DB16",
      quantity: Math.ceil(area * (isTwoStory ? 70 : 28)),
      unit: "กก.",
      pricePerUnit: 25
    },
    {
      name: "เหล็กเส้นวายเมท",
      quantity: Math.ceil(isTwoStory ? area * 0.5 : area * 0.9),
      unit: "ตร.ม.",
      pricePerUnit: 20
    },
    {
      name: "อิฐมวลเบา (60x120)",
      quantity: Math.ceil(area * (isTwoStory ? 8 : 7)),
      unit: "ก้อน",
      pricePerUnit: 27
    },
    {
      name: "กระเบื้องหลังคาซีแพค",
      quantity: Math.ceil((isTwoStory ? (area / 2) * 1.4 : area * 1.3) * 11),
      unit: "แผ่น",
      pricePerUnit: 15
    },
    // งานสถาปัตย์ (Finishing)
    {
      name: "กระเบื้องพื้น (60x60)",
      quantity: Math.ceil(area * 0.7),
      unit: "ตร.ม.",
      pricePerUnit: 450
    },
    {
      name: "พื้นลามิเนต (ห้องนอน)",
      quantity: Math.ceil(area * 0.3),
      unit: "ตร.ม.",
      pricePerUnit: 650
    },
    {
      name: "กระเบื้องบุผนัง (ห้องน้ำ/ครัว)",
      quantity: (rooms.bathrooms * 22) + (rooms.kitchens * 12),
      unit: "ตร.ม.",
      pricePerUnit: 450
    },
    {
      name: "ฝ้าเพดาน (แผ่นซิปซัม)",
      quantity: Math.ceil(area * (isTwoStory ? 1.9 : 1.0)),
      unit: "ตร.ม.",
      pricePerUnit: 350
    },
    {
      name: "สีทาภายใน/ภายนอก",
      quantity: Math.ceil(area * (isTwoStory ? 4.25 : 3.25)),
      unit: "ตร.ม.",
      pricePerUnit: 80
    },
    {
      name: "โครงสร้างบันได+ราว (สำหรับ 2 ชั้น)",
      quantity: isTwoStory ? 1 : 0,
      unit: "ชุด",
      pricePerUnit: 55000
    },
    {
      name: "เคาน์เตอร์ครัวปูน (บิ้วอิน)",
      quantity: rooms.kitchens * 3,
      unit: "เมตร",
      pricePerUnit: 4500
    },


    // 2. หมวดโครงสร้าง / หลังคา (Additional)
    { name: "โครงหลังคาเหล็ก", quantity: Math.ceil(footprint * 25), unit: "กก.", pricePerUnit: 35 },
    { name: "ฉนวนกันร้อน", quantity: Math.ceil(footprint), unit: "ตร.ม.", pricePerUnit: 150 },
    { name: "รางน้ำฝน", quantity: Math.ceil(Math.sqrt(footprint) * 4), unit: "เมตร", pricePerUnit: 400 },

    // 3. หมวดงานระบบ
    {
      name: "จุดไฟ/ปลั๊ก/สวิตช์",
      quantity: (rooms.bedrooms * 5) + (rooms.bathrooms * 3) + (rooms.kitchens * 6) + (rooms.livingRooms * 8) + (rooms.parking * 2) + Math.ceil(area / 20),
      unit: "จุด",
      pricePerUnit: 800
    },

    {
      name: "เดินท่อประปา",
      quantity: (rooms.bathrooms * 6) + (rooms.kitchens * 3) + (rooms.parking * 1),
      unit: "จุด",
      pricePerUnit: 1200
    },
    { name: "สุขภัณฑ์", quantity: rooms.bathrooms, unit: "ชุด", pricePerUnit: 10000 },
    { name: "ปั๊มน้ำ", quantity: 1, unit: "เครื่อง", pricePerUnit: 6000 },

    // 4. หมวดประตู – หน้าต่าง
    { name: "ประตูบานหลัก", quantity: 1, unit: "ชุด", pricePerUnit: 15000 },
    { name: "ประตูภายใน", quantity: rooms.bedrooms, unit: "ชุด", pricePerUnit: 4000 },
    { name: "ประตูห้องน้ำ", quantity: rooms.bathrooms, unit: "ชุด", pricePerUnit: 3500 },
    { name: "หน้าต่างอลูมิเนียม", quantity: (rooms.bedrooms * 2) + (rooms.livingRooms * 2) + rooms.kitchens, unit: "ชุด", pricePerUnit: 3500 },

    // 5. หมวดงานภายนอก
    { name: "พื้นโรงรถ", quantity: rooms.parking * 15, unit: "ตร.ม.", pricePerUnit: 600 },
    { name: "ทางเดินรอบบ้าน", quantity: Math.ceil(area * 0.1), unit: "ตร.ม.", pricePerUnit: 500 },
    { name: "รั้วบ้าน", quantity: Math.ceil(Math.sqrt(area) * 4), unit: "เมตร", pricePerUnit: 2500 },
  ]

  return items.map((item, index) => ({
    id: `item-${index + 1}`,
    materialName: item.name,
    quantity: item.quantity,
    unit: item.unit,
    pricePerUnit: item.pricePerUnit,
    totalPrice: item.quantity * item.pricePerUnit,
  }))
}
