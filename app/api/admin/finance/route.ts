import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const records = store.getFinancialRecords()
  return NextResponse.json({ records })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { projectId, projectName, type, category, description, amount, date } = body

    if (!projectId || !type || !category || !amount || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const record = store.createFinancialRecord({
      projectId,
      projectName,
      type,
      category,
      description: description || "",
      amount,
      date,
    })

    return NextResponse.json({ record })
  } catch {
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
  }
}
