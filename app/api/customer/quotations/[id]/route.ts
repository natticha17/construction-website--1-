import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const customerId = cookieStore.get("customer_id")

    if (!customerId || !/^[0-9a-fA-F]{24}$/.test(customerId.value)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const quotation = await store.getQuotation(id)

        if (!quotation || quotation.customerId !== customerId.value) {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

        return NextResponse.json({ quotation })
    } catch (error) {
        console.error("Failed to get quotation:", error)
        return NextResponse.json({ error: "Failed to get quotation" }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const customerId = cookieStore.get("customer_id")

    if (!customerId || !/^[0-9a-fA-F]{24}$/.test(customerId.value)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { status, revisionNote } = body

        // Verify ownership
        const existingQuotation = await store.getQuotation(id)
        if (!existingQuotation || existingQuotation.customerId !== customerId.value) {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

        const quotation = await store.updateQuotation(id, { status, revisionNote })

        let contractId = ""
        // Auto-create contract if approved (similar logic to admin route can be shared, but for now duplicate for safety)
        if (status === "approved" && quotation) {
            const user = await store.getUser(quotation.customerId || "")
            if (user) {
                // Helper to create full address string for legacy field
                const buildAddressString = (u: any) => {
                    const villageText = u.village ? `หมู่บ้าน ${u.village} ` : ""
                    const roadText = u.road ? `ถนน ${u.road} ` : ""
                    return `บ้านเลขที่ ${u.houseNo || ""} ${villageText}${roadText}ต.${u.subDistrict || ""} อ.${u.district || ""} จ.${u.province || ""}`
                }

                // Generate next contract number
                const contractNumber = await store.getNextContractNumber()

                // Create contract automatically
                const contract = await store.createContract({
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
                    projectDetails: `สร้าง${quotation.housePlanName} พื้นที่ใช้สอย ${quotation.area} ตร.ม. ${quotation.additionalRequirements || ""}`,
                    contractValue: quotation.grandTotal,
                    constructionPeriod: "8 เดือน (ประมาณการ)",
                    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    endDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    status: "pending",
                })
                contractId = contract.id
            }
        }

        return NextResponse.json({ quotation, contractId })
    } catch (error) {
        console.error("Failed to update quotation:", error)
        return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 })
    }
}
