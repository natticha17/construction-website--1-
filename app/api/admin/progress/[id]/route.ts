import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { store } from "@/lib/store"
import mongoose from "mongoose"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const progress = await store.getProjectProgress(id)
  if (!progress) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Also fetch the contract to allow syncing or viewing contract details
  const contract = await store.getContract(progress.contractId)

  return NextResponse.json({ progress, contract })
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
    const { milestones } = body

    const progress = await store.getProjectProgress(id)
    if (!progress) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Use updateProjectProgress to handle full list updates (add/remove/edit)
    const updatedMilestones = milestones.map((m: any) => ({
      ...m,
      // Ensure new milestones have proper defaults if missing
      paymentStatus: m.paymentStatus || "pending",
      paymentMethod: m.paymentMethod,
      paymentSlip: m.paymentSlip,
      images: m.images || [],
      paidAt: m.paymentStatus === "paid" && !m.paidAt ? new Date().toISOString() : m.paidAt,
      transferDate: m.transferDate ? new Date(m.transferDate).toISOString() : undefined,
      checkedAt: m.checkedAt ? new Date(m.checkedAt).toISOString() : undefined,
    }))

    await store.updateProjectProgress(id, {
      milestones: updatedMilestones
    })

    // --- Automatic Financial Sync ---
    console.log("Starting financial sync for project:", id);
    const { ObjectId } = mongoose.Types;

    for (const m of updatedMilestones) {
      if (!m.id) continue; // Skip milestones without ID

      const description = `งวดที่ ${m.phase}: ${m.description}`.trim();
      const amount = Number(m.paymentAmount) || 0;

      // Try to find existing record by referenceId or description
      const existingRecord = await store.findFinancialRecord({
        projectId: new ObjectId(id),
        type: "income",
        $or: [
          { referenceId: m.id },
          { description: description }
        ]
      });

      if (m.paymentStatus === "paid") {
        if (!existingRecord) {
          console.log(`Creating missing income record for: ${description}`);
          try {
            await store.createFinancialRecord({
              projectId: id,
              projectName: progress.projectName || "โครงการสร้างบ้าน",
              type: "income",
              category: "งวดงานโครงการ",
              description: description,
              amount: amount,
              date: m.paidAt || new Date().toISOString(),
              referenceId: m.id
            });
          } catch (createErr: any) {
            console.error("Failed to create income record:", createErr.message);
          }
        } else if (existingRecord.amount !== amount) {
          // Update amount if it changed
          console.log(`Updating income record amount for: ${description}`);
          await store.updateFinancialRecord(existingRecord.id, { amount: amount });
        }
      } else {
        // If status is NOT paid but record exists, DELETE it (Reversal)
        if (existingRecord) {
          console.log(`Deleting income record (Reversal) for: ${description}`);
          try {
            await store.deleteFinancialRecord(existingRecord.id);
          } catch (deleteErr: any) {
            console.error("Failed to delete income record:", deleteErr.message);
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to update progress / sync finance:", error)
    return NextResponse.json({ error: "Failed to update: " + error.message }, { status: 500 })
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
    const success = await store.deleteProjectProgress(id)
    if (!success) {
      return NextResponse.json({ error: "Failed to delete" }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete progress:", error)
    return NextResponse.json({ error: "Failed to delete: " + error.message }, { status: 500 })
  }
}
