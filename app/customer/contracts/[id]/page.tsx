import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { store } from "@/lib/store"
import { AcceptContractButton } from "@/components/customer/accept-contract-button"
import { CustomerContractWrapper } from "@/components/customer/customer-contract-wrapper"

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/login")
  }

  const contract = await store.getContract(id)
  if (!contract || contract.customerId !== customerId.value) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500 text-white">อนุมัติแล้ว</Badge>
      case "completed":
        return <Badge className="bg-blue-500 text-white">เสร็จสิ้น</Badge>
      default:
        return <Badge variant="secondary">รอยืนยัน</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/customer/contracts">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              ใบสัญญาจ้าง
              {getStatusBadge(contract.status)}
            </h1>
            <p className="text-muted-foreground text-sm">เลขที่: {contract.contractNumber || contract.id}</p>
          </div>
        </div>

        {contract.status === "accepted" && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">อนุมัติสัญญาเมื่อ {contract.acceptedAt && new Date(contract.acceptedAt).toLocaleDateString("th-TH")}</span>
          </div>
        )}
      </div>

      {/* Main Professional Contract Document Preview */}
      <CustomerContractWrapper contract={contract} />

      {contract.status === "pending" && (
        <Card className="border-primary shadow-lg overflow-hidden print:hidden">
          <CardContent className="flex items-center justify-between py-6 bg-blue-50/50">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">ตรวจสอบและยืนยันสัญญา</h3>
                <p className="text-sm text-muted-foreground">กรุณาตรวจสอบรายละเอียดในสัญญาด้านบนให้ครบถ้วนก่อนกดยืนยัน</p>
              </div>
            </div>
            <AcceptContractButton contractId={contract.id} />
          </CardContent>
        </Card>
      )}

      {contract.status === "accepted" && (
        <div className="flex justify-center print:hidden">
          <Button asChild size="lg" className="px-12 rounded-full shadow-lg">
            <Link href="/customer/progress">ดูความคืบหน้าโครงการของท่าน</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
