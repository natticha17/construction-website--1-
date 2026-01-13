import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Eye, AlertCircle } from "lucide-react"
import { store } from "@/lib/store"

export default async function CustomerProgressPage() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/customer/login")
  }

  const user = store.getUser(customerId.value)
  const progressList = store.getProjectProgressByCustomer(customerId.value)

  // Check if user is project owner
  if (user?.customerType !== "project_owner") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">ความคืบหน้าโครงการ</h1>
          <p className="text-muted-foreground">ติดตามความคืบหน้าการก่อสร้างของคุณ</p>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-4 py-6">
            <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">สำหรับเจ้าของโครงการเท่านั้น</h3>
              <p className="text-amber-700 mt-1">
                ระบบติดตามความคืบหน้าสำหรับลูกค้าที่มีโครงการก่อสร้าง กรุณาติดต่อเจ้าหน้าที่เพื่อขอเปลี่ยนสถานะ
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
        <h1 className="text-3xl font-bold">ความคืบหน้าโครงการ</h1>
        <p className="text-muted-foreground">ติดตามความคืบหน้าการก่อสร้างของคุณ</p>
      </div>

      {progressList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">ยังไม่มีโครงการ</h3>
            <p className="text-muted-foreground">เมื่อสัญญาได้รับการยืนยัน โครงการจะปรากฏที่นี่</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {progressList.map((project) => {
            const pendingPayments = project.milestones.filter(
              (m) => m.paymentStatus === "pending" && m.progressPercentage === 100,
            )

            return (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{project.projectName}</CardTitle>
                      <CardDescription>
                        อัปเดตล่าสุด: {new Date(project.updatedAt).toLocaleDateString("th-TH")}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/customer/progress/${project.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        ดูรายละเอียด
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">ความคืบหน้าโดยรวม</span>
                      <span className="font-bold text-primary">{project.overallProgress}%</span>
                    </div>
                    <Progress value={project.overallProgress} className="h-3" />
                  </div>

                  <div className="grid gap-2 md:grid-cols-5">
                    {project.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`p-3 rounded-lg text-center ${
                          milestone.progressPercentage === 100
                            ? "bg-green-100 text-green-800"
                            : milestone.progressPercentage > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-muted"
                        }`}
                      >
                        <p className="text-xs font-medium">งวดที่ {milestone.phase}</p>
                        <p className="text-lg font-bold">{milestone.progressPercentage}%</p>
                      </div>
                    ))}
                  </div>

                  {pendingPayments.length > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-800">มีงวดที่ต้องชำระเงิน</p>
                        <p className="text-sm text-amber-700">
                          รวม {pendingPayments.reduce((sum, m) => sum + m.paymentAmount, 0).toLocaleString()} บาท
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
