import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { QuotationForm } from "@/components/admin/quotation-form"
import { store } from "@/lib/store"

export default async function NewQuotationPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        redirect("/login")
    }

    const [users, housePlans] = await Promise.all([
        store.getUsers(),
        store.getHousePlans()
    ])

    return (
        <div className="flex flex-col min-h-screen">
            <AdminHeader title="สร้างใบเสนอราคา" description="สร้างใบเสนอราคาใหม่สำหรับลูกค้า" />

            <div className="flex-1 p-8">
                <QuotationForm users={users} housePlans={housePlans} mode="create" />
            </div>
        </div>
    )
}
