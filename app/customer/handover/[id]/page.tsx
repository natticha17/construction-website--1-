import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import { store } from "@/lib/store"
import { HandoverDocument } from "../../../../components/admin/handover-document"
import { CustomerHandoverClient } from "../../../../components/customer/customer-handover-client"
import type { Contract } from "@/lib/types"

export default async function CustomerHandoverPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: contractId } = await params
    const cookieStore = await cookies()
    const customerId = cookieStore.get("customer_id")

    if (!customerId) {
        redirect("/login")
    }

    let contract: Contract | undefined;
    try {
        contract = await store.getContract(contractId)
    } catch (error) {
        console.error("CustomerHandoverPage Error:", error)
        notFound()
    }

    if (!contract || contract.customerId !== customerId.value) {
        notFound()
    }

    // Only allow viewing if project is completed
    if (contract.status !== "completed") {
        redirect(`/customer/progress/${contract.id}`)
    }


    return (
        <div className="space-y-6 max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/customer/progress`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">ใบส่งมอบงานก่อสร้าง</h1>
                        <p className="text-muted-foreground">เอกสารยืนยันการจบโครงการของท่าน</p>
                    </div>
                </div>

                <CustomerHandoverClient contract={contract} />
            </div>

            <Card className="shadow-2xl border-t-4 border-t-green-500 overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                    <div className="flex items-center gap-3 text-green-700">
                        <FileText className="h-6 w-6" />
                        <div>
                            <CardTitle>เอกสารรับรองการส่งมอบ</CardTitle>
                            <CardDescription>โครงการ: {contract.projectName}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 bg-slate-200/30 flex justify-center py-12 overflow-auto">
                    <div className="shadow-2xl bg-white origin-top sm:scale-100 scale-[0.55] sm:mb-0 mb-[-300px]">
                        <HandoverDocument contract={contract} />
                    </div>
                </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <FileText className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-bold text-blue-900 mb-1">คำแนะนำการใช้งาน</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        ท่านสามารถพิมพ์หรือบันทึกเอกสารนี้เป็น PDF เพื่อเก็บไว้เป็นหลักฐานการส่งมอบงานและการรับประกันตามข้อตกลงในสัญญา
                        หากท่านมีข้อสงสัยหรือความต้องการเพิ่มเติม สามารถติดต่อฝ่ายบริการลูกค้าของเราได้ตลอดเวลา
                    </p>
                </div>
            </div>
        </div>
    )
}
