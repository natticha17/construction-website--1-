import { type NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
    try {
        const projects = await store.getShowcaseProjects()
        return NextResponse.json({ projects })
    } catch (error) {
        console.error("Error fetching showcase projects:", error)
        return NextResponse.json({ error: "Failed to fetch showcase projects" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        console.log("POST /api/admin/showcase - incoming data:", data)
        const project = await store.addShowcaseProject(data)
        return NextResponse.json({ success: true, project })
    } catch (error) {
        console.error("Error creating showcase project:", error)
        return NextResponse.json({ error: "Failed to create showcase project" }, { status: 500 })
    }
}
