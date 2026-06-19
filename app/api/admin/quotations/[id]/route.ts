import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      status, items, laborCost, operationCost, subtotal, grandTotal,
      housePlanId, housePlanName, houseImage, floorPlanImages, area, budget,
      additionalRequirements, notes, conditions, customerName
    } = body

    // Prepare update object with all possible fields
    const updateData: any = {}
    if (status !== undefined) updateData.status = status

    if (items) updateData.items = items
    if (laborCost !== undefined) updateData.laborCost = laborCost
    if (operationCost !== undefined) updateData.operationCost = operationCost
    if (subtotal !== undefined) updateData.subtotal = subtotal
    if (grandTotal !== undefined) updateData.grandTotal = grandTotal

    if (housePlanId !== undefined) updateData.housePlanId = housePlanId
    if (housePlanName !== undefined) updateData.housePlanName = housePlanName
    if (houseImage !== undefined) updateData.houseImage = houseImage
    if (floorPlanImages !== undefined) updateData.floorPlanImages = floorPlanImages
    if (area !== undefined) updateData.area = area
    if (budget !== undefined) updateData.budget = budget

    if (additionalRequirements !== undefined) updateData.additionalRequirements = additionalRequirements
    if (notes !== undefined) updateData.notes = notes
    if (conditions !== undefined) updateData.conditions = conditions
    if (customerName) updateData.customerName = customerName

    const quotation = await store.updateQuotation(id, updateData)
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
    }

    // If approved (manual override), create a contract for project owners
    if (status === "approved") {
      const user = await store.getUser(quotation.customerId)
      if (user?.customerType === "project_owner") {
        // Helper for address string
        const buildAddressString = (u: any) => {
          const villageText = u.village ? `หมู่บ้าน ${u.village} ` : ""
          const roadText = u.road ? `ถนน ${u.road} ` : ""
          return `บ้านเลขที่ ${u.houseNo || ""} ${villageText}${roadText}ต.${u.subDistrict || ""} อ.${u.district || ""} จ.${u.province || ""}`
        }

        const contractNumber = await store.getNextContractNumber()

        await store.createContract({
          contractNumber,
          customerId: quotation.customerId,
          customerName: quotation.customerName,
          customerPhone: user.phone,
          customerAddress: buildAddressString(user),
          customerAddressStructured: {
            houseNo: user.houseNo || "",
            village: user.village || "",
            road: user.road || "",
            subDistrict: user.subDistrict || "",
            district: user.district || "",
            province: user.province || ""
          },
          quotationId: quotation.id,
          housePlanName: quotation.housePlanName,
          houseImage: quotation.houseImage,
          floorPlanImages: quotation.floorPlanImages,
          projectName: `โครงการ ${quotation.housePlanName}`,
          projectDetails: `สร้าง${quotation.housePlanName} พื้นที่ใช้สอย ${quotation.area} ตร.ม. ${quotation.additionalRequirements}`,
          contractValue: quotation.grandTotal,
          constructionPeriod: "12 เดือน",
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "pending",
        })
      }
    }

    return NextResponse.json({ quotation })
  } catch {
    return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const success = await store.deleteQuotation(id)
    if (!success) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete quotation" }, { status: 500 })
  }
}
