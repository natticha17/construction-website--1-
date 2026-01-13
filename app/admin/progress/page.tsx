import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Edit } from "lucide-react"
import { store } from "@/lib/store"

export default async function AdminProgressPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    redirect("/admin/login")
  }

  const progressList = store.getProjectProgressList()

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="จัดการความคืบหน้าโครงการ" description="อัปเดตความคืบหน้าของแต่ละโครงการ" />

      <div className="flex-1 p-8">
        {progressList.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">ยังไม่มีโครงการที่ต้องอัปเดต</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {progressList.map((project) => (
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
                      <Link href={`/admin/progress/${project.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        อัปเดต
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
                        <Badge
                          variant={milestone.paymentStatus === "paid" ? "default" : "outline"}
                          className="mt-1 text-xs"
                        >
                          {milestone.paymentStatus === "paid" ? "ชำระแล้ว" : "รอชำระ"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
