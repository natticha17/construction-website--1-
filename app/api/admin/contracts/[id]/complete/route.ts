
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = await params
        const { id } = resolvedParams
        console.log("API: Completing project for id:", id)
        const result = await store.completeProject(id)


        if (!result.success) {
            return NextResponse.json({ message: result.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: "Project completed successfully" })
    } catch (error) {
        console.error("Error completing project:", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
