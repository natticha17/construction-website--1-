import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { FinanceForm } from "@/components/admin/finance-form"
import { store } from "@/lib/store"

export default async function NewFinanceRecordPage({
  searchParams
}: {
  searchParams: Promise<{ projectId?: string }>
}) {
  const { projectId } = await searchParams
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    redirect("/login")
  }

  const projects = await store.getProjectProgressList()

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="เพิ่มรายการรายรับ-รายจ่าย" description="บันทึกรายการรายรับหรือรายจ่ายใหม่" />

      <div className="flex-1 p-8">
        <FinanceForm projects={projects} initialProjectId={projectId} />
      </div>
    </div>
  )
}
