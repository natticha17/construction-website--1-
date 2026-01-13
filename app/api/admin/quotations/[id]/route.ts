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
    const { status } = body

    const quotation = store.updateQuotation(id, { status })
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
    }

    // If approved, create a contract for project owners
    if (status === "approved") {
      const user = store.getUser(quotation.customerId)
      if (user?.customerType === "project_owner") {
        store.createContract({
          customerId: quotation.customerId,
          customerName: quotation.customerName,
          quotationId: quotation.id,
          projectName: `โครงการ ${quotation.housePlanName}`,
          projectDetails: `สร้าง${quotation.housePlanName} พื้นที่ใช้สอย ${quotation.area} ตร.ม. ${quotation.additionalRequirements}`,
          contractValue: quotation.grandTotal,
          constructionPeriod: "8 เดือน",
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "pending",
        })
      }
    }

    return NextResponse.json({ quotation })
  } catch {
    return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 })
  }
}
