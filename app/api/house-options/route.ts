
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import HouseType from "@/models/HouseType"
import HouseStyle from "@/models/HouseStyle"

export async function GET() {
    try {
        await connectDB()

        // Fetch all types and styles
        const types = await HouseType.find().sort({ name: 1 })
        const styles = await HouseStyle.find().sort({ name: 1 })

        return NextResponse.json({
            types: types.map(t => t.name),
            styles: ["Modern", "Contemporary"]
        })
    } catch (error) {
        console.error("Error fetching house options:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
