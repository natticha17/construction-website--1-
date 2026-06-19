import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { EditContractForm } from "@/components/admin/edit-contract-form"
import { ContractViewWrapper } from "@/components/admin/contract-view-wrapper"
import { store } from "@/lib/store"

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        redirect("/login")
    }

    const contract = await store.getContract(id)
    if (!contract) {
        notFound()
    }

    const users = await store.getUsers()

    return (
        <div className="flex flex-col min-h-screen">
            <AdminHeader title="แก้ไขสัญญา" description={`แก้ไขรายละเอียดสัญญาเลขที่ ${contract.contractNumber || id}`} />

            <div className="flex-1 p-8 print:p-0">
                <ContractViewWrapper contract={contract} users={users} />
            </div>
        </div>
    )
}
