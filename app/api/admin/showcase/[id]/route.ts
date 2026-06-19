import { type NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const project = await store.getShowcaseProject(id)

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        return NextResponse.json({ project })
    } catch (error) {
        console.error("Error fetching showcase project:", error)
        return NextResponse.json({ error: "Failed to fetch showcase project" }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await request.json()
        console.log(`PATCH /api/admin/showcase/${id} - incoming data:`, data)
        const project = await store.updateShowcaseProject(id, data)
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }
        return NextResponse.json({ success: true, project })
    } catch (error) {
        console.error("Error updating showcase project:", error)
        return NextResponse.json({ error: "Failed to update showcase project" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const success = await store.deleteShowcaseProject(id)
        if (!success) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting showcase project:", error)
        return NextResponse.json({ error: "Failed to delete showcase project" }, { status: 500 })
    }
}
