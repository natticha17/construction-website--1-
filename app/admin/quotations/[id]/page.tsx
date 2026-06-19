import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit3, Printer } from "lucide-react"
import { store } from "@/lib/store"
import { QuotationActions } from "@/components/admin/quotation-actions"
import { QuotationDocument } from "@/components/customer/quotation-document"

export default async function AdminQuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  const existingContract = await store.getContractByQuotation(id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-white">ตกลงว่าจ้างแล้ว</Badge>
      case "proposed":
        return <Badge className="bg-blue-500 text-white">รอการตรวจสอบจากลูกค้า</Badge>
      case "rejected":
        return <Badge variant="destructive">ลูกค้าไม่ตกลงว่าจ้าง</Badge>
      case "revision_requested":
        return <Badge className="bg-amber-500 text-white">ลูกค้ายื่นคำขอแก้ไข</Badge>
      case "revised":
        return <Badge className="bg-indigo-500 text-white">แก้ไขแล้ว (รอพิจารณา)</Badge>
      default:
        return <Badge variant="secondary">รอจัดทำใบเสนอราคา</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="รายละเอียดใบเสนอราคา" description={`เลขที่: ${quotation.quotationNumber || id}`} />

      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/admin/quotations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/quotations/${quotation.id}/edit`}>
                แก้ไข
              </Link>
            </Button>
            {quotation.status === "approved" && !existingContract && (
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href={`/admin/contracts/new?quotationId=${quotation.id}`}>
                  สร้างสัญญา
                </Link>
              </Button>
            )}
            {existingContract && (
              <Button asChild variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={`/admin/contracts/${existingContract.id}`}>
                  ดูสัญญาที่สร้างแล้ว
                </Link>
              </Button>
            )}
            {quotation.status === "pending" && <QuotationActions quotationId={quotation.id} />}
          </div>
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
                <span className="text-muted-foreground">พื้นที่ใช้สอย</span>
                <span>{quotation.area} ตร.ม.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">งบประมาณ</span>
                <span>{quotation.budget} บาท</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {quotation.status === "revision_requested" && quotation.revisionNote && (
          <Card className="border-amber-500 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800 flex items-center gap-2 text-lg">
                <Edit3 className="h-5 w-5" />
                รายละเอียดที่ลูกค้าขอให้แก้ไข
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-900 bg-white p-4 rounded-md border border-amber-200 whitespace-pre-wrap">
                {quotation.revisionNote}
              </p>
            </CardContent>
          </Card>
        )}

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

        {/* Project Images */}
        {(quotation.houseImage || (quotation.floorPlanImages && quotation.floorPlanImages.length > 0)) && (
          <div className="grid gap-6 md:grid-cols-2">
            {quotation.houseImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">แบบบ้าน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted/20">
                    <img
                      src={quotation.houseImage}
                      alt="House Design"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {quotation.floorPlanImages && quotation.floorPlanImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">แบบแปลนพื้น</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {quotation.floorPlanImages.map((img, idx) => (
                      <div key={idx} className="aspect-video relative rounded-md overflow-hidden border bg-muted/20">
                        <img
                          src={img}
                          alt={`Floor Plan ${idx + 1}`}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
                    <TableCell className="text-right">{(item.quantity || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.unit}</TableCell>
                    <TableCell className="text-right">{(item.pricePerUnit || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">{(item.totalPrice || 0).toLocaleString()}</TableCell>
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
                <span>{(quotation.subtotal || 0).toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าแรง</span>
                <span>{(quotation.laborCost || 0).toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าดำเนินการ</span>
                <span>{(quotation.operationCost || 0).toLocaleString()} บาท</span>
              </div>


              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>ยอดรวมทั้งหมด</span>
                <span className="text-primary">{(quotation.grandTotal || 0).toLocaleString()} บาท</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-8 border-t bg-gray-50/50">
        <div className="max-w-[210mm] mx-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Printer className="h-5 w-5" />
            ตัวอย่างเอกสารใบเสนอราคา (พิมพ์)
          </h2>
          <div className="shadow-lg">
            <QuotationDocument quotation={quotation} />
          </div>
        </div>
      </div>
    </div>
  )
}
