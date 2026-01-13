"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import type { ProjectProgress } from "@/lib/types"

export default function AdminProgressEditPage() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<ProjectProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/progress/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.progress)
        setIsLoading(false)
      })
  }, [params.id])

  const handleMilestoneUpdate = (milestoneId: string, field: string, value: number | string) => {
    if (!project) return

    setProject({
      ...project,
      milestones: project.milestones.map((m) => (m.id === milestoneId ? { ...m, [field]: value } : m)),
    })
  }

  const handleSave = async () => {
    if (!project) return
    setIsSaving(true)

    try {
      await fetch(`/api/admin/progress/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestones: project.milestones }),
      })
      router.push("/admin/progress")
      router.refresh()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="อัปเดตความคืบหน้า" description="กำลังโหลด..." />
        <div className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="อัปเดตความคืบหน้า" description="ไม่พบโครงการ" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="อัปเดตความคืบหน้า" description={project.projectName} />

      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/admin/progress">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            บันทึก
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ความคืบหน้าโดยรวม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={project.overallProgress} className="h-4 flex-1" />
              <span className="text-2xl font-bold text-primary">{project.overallProgress}%</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">อัปเดตแต่ละงวด</h2>

          {project.milestones.map((milestone) => (
            <Card key={milestone.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  งวดที่ {milestone.phase}: {milestone.description}
                  <Badge
                    variant={
                      milestone.progressPercentage === 100
                        ? "default"
                        : milestone.progressPercentage > 0
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {milestone.progressPercentage}%
                  </Badge>
                </CardTitle>
                <CardDescription>จำนวนเงิน: {milestone.paymentAmount.toLocaleString()} บาท</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>เปอร์เซ็นต์ความคืบหน้า</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={milestone.progressPercentage}
                      onChange={(e) =>
                        handleMilestoneUpdate(milestone.id, "progressPercentage", Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>สถานะการชำระเงิน</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border bg-background"
                      value={milestone.paymentStatus}
                      onChange={(e) => handleMilestoneUpdate(milestone.id, "paymentStatus", e.target.value)}
                    >
                      <option value="pending">รอชำระ</option>
                      <option value="paid">ชำระแล้ว</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>URL รูปภาพ (คั่นด้วยจุลภาค)</Label>
                  <Textarea
                    value={milestone.images.join(", ")}
                    onChange={(e) =>
                      handleMilestoneUpdate(
                        milestone.id,
                        "images",
                        e.target.value.split(",").map((s) => s.trim()),
                      )
                    }
                    placeholder="/image1.jpg, /image2.jpg"
                  />
                </div>

                <Progress value={milestone.progressPercentage} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
