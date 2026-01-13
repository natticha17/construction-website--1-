import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Clock, ImageIcon } from "lucide-react"
import { store } from "@/lib/store"

export default async function ProgressDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/customer/login")
  }

  const progress = store.getProjectProgress(id)
  if (!progress || progress.customerId !== customerId.value) {
    notFound()
  }

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

              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">จำนวนเงินที่ต้องชำระเมื่อครบงวด</p>
                  <p className="text-xl font-bold">{milestone.paymentAmount.toLocaleString()} บาท</p>
                </div>
                <div className="text-right">
                  {milestone.paymentStatus === "paid" ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <div>
                        <p className="font-medium">ชำระแล้ว</p>
                        <p className="text-xs">
                          {milestone.paidAt && new Date(milestone.paidAt).toLocaleDateString("th-TH")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Clock className="h-5 w-5" />
                      <p className="font-medium">รอชำระ</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
