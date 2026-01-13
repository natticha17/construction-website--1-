import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileSignature, Eye, AlertCircle } from "lucide-react"
import { store } from "@/lib/store"

export default async function CustomerContractsPage() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/customer/login")
  }

  const user = store.getUser(customerId.value)
  const contracts = store.getContractsByCustomer(customerId.value)

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

  // Check if user is project owner
  if (user?.customerType !== "project_owner") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">สัญญา</h1>
          <p className="text-muted-foreground">ใบสัญญาจ้างอิเล็กทรอนิกส์</p>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-4 py-6">
            <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">สำหรับเจ้าของโครงการเท่านั้น</h3>
              <p className="text-amber-700 mt-1">
                ระบบสัญญาจ้างสำหรับลูกค้าที่ได้รับการอนุมัติเป็นเจ้าของโครงการ กรุณาติดต่อเจ้าหน้าที่เพื่อขอเปลี่ยนสถานะ
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">สัญญา</h1>
        <p className="text-muted-foreground">ใบสัญญาจ้างอิเล็กทรอนิกส์ของคุณ</p>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileSignature className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">ยังไม่มีสัญญา</h3>
            <p className="text-muted-foreground">เมื่อใบเสนอราคาได้รับการอนุมัติ สัญญาจะปรากฏที่นี่</p>
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
                    <CardDescription>เลขที่สัญญา: {contract.id}</CardDescription>
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
