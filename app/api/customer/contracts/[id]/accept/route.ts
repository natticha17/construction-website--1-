import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"
import mongoose from "mongoose"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const contract = await store.getContract(id)
  if (!contract || contract.customerId !== customerId.value) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 })
  }

  const updatedContract = await store.acceptContract(id)

  // Upgrade user to project_owner
  await store.updateUserType(customerId.value, "project_owner")

  // Initialize/Sync Project Progress
  if (updatedContract) {
    await store.syncProjectProgressWithContract(id)
  }

  return NextResponse.json({ contract: updatedContract })
}
