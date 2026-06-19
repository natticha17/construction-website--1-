import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contracts = await store.getContracts()
    return NextResponse.json({ contracts })
}

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()

        // Prevent duplicate contracts for the same quotation
        if (body.quotationId) {
            const existingContract = await store.getContractByQuotation(body.quotationId)
            if (existingContract) {
                return NextResponse.json({ error: "สัญญานี้ถูกสร้างไปแล้ว" }, { status: 400 })
            }
        }

        const contract = await store.createContract({
            contractNumber: body.contractNumber,
            customerId: body.customerId,
            customerName: body.customerName,
            customerAddress: body.customerAddress,
            customerAddressStructured: body.customerAddressStructured,
            customerPhone: body.customerPhone,
            contractorName: body.contractorName,
            contractorAddress: body.contractorAddress,
            contractorAddressStructured: body.contractorAddressStructured,

            quotationId: body.quotationId || null,
            housePlanName: body.housePlanName || "",
            houseImage: body.houseImage,
            floorPlanImages: body.floorPlanImages,
            items: body.items,

            projectName: body.projectName,
            projectDetails: body.projectDetails,
            projectLocation: body.projectLocation,
            projectLocationStructured: body.projectLocationStructured,

            contractSignedDate: body.contractSignedDate ? new Date(body.contractSignedDate) : null,

            contractValue: Number(String(body.contractValue).replace(/,/g, '')) || 0,
            constructionPeriod: body.constructionPeriod,
            startDate: body.startDate ? new Date(body.startDate) : null,
            endDate: body.endDate ? new Date(body.endDate) : null,

            installments: (body.installments || []).map((inst: any) => ({
                ...inst,
                amount: typeof inst.amount === 'string' ? Number(inst.amount.replace(/,/g, '')) : Number(inst.amount),
                dueDate: inst.dueDate || ""
            })),
            warrantyDetails: body.warrantyDetails,
            finePolicy: body.finePolicy,
            amendmentPolicy: body.amendmentPolicy,

            status: "pending",
        } as any)

        return NextResponse.json({ contract }, { status: 201 })
    } catch (error) {
        console.error("Failed to create contract:", error)
        return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
    }
}
