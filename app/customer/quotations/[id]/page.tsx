import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Printer, FileText } from "lucide-react"
import { store } from "@/lib/store"

export default async function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/customer/login")
  }

  const quotation = store.getQuotation(id)
  if (!quotation || quotation.customerId !== customerId.value) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/customer/quotations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              ใบเสนอราคาเบื้องต้น
              {getStatusBadge(quotation.status)}
            </h1>
            <p className="text-muted-foreground">เลขที่: {quotation.id}</p>
          </div>
        </div>
        <Button variant="outline" className="print:hidden bg-transparent">
          <Printer className="h-4 w-4 mr-2" />
          พิมพ์
        </Button>
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
              <span className="text-muted-foreground">วันที่ขอ</span>
              <span className="font-medium">{new Date(quotation.createdAt).toLocaleDateString("th-TH")}</span>
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
              <span className="font-medium">{quotation.area} ตร.ม.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ระดับวัสดุ</span>
              <span className="font-medium">{quotation.materialType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">งบประมาณ</span>
              <span className="font-medium">{quotation.budget} บาท</span>
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
          <CardDescription>รายละเอียดวัสดุและราคาประมาณการ</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>หมายเหตุและเงื่อนไข</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">หมายเหตุ</h4>
            <p className="text-muted-foreground">{quotation.notes}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">เงื่อนไข</h4>
            <p className="text-muted-foreground">{quotation.conditions}</p>
          </div>
        </CardContent>
      </Card>

      {quotation.status === "approved" && (
        <div className="flex justify-end">
          <Button asChild size="lg">
            <Link href="/customer/contracts">
              <FileText className="h-4 w-4 mr-2" />
              ดูสัญญา
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
