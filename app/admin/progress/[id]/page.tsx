"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2, CheckCircle, Clock, Lock, Unlock } from "lucide-react"
import NextImage from "next/image"
import type { ProjectProgress } from "@/lib/types"

export default function AdminProgressEditPage() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<any | null>(null)
  const [contract, setContract] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [unlockedPayments, setUnlockedPayments] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(`/api/admin/progress/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.progress)
        setContract(data.contract)
        setIsLoading(false)
      })
  }, [params.id])

  const updateMilestone = (milestoneId: string, updates: any) => {
    if (!project) return

    const updatedMilestones = project.milestones.map((m: any) =>
      m.id === milestoneId ? { ...m, ...updates } : m
    )

    // Recalculate overall progress
    const total = updatedMilestones.length
    const weightedSum = updatedMilestones.reduce((sum: number, m: any) => sum + (m.progressPercentage || 0), 0)
    const newOverallProgress = total > 0 ? Math.round(weightedSum / total) : 0

    setProject({
      ...project,
      milestones: updatedMilestones,
      overallProgress: newOverallProgress
    })
  }

  // Wrapper for single field updates to maintain compatibility or just replaced usage
  const handleMilestoneUpdate = (milestoneId: string, field: string, value: any) => {
    updateMilestone(milestoneId, { [field]: value })
  }


  const handleAddMilestone = () => {
    if (!project) return
    const newPhase = project.milestones.length + 1
    // Generate a temporary ID (will be replaced by DB or kept if we use random string)
    // using random string for now to key react list
    const tempId = Math.random().toString(36).substr(2, 9)

    setProject({
      ...project,
      milestones: [
        ...project.milestones,
        {
          id: tempId,
          phase: newPhase,
          description: "งวดงานใหม่",
          progressPercentage: 0,
          images: [],
          paymentStatus: "pending",
          paymentAmount: 0,
          updatedAt: new Date().toISOString()
        }
      ]
    })
  }

  const handleDeleteMilestone = (milestoneId: string) => {
    if (!project) return
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงวดงานนี้?")) return

    const updatedMilestones = project.milestones
      .filter((m: any) => m.id !== milestoneId)
      .map((m: any, index: number) => ({ ...m, phase: index + 1 })) // Re-index phases

    setProject({
      ...project,
      milestones: updatedMilestones
    })
  }

  const handleSyncWithContract = () => {
    if (!contract || !project) return
    if (!confirm("คุณต้องการดึงข้อมูลรายละเอียดงานและจำนวนเงินจากใบสัญญาจ้างมาแทนที่ข้อมูลปัจจุบันใช่หรือไม่?")) return

    const contractMilestones = (contract.installments || []).map((inst: any) => {
      const existing = project.milestones.find((m: any) => m.phase === inst.installmentNumber)

      // Sync checklist: preserve completed status for existing tasks
      const checklist = (inst.tasks || []).map((t: string) => {
        const existingItem = (existing?.checklist || []).find((c: any) => c.task === t)
        return { task: t, completed: existingItem ? existingItem.completed : false }
      })

      // Auto-calc percentage if checklist exists
      let progressPercentage = existing?.progressPercentage || 0
      if (checklist.length > 0) {
        const completedCount = checklist.filter((item: any) => item.completed).length
        progressPercentage = Math.round((completedCount / checklist.length) * 100)
      }

      return {
        id: existing?.id || Math.random().toString(36).substr(2, 9),
        phase: inst.installmentNumber,
        description: inst.description,
        progressPercentage,
        checklist,
        images: existing?.images || [],
        paymentStatus: existing?.paymentStatus || "pending",
        paymentAmount: inst.amount,
        paymentMethod: existing?.paymentMethod,
        paymentSlip: existing?.paymentSlip,
        paidAt: existing?.paidAt,
        report: existing?.report,
        updatedAt: new Date().toISOString()
      }
    })

    if (contractMilestones.length === 0) {
      alert("ไม่พบข้อมูลรายการงวดงานในสัญญา")
      return
    }

    setProject({
      ...project,
      milestones: contractMilestones
    })
  }

  const handleSave = async () => {
    if (!project) return
    setIsSaving(true)

    // Ensure numeric fields are numbers before sending
    const milestonesToSave = project.milestones.map((m: any) => ({
      ...m,
      progressPercentage: Number(m.progressPercentage) || 0,
      paymentAmount: Number(m.paymentAmount) || 0
    }))

    try {
      await fetch(`/api/admin/progress/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestones: milestonesToSave }),
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
          <div className="flex gap-2">
            {contract && (
              <Button variant="outline" onClick={handleSyncWithContract} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw mr-2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                ดึงข้อมูลจากสัญญา
              </Button>
            )}
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              บันทึก
            </Button>
            <Button variant="default" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href={`/admin/handover/${params.id}`}>
                <CheckCircle className="h-4 w-4 mr-2" />
                สรุปส่งมอบงาน
              </Link>
            </Button>
          </div>
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

          {project.milestones.map((milestone: any) => {
            const isPaid = milestone.paymentStatus === "paid"
            const isLocked = isPaid && !unlockedPayments[milestone.id]

            return (
              <Card key={milestone.id} className={isLocked ? "bg-slate-50/50" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      งวดที่ {milestone.phase}
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
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>รายละเอียดงาน</Label>
                      <Input
                        value={milestone.description}
                        disabled
                        className="bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>จำนวนเงิน (บาท)</Label>
                      <Input
                        type="number"
                        value={milestone.paymentAmount ?? 0}
                        disabled
                        className="bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="font-bold text-blue-800">รายการเช็คลิสต์ประจำงวด</Label>
                      <div className="space-y-2 border p-4 rounded-md bg-white shadow-sm">
                        {(milestone.checklist || []).length > 0 ? (
                          (milestone.checklist || []).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded transition-colors group">
                              <input
                                type="checkbox"
                                id={`task-${milestone.id}-${idx}`}
                                checked={item.completed}
                                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                onChange={(e) => {
                                  const newChecklist = [...(milestone.checklist || [])]
                                  newChecklist[idx] = { ...item, completed: e.target.checked }

                                  // Auto-calculate percentage
                                  const completedCount = newChecklist.filter((t: any) => t.completed).length
                                  const totalCount = newChecklist.length
                                  const newPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

                                  updateMilestone(milestone.id, {
                                    checklist: newChecklist,
                                    progressPercentage: newPercentage
                                  })
                                }}
                              />
                              <label
                                htmlFor={`task-${milestone.id}-${idx}`}
                                className={`text-sm cursor-pointer select-none flex-1 ${item.completed ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}
                              >
                                {item.task}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground italic text-center py-4">
                            ไม่มีรายการเช็คลิสต์สำหรับงวดนี้
                            <p className="text-[10px] mt-1">(หากต้องการเพิ่ม กรุณาแก้ไขที่งวดงานในใบสัญญา)</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>สถานะการชำระเงิน</Label>
                        <select
                          className="w-full h-10 px-3 rounded-md border bg-background disabled:opacity-70"
                          value={milestone.paymentStatus}
                          onChange={(e) => handleMilestoneUpdate(milestone.id, "paymentStatus", e.target.value)}
                          disabled={isLocked}
                        >
                          <option value="pending">รอชำระ</option>
                          <option value="paid">ชำระแล้ว</option>
                        </select>
                      </div>

                      <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold">ความคืบหน้างวดนี้</span>
                          <span className="text-lg font-bold text-primary">{milestone.progressPercentage}%</span>
                        </div>
                        <Progress value={milestone.progressPercentage} className="h-2" />
                        <p className="text-[10px] text-muted-foreground mt-2 italic">* เปอร์เซ็นต์คำนวณอัตโนมัติจากเช็คลิสต์ที่ทำเสร็จแล้ว</p>
                      </div>
                    </div>
                  </div>

                  {milestone.paymentStatus === "waiting_verification" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-blue-900 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            รอยืนยันการชำระเงิน
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            ลูกค้าแจ้งชำระผ่าน: <strong>{milestone.paymentMethod === "cash" ? "เงินสด" : "โอนผ่านธนาคาร"}</strong>
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            handleMilestoneUpdate(milestone.id, "paymentStatus", "paid");
                            handleMilestoneUpdate(milestone.id, "paidAt", new Date().toISOString());
                            handleMilestoneUpdate(milestone.id, "checkedAt", new Date().toISOString());
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          ยืนยันการชำระเงิน
                        </Button>
                      </div>

                      {milestone.paymentMethod === "transfer" && milestone.paymentSlip && (
                        <div className="space-y-2">
                          <Label className="text-blue-900">หลักฐานการโอนเงิน (สลิป)</Label>
                          <div className="relative aspect-[3/4] max-w-[200px] border rounded-md overflow-hidden bg-white">
                            <NextImage
                              src={milestone.paymentSlip}
                              alt="Payment Slip"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-blue-900">วันที่ลูกค้าแจ้งชำระ</Label>
                        <div className="p-2 bg-white rounded border border-blue-200 text-blue-900 font-medium">
                          {milestone.transferDate ? new Date(milestone.transferDate).toLocaleDateString("th-TH") : "-"}
                        </div>
                      </div>

                    </div>
                  )}

                  {(milestone.paymentStatus === "paid" || milestone.paymentStatus === "waiting_verification") && (
                    <div className="grid gap-4 md:grid-cols-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="space-y-2">
                        <Label>ช่องทางการชำระที่เลือก</Label>
                        <select
                          className="w-full h-10 px-3 rounded-md border bg-background disabled:opacity-70"
                          value={milestone.paymentMethod || ""}
                          onChange={(e) => handleMilestoneUpdate(milestone.id, "paymentMethod", e.target.value)}
                          disabled={isLocked}
                        >
                          <option value="">เลือกช่องทาง...</option>
                          <option value="cash">เงินสด</option>
                          <option value="transfer">โอนผ่านบัญชีธนาคาร</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>วันที่ลูกค้าชำระเงิน</Label>
                        <Input
                          type="date"
                          value={milestone.transferDate ? new Date(milestone.transferDate).toISOString().split('T')[0] : ""}
                          onChange={(e) => handleMilestoneUpdate(milestone.id, "transferDate", e.target.value)}
                          disabled={isLocked}
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>วันที่ตรวจสอบ</Label>
                        <Input
                          type="date"
                          value={milestone.checkedAt ? new Date(milestone.checkedAt).toISOString().split('T')[0] : ""}
                          onChange={(e) => handleMilestoneUpdate(milestone.id, "checkedAt", e.target.value)}
                          disabled={isLocked}
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {milestone.paymentMethod === "transfer" ? "รูปภาพสลิปเงินโอน" : "หลักฐานอื่นๆ (ถ้ามี)"}
                        </Label>
                        {isLocked ? (
                          milestone.paymentSlip ? (
                            <div className="relative aspect-[3/4] max-w-[150px] border rounded-md overflow-hidden bg-white">
                              <NextImage
                                src={milestone.paymentSlip}
                                alt="Payment Slip"
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">ไม่มีภาพหลักฐาน</p>
                          )
                        ) : (
                          <ImageUpload
                            value={milestone.paymentSlip ? [milestone.paymentSlip] : []}
                            onChange={(urls) => handleMilestoneUpdate(milestone.id, "paymentSlip", urls[urls.length - 1] || "")}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>รูปภาพหน้างาน</Label>
                    <ImageUpload
                      value={milestone.images}
                      onChange={(urls) => handleMilestoneUpdate(milestone.id, "images", urls)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>รายงานความคืบหน้างานก่อสร้าง</Label>
                    <Textarea
                      placeholder="อธิบายรายละเอียดงานที่ดำเนินการในงวดนี้..."
                      value={milestone.report || ""}
                      onChange={(e) => handleMilestoneUpdate(milestone.id, "report", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Progress value={milestone.progressPercentage} className="h-2" />

                  {isPaid && (
                    <div className="flex justify-end pt-2 border-t mt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={isLocked ? "text-blue-600 hover:text-blue-700" : "text-amber-600 hover:text-amber-700 font-bold bg-amber-50"}
                        onClick={() => setUnlockedPayments(prev => ({ ...prev, [milestone.id]: !prev[milestone.id] }))}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="h-3.5 w-3.5 mr-2" />
                            แก้ไขการชำระเงิน
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3.5 w-3.5 mr-2" />
                            ล็อกการชำระเงิน
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {/* + เพิ่มงวดงานใหม่ removed - must edit in contract */}
        </div>
      </div>
    </div >
  )
}
