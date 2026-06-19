import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Eye, ArrowLeft } from "lucide-react"
import { store } from "@/lib/store"

export default async function CustomerQuotationsPage() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId || !/^[0-9a-fA-F]{24}$/.test(customerId.value)) {
    redirect("/login")
  }

  const quotations = await store.getQuotationsByCustomer(customerId.value)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "revision_requested":
        return <Badge className="bg-amber-500 text-white">ขอแก้ไขแล้ว</Badge>
      case "revised":
        return <Badge className="bg-indigo-500 text-white">แก้ไขแล้ว</Badge>
      case "proposed":
        return <Badge className="bg-blue-500 text-white">รอตรวจสอบ</Badge>
      case "approved":
        return <Badge className="bg-green-600 text-white">ว่าจ้างแล้ว</Badge>
      case "rejected":
        return <Badge variant="destructive">ไม่ว่าจ้าง</Badge>
      default:
        return <Badge variant="secondary">รอจัดทำ</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary" asChild>
          <Link href="/customer/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            ย้อนกลับ
          </Link>
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">ใบเสนอราคา (ประมาณการ)</h1>
            <p className="text-muted-foreground">รายการใบเสนอราคาเบื้องต้นของคุณ</p>
          </div>
          <Button asChild>
            <Link href="/customer/quotations/request">
              <Plus className="h-4 w-4 mr-2" />
              ขอใบเสนอราคาใหม่
            </Link>
          </Button>
        </div>
      </div>

      {quotations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">ยังไม่มีใบเสนอราคา</h3>
            <p className="text-muted-foreground mb-4">เริ่มต้นขอใบเสนอราคาสำหรับบ้านในฝันของคุณ</p>
            <Button asChild>
              <Link href="/customer/quotations/request">ขอใบเสนอราคา</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quotations.map((quotation) => (
            <Card key={quotation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {quotation.housePlanName}
                      {getStatusBadge(quotation.status)}
                    </CardTitle>
                    <CardDescription>
                      เลขที่: {quotation.quotationNumber || quotation.id} | พื้นที่ใช้สอย {quotation.area} ตร.ม.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/customer/quotations/${quotation.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      ดูรายละเอียด
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    วันที่ขอ: {new Date(quotation.createdAt).toLocaleDateString("th-TH")}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">ยอดรวมประมาณการ</p>
                    <p className="text-2xl font-bold text-primary">
                      {quotation.status === "pending" ? "รอเสนอราคา" : `${(quotation.grandTotal || 0).toLocaleString()} บาท`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}