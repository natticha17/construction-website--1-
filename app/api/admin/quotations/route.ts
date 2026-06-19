import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        // In a real app, you should validate the body strictly here (e.g., using Zod)

        // Ensure all numeric fields are numbers (simple validation)
        // IMPORTANT: Put ...body LAST so it doesn't overwrite our explicit fields
        const payload = {
            quotationNumber: body.quotationNumber,
            area: Number(body.area),
            laborCost: Number(body.laborCost),
            operationCost: Number(body.operationCost),
            tax: Number(body.tax),
            subtotal: Number(body.subtotal),
            grandTotal: Number(body.grandTotal),
            // Explicitly include image fields BEFORE spread
            houseImage: body.houseImage,
            floorPlanImages: body.floorPlanImages,
            housePlanName: body.housePlanName,
            housePlanId: body.housePlanId,
            customerId: body.customerId,
            customerName: body.customerName,
            budget: body.budget,
            additionalRequirements: body.additionalRequirements,
            items: body.items,
            notes: body.notes,
            conditions: body.conditions,
            status: body.status || "pending",
        }

        const quotation = await store.createQuotation(payload)
        return NextResponse.json({ quotation }, { status: 201 })
    } catch (error) {
        console.error("Failed to create quotation:", error)
        return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 })
    }
}
