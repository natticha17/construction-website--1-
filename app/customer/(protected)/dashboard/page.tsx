import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileSignature, TrendingUp, AlertCircle } from "lucide-react"
import { store } from "@/lib/store"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export default async function CustomerDashboardPage() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/login")
  }

  await connectDB()
  const user = await User.findById(customerId.value).lean()
  if (!user) {
    redirect("/login")
  }

  const quotations = await store.getQuotationsByCustomer(customerId.value)
  const contracts = await store.getContractsByCustomer(customerId.value)
  const progressList = await store.getProjectProgressByCustomer(customerId.value)

  const pendingPayments = progressList.flatMap((p) =>
    p.milestones.filter((m) => m.paymentStatus === "pending" && m.progressPercentage === 100),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">สวัสดี, {user.name}</h1>
        <p className="text-muted-foreground">ยินดีต้อนรับสู่ระบบจัดการโครงการก่อสร้างของคุณ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ใบเสนอราคา</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotations.length}</div>
            <p className="text-xs text-muted-foreground">รายการทั้งหมด</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">สัญญา</CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
            <p className="text-xs text-muted-foreground">โครงการที่ดำเนินการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">โครงการ</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressList.length}</div>
            <p className="text-xs text-muted-foreground">กำลังดำเนินการ</p>
          </CardContent>
        </Card>
      </div>

      {pendingPayments.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              รอชำระเงิน
            </CardTitle>
            <CardDescription className="text-amber-700">มี {pendingPayments.length} งวดที่ต้องชำระเงิน</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="border-amber-300 text-amber-800 hover:bg-amber-100 bg-transparent"
            >
              <Link href="/customer/progress">ดูรายละเอียด</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {user.customerType === "general" && (
        <Card>
          <CardHeader>
            <CardTitle>เริ่มต้นใช้งาน</CardTitle>
            <CardDescription>ขอใบเสนอราคาเบื้องต้นสำหรับบ้านในฝันของคุณ</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/customer/quotations/request">ขอใบเสนอราคา</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {progressList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ความคืบหน้าล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressList.map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{project.projectName}</p>
                    <p className="text-sm text-muted-foreground">
                      อัปเดตล่าสุด: {new Date(project.updatedAt).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{project.overallProgress}%</p>
                    <p className="text-xs text-muted-foreground">ความคืบหน้า</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
