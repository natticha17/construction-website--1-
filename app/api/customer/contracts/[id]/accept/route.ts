import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const contract = store.getContract(id)
  if (!contract || contract.customerId !== customerId.value) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 })
  }

  const updatedContract = store.acceptContract(id)
  return NextResponse.json({ contract: updatedContract })
}
