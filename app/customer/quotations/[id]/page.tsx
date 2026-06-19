import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Printer, FileText, Info } from "lucide-react"
import { store } from "@/lib/store"
import { QuotationActions } from "@/components/customer/quotation-actions"
import { PrintButton } from "@/components/customer/print-button"
import { QuotationDocument } from "@/components/customer/quotation-document"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default async function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId || !/^[0-9a-fA-F]{24}$/.test(customerId.value)) {
    redirect("/login")
  }

  const quotation = await store.getQuotation(id)
  if (!quotation || quotation.customerId !== customerId.value) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-white">ตกลงว่าจ้างแล้ว</Badge>
      case "proposed":
        return <Badge className="bg-blue-500 text-white">รอตรวจสอบ</Badge>
      case "rejected":
        return <Badge variant="destructive">ไม่ตกลงว่าจ้าง</Badge>
      case "revision_requested":
        return <Badge className="bg-amber-500 text-white">ขอแก้ไขแล้ว</Badge>
      case "revised":
        return <Badge className="bg-indigo-500 text-white">แก้ไขแล้ว</Badge>
      default:
        return <Badge variant="secondary">รอติดต่อกลับ</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/customer/quotations">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                ใบเสนอราคา (ประมาณการ)
                {getStatusBadge(quotation.status)}
              </h1>
              <p className="text-muted-foreground">เลขที่: {quotation.quotationNumber || quotation.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {["pending", "proposed", "revision_requested", "revised"].includes(quotation.status) && (
              <QuotationActions quotationId={quotation.id} />
            )}
            <PrintButton />
          </div>
        </div>

        {quotation.status === "revised" && (
          <Alert className="bg-indigo-50 border-indigo-200">
            <Info className="h-4 w-4 text-indigo-600" />
            <AlertTitle className="text-indigo-800">ใบเสนอราคานี้ได้รับการแก้ไขแล้ว</AlertTitle>
            <AlertDescription className="text-indigo-700">
              ฝ่ายขายได้ปรับปรุงรายละเอียดตามที่คุณแจ้งขอแก้ไขแล้ว กรุณาตรวจสอบข้อมูลและพิจารณาดำเนินการต่อ (ตกลงว่าจ้าง หรือ ขอแก้ไขเพิ่มเติม)
            </AlertDescription>
          </Alert>
        )}

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
                <span className="text-muted-foreground">พื้นที่ใช้สอย</span>
                <span className="font-medium">{quotation.area} ตร.ม.</span>
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

        {/* Unified Project Images Grid */}
        {(quotation.houseImage || (quotation.floorPlanImages && quotation.floorPlanImages.length > 0)) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">แบบบ้านและแปลนพื้น</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* House Image */}
                {quotation.houseImage && (
                  <div className="aspect-video relative rounded-md overflow-hidden border bg-muted/10 group cursor-zoom-in">
                    <img
                      src={quotation.houseImage}
                      alt="House Design"
                      className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm">
                      แบบบ้าน
                    </div>
                  </div>
                )}

                {/* Floor Plan Images */}
                {quotation.floorPlanImages && quotation.floorPlanImages.map((img, idx) => (
                  <div key={idx} className="aspect-video relative rounded-md overflow-hidden border bg-muted/5 group cursor-zoom-in">
                    <img
                      src={img}
                      alt={`Floor Plan ${idx + 1}`}
                      className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm">
                      แปลนชั้น {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}


        {/* Only show items and pricing if they exist and status is not pending */}
        {(quotation.items && quotation.items.length > 0 && quotation.status !== "pending") ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>รายการวัสดุ</CardTitle>
                <CardDescription>รายละเอียดวัสดุและราคาที่ประเมินโดยเจ้าหน้าที่</CardDescription>
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
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">อยู่ระหว่างการจัดทำใบเสนอราคา</h3>
              <p className="text-muted-foreground">เจ้าหน้าที่กำลังตรวจสอบรายละเอียดและประเมินราคาตามสิ่งที่คุณระบุ</p>
            </CardContent>
          </Card>
        )}

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
      <QuotationDocument quotation={quotation} />
    </div>
  )
}
