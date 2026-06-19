import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { CreateContractForm } from "@/components/admin/create-contract-form"
import { store } from "@/lib/store"

export default async function NewContractPage({ searchParams }: { searchParams: Promise<{ quotationId?: string }> }) {
    const { quotationId } = await searchParams
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        redirect("/login")
    }

    const users = await store.getUsers()
    let initialQuotation = null

    if (quotationId) {
        initialQuotation = await store.getQuotation(quotationId)
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AdminHeader title="สร้างสัญญาใหม่" description="สร้างสัญญาจ้างแบบกำหนดเอง" />

            <div className="flex-1 p-8">
                <CreateContractForm users={users} initialQuotation={initialQuotation} />
            </div>
        </div>
    )
}
