import { NextResponse } from "next/server"
import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public/uploads")
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // ignore if exists
        }

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const ext = path.extname(file.name)
        const filename = `image-${uniqueSuffix}${ext}`
        const filepath = path.join(uploadDir, filename)

        await writeFile(filepath, buffer)

        return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { url } = await request.json()

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 })
        }

        const filename = path.basename(url)
        const filepath = path.join(process.cwd(), "public/uploads", filename)

        try {
            await unlink(filepath)
        } catch (error) {
            console.error("Error deleting file:", error)
            return NextResponse.json({ error: "File not found or deletion failed" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error processing delete request:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}
