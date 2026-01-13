import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import { store } from "@/lib/store"
import { QuotationActions } from "@/components/admin/quotation-actions"

export default async function AdminQuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    redirect("/admin/login")
  }

  const quotation = store.getQuotation(id)
  if (!quotation) {
    notFound()
  }

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
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="รายละเอียดใบเสนอราคา" description={`เลขที่: ${quotation.id}`} />

      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/admin/quotations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Link>
          </Button>
          {quotation.status === "pending" && <QuotationActions quotationId={quotation.id} />}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลลูกค้า</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ชื่อลูกค้า</span>
                <span className="font-medium">{quotation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">สถานะ</span>
                {getStatusBadge(quotation.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">วันที่สร้าง</span>
                <span>{new Date(quotation.createdAt).toLocaleDateString("th-TH")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลโครงการ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">แบบบ้าน</span>
                <span className="font-medium">{quotation.housePlanName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">พื้นที่</span>
                <span>{quotation.area} ตร.ม.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ระดับวัสดุ</span>
                <span>{quotation.materialType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">งบประมาณ</span>
                <span>{quotation.budget} บาท</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {quotation.additionalRequirements && (
          <Card>
            <CardHeader>
              <CardTitle>ความต้องการเพิ่มเติม</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{quotation.additionalRequirements}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>รายการวัสดุ</CardTitle>
            <CardDescription>รายละเอียดวัสดุและราคา</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รายการ</TableHead>
                  <TableHead className="text-right">จำนวน</TableHead>
                  <TableHead className="text-right">หน่วย</TableHead>
                  <TableHead className="text-right">ราคา/หน่วย</TableHead>
                  <TableHead className="text-right">รวม</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotation.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.materialName}</TableCell>
                    <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.unit}</TableCell>
                    <TableCell className="text-right">{item.pricePerUnit.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">{item.totalPrice.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>สรุปราคา</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">รวมค่าวัสดุ</span>
                <span>{quotation.subtotal.toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าแรง</span>
                <span>{quotation.laborCost.toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าดำเนินการ</span>
                <span>{quotation.operationCost.toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ภาษี (7%)</span>
                <span>{quotation.tax.toLocaleString()} บาท</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>ยอดรวมทั้งหมด</span>
                <span className="text-primary">{quotation.grandTotal.toLocaleString()} บาท</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
