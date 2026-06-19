import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { store } from "@/lib/store"
import { QuotationForm } from "@/components/admin/quotation-form"

export default async function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        redirect("/login")
    }

    const quotation = await store.getQuotation(id)
    if (!quotation) {
        notFound()
    }

    const [users, housePlans, contract] = await Promise.all([
        store.getUsers(),
        store.getHousePlans(),
        store.getContractByQuotation(id)
    ])

    return (
        <div className="flex flex-col min-h-screen">
            <AdminHeader
                title="แก้ไขใบเสนอราคา"
                description={`ใบเสนอราคา: ${quotation.quotationNumber || quotation.id}${contract ? ` | เลขที่สัญญา: ${contract.contractNumber}` : ""}`}
            />

            <div className="flex-1 p-8">
                <QuotationForm
                    users={users}
                    housePlans={housePlans}
                    initialData={quotation}
                    contract={contract || undefined}
                    mode="edit"
                />
            </div>
        </div>
    )
}
