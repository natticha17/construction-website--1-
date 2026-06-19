import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileSignature, Eye, AlertCircle, ArrowLeft } from "lucide-react"
import { store } from "@/lib/store"

export default async function CustomerContractsPage() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/login")
  }

  const user = await store.getUser(customerId.value)
  const contracts = await store.getContractsByCustomer(customerId.value)

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
      <div>
        <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary" asChild>
          <Link href="/customer/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            ย้อนกลับ
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">สัญญา</h1>
        <p className="text-muted-foreground">ใบสัญญาจ้างอิเล็กทรอนิกส์ของคุณ</p>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileSignature className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">ยังไม่มีสัญญา</h3>
            <p className="text-muted-foreground">เมื่อมีการตกลงว่าจ้างจากใบเสนอราคาแล้ว สัญญาจะปรากฏที่นี่</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {contract.projectName}
                      {getStatusBadge(contract.status)}
                    </CardTitle>
                    <CardDescription>เลขที่สัญญา: {contract.contractNumber || contract.id}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/customer/contracts/${contract.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      ดูรายละเอียด
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">มูลค่าสัญญา</p>
                    <p className="text-xl font-bold text-primary">{contract.contractValue.toLocaleString()} บาท</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ระยะเวลาก่อสร้าง</p>
                    <p className="font-medium">{contract.constructionPeriod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">วันที่ทำสัญญา</p>
                    <p className="font-medium">
                      {contract.acceptedAt ? new Date(contract.acceptedAt).toLocaleDateString("th-TH") : "ยังไม่ได้ยืนยัน"}
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
