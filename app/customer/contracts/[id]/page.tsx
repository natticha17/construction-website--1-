import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Printer, CheckCircle } from "lucide-react"
import { store } from "@/lib/store"
import { AcceptContractButton } from "@/components/customer/accept-contract-button"

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/customer/login")
  }

  const contract = store.getContract(id)
  if (!contract || contract.customerId !== customerId.value) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500 text-white">ยอมรับแล้ว</Badge>
      case "completed":
        return <Badge className="bg-blue-500 text-white">เสร็จสิ้น</Badge>
      default:
        return <Badge variant="secondary">รอยืนยัน</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/customer/contracts">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              ใบสัญญาจ้าง
              {getStatusBadge(contract.status)}
            </h1>
            <p className="text-muted-foreground">เลขที่: {contract.id}</p>
          </div>
        </div>
        <Button variant="outline" className="print:hidden bg-transparent">
          <Printer className="h-4 w-4 mr-2" />
          พิมพ์
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>สัญญาจ้างก่อสร้างบ้าน</CardTitle>
          <CardDescription>ระหว่าง บริษัท บ้านสร้างฝัน จำกัด และ {contract.customerName}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            สัญญาฉบับนี้ทำขึ้นระหว่าง <strong>บริษัท บ้านสร้างฝัน จำกัด</strong> ซึ่งต่อไปในสัญญานี้เรียกว่า "ผู้รับจ้าง" ฝ่ายหนึ่ง กับ{" "}
            <strong>{contract.customerName}</strong> ซึ่งต่อไปในสัญญานี้เรียกว่า "ผู้ว่าจ้าง" อีกฝ่ายหนึ่ง
          </p>

          <p>ทั้งสองฝ่ายตกลงทำสัญญากันมีข้อความดังต่อไปนี้:</p>

          <h4>ข้อ 1. งานที่จ้าง</h4>
          <p>ผู้ว่าจ้างตกลงจ้างและผู้รับจ้างตกลงรับจ้างก่อสร้าง: {contract.projectDetails}</p>

          <h4>ข้อ 2. ราคาจ้าง</h4>
          <p>
            ผู้ว่าจ้างตกลงจ่ายค่าจ้างให้แก่ผู้รับจ้างเป็นเงินทั้งสิ้น <strong>{contract.contractValue.toLocaleString()} บาท</strong>{" "}
            โดยแบ่งชำระเป็นงวดๆ ตามความคืบหน้าของงาน
          </p>

          <h4>ข้อ 3. กำหนดเวลาก่อสร้าง</h4>
          <p>
            ผู้รับจ้างจะเริ่มดำเนินการก่อสร้างภายในวันที่{" "}
            {new Date(contract.startDate).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            และจะแล้วเสร็จภายในวันที่{" "}
            {new Date(contract.endDate).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            รวมระยะเวลา <strong>{contract.constructionPeriod}</strong>
          </p>

          <h4>ข้อ 4. การรับประกัน</h4>
          <p>
            ผู้รับจ้างรับประกันความชำรุดบกพร่องของงานก่อสร้างเป็นเวลา 1 ปี นับจากวันส่งมอบงาน
            ยกเว้นความเสียหายที่เกิดจากภัยธรรมชาติหรือการใช้งานผิดประเภท
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">มูลค่าสัญญา</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{contract.contractValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">บาท</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ระยะเวลาก่อสร้าง</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{contract.constructionPeriod}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(contract.startDate).toLocaleDateString("th-TH")} -{" "}
              {new Date(contract.endDate).toLocaleDateString("th-TH")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">สถานะสัญญา</CardTitle>
          </CardHeader>
          <CardContent>
            {contract.status === "accepted" ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <div>
                  <p className="font-bold">ยอมรับแล้ว</p>
                  <p className="text-sm text-muted-foreground">
                    {contract.acceptedAt && new Date(contract.acceptedAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">รอการยืนยัน</p>
            )}
          </CardContent>
        </Card>
      </div>

      {contract.status === "pending" && (
        <Card className="border-primary">
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <h3 className="font-semibold">ยืนยันสัญญา</h3>
              <p className="text-sm text-muted-foreground">กรุณาอ่านเงื่อนไขและยืนยันการยอมรับสัญญา</p>
            </div>
            <AcceptContractButton contractId={contract.id} />
          </CardContent>
        </Card>
      )}

      {contract.status === "accepted" && (
        <div className="flex justify-end">
          <Button asChild size="lg">
            <Link href="/customer/progress">ดูความคืบหน้าโครงการ</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
