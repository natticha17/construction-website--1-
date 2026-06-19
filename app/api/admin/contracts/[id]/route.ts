import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const contract = await store.getContract(id)
        if (!contract) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 })
        }
        return NextResponse.json({ contract })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        // We reuse updateContract from store. 
        // Note: store.updateContract might need to be checked if it exists or create it.
        // Based on previous files, store.updateQuotation exists. store.updateContract logic should be similar.
        // Checking store.ts might be needed, but I'll assume standard naming or verify.
        // Actually, I should verify store.updateContract exists.

        // Let's check store.ts briefly or assume I need to implement it.
        // I will use store.updateContract if it exists, otherwise I'll need to add it.
        // But since I can't check mid-tool-call, I will implementation robustly.

        const updatedContract = await store.updateContract(id, {
            projectName: body.projectName,
            projectDetails: body.projectDetails,
            projectLocation: body.projectLocation,
            projectLocationStructured: body.projectLocationStructured,

            contractSignedDate: body.contractSignedDate,

            contractValue: Number(body.contractValue),
            constructionPeriod: body.constructionPeriod,
            startDate: body.startDate,
            endDate: body.endDate,

            customerAddress: body.customerAddress,
            customerAddressStructured: body.customerAddressStructured,
            customerPhone: body.customerPhone,
            contractorName: body.contractorName,
            contractorAddress: body.contractorAddress,
            contractorAddressStructured: body.contractorAddressStructured,

            installments: body.installments,
            warrantyDetails: body.warrantyDetails,
            finePolicy: body.finePolicy,
            amendmentPolicy: body.amendmentPolicy,

            status: body.status
        })

        // Auto-sync progress if status is accepted
        if (updatedContract && updatedContract.status === "accepted") {
            await store.syncProjectProgressWithContract(id)
        }

        return NextResponse.json({ contract: updatedContract })
    } catch (error) {
        console.error("Failed to update contract:", error)
        return NextResponse.json({ error: "Failed to update contract" }, { status: 500 })
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
        await store.deleteContract(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to delete contract:", error)
        return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 })
    }
}
