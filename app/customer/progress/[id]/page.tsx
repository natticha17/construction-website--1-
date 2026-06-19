import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Clock, ImageIcon, ClipboardList } from "lucide-react"
import { store } from "@/lib/store"
import { MilestonePaymentStatus } from "@/components/customer/milestone-payment-status"

export default async function ProgressDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/login")
  }

  const progress = await store.getProjectProgress(id)
  if (!progress || progress.customerId !== customerId.value) {
    notFound()
  }

  const contract = await store.getContract(progress.contractId)
  const isCompleted = contract?.status === "completed"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/customer/progress">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{progress.projectName}</h1>
          <p className="text-muted-foreground">อัปเดตล่าสุด: {new Date(progress.updatedAt).toLocaleDateString("th-TH")}</p>
        </div>
      </div>

      {isCompleted && (
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none shadow-xl">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">โครงการก่อสร้างเสร็จสิ้นสมบูรณ์</h2>
                <p className="text-green-50/90 max-w-md">เราขอแสดงความยินดีที่โครงการของท่านดำเนินการเสร็จสิ้นเรียบร้อยแล้ว ท่านสามารถตรวจสอบและรับใบส่งมอบงานได้ที่ด้านล่าง</p>
              </div>
            </div>
            <Button size="lg" variant="secondary" asChild className="shrink-0 font-bold px-8">
              <Link href={`/customer/handover/${contract?.id}`}>รับใบส่งมอบงาน (Handover Certificate)</Link>
            </Button>
          </CardContent>
        </Card>
      )}


      <Card>
        <CardHeader>
          <CardTitle>ความคืบหน้าโดยรวม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={progress.overallProgress} className="h-4 flex-1" />
            <span className="text-2xl font-bold text-primary">{progress.overallProgress}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">รายละเอียดแต่ละงวด</h2>

        {progress.milestones.map((milestone) => (
          <Card
            key={milestone.id}
            className={milestone.progressPercentage === 100 ? "border-green-200" : "border-muted"}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    งวดที่ {milestone.phase}: {milestone.description}
                    {milestone.progressPercentage === 100 ? (
                      <Badge className="bg-green-500 text-white">เสร็จสิ้น</Badge>
                    ) : milestone.progressPercentage > 0 ? (
                      <Badge variant="secondary">กำลังดำเนินการ</Badge>
                    ) : (
                      <Badge variant="outline">รอดำเนินการ</Badge>
                    )}
                  </CardTitle>
                  {milestone.updatedAt && (
                    <CardDescription>
                      อัปเดตล่าสุด: {new Date(milestone.updatedAt).toLocaleDateString("th-TH")}
                    </CardDescription>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{milestone.progressPercentage}%</p>
                  <p className="text-sm text-muted-foreground">ความคืบหน้า</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={milestone.progressPercentage} className="h-2" />

              {milestone.checklist && milestone.checklist.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
                  <h4 className="font-medium text-slate-700 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-blue-500" />
                    รายการงานย่อยที่ดำเนินการ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {(milestone.checklist as any[]).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" />
                        )}
                        <span className={`text-sm ${item.completed ? "text-green-700 font-medium" : "text-slate-700"}`}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {milestone.images.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    รูปภาพประกอบ
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {milestone.images.map((img, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Progress ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {milestone.report && (
                <div className="p-4 bg-muted/30 rounded-lg border border-muted-foreground/10 space-y-2">
                  <h4 className="font-medium flex items-center gap-2 text-primary">
                    <ClipboardList className="h-4 w-4" />
                    รายงานการดำเนินงาน
                  </h4>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                    {milestone.report}
                  </p>
                </div>
              )}

              <MilestonePaymentStatus
                projectId={id}
                milestone={milestone as any}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div >
  )
}
