import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Eye } from "lucide-react"
import { store } from "@/lib/store"

export default async function CustomerQuotationsPage() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/customer/login")
  }

  const quotations = store.getQuotationsByCustomer(customerId.value)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-white">อนุมัติแล้ว</Badge>
      case "rejected":
        return <Badge variant="destructive">ไม่อนุมัติ</Badge>
      default:
        return <Badge variant="secondary">รอพิจารณา</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ใบเสนอราคา</h1>
          <p className="text-muted-foreground">รายการใบเสนอราคาเบื้องต้นของคุณ</p>
        </div>
        <Button asChild>
          <Link href="/customer/quotations/request">
            <Plus className="h-4 w-4 mr-2" />
            ขอใบเสนอราคาใหม่
          </Link>
        </Button>
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
                      พื้นที่ {quotation.area} ตร.ม. | วัสดุ {quotation.materialType}
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
                    <p className="text-2xl font-bold text-primary">{quotation.grandTotal.toLocaleString()} บาท</p>
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
