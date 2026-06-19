
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useReactToPrint } from "react-to-print"
import { Loader2, ArrowLeft, CheckCircle, Printer, AlertTriangle } from "lucide-react"
import type { ProjectProgress, Contract } from "@/lib/types"
import { HandoverDocument } from "@/components/admin/handover-document"

export default function HandoverPage() {
    const router = useRouter()
    const params = useParams()
    const [project, setProject] = useState<ProjectProgress | null>(null)
    const [contract, setContract] = useState<Contract | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCompleting, setIsCompleting] = useState(false)
    const [validationError, setValidationError] = useState<string | null>(null)

    const componentRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Handover-${contract?.contractNumber || 'Document'}`,
    })

    useEffect(() => {
        fetch(`/api/admin/progress/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                setProject(data.progress)
                setContract(data.contract)
                setIsLoading(false)
            })
    }, [params.id])

    const validateProject = () => {
        if (!project) return false
        const allCompleted = project.milestones.every((m) => m.progressPercentage === 100)
        const allPaid = project.milestones.every((m) => m.paymentStatus === "paid")

        if (!allCompleted) {
            setValidationError("มีงวดงานที่ยังไม่สมบูรณ์ (ต้องครบ 100% ทุกงวด)")
            return false
        }
        if (!allPaid) {
            setValidationError("มีงวดงานที่ยังไม่ได้ชำระเงิน (ต้องชำระครบทุกงวด)")
            return false
        }
        setValidationError(null)
        return true
    }

    const handleCompleteProject = async () => {
        if (!validateProject() || !project || !contract) return
        if (!confirm("คุณแน่ใจหรือไม่ที่จะปิดโครงการนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้")) return

        console.log("HandoverPage: Completing project for contract.id:", contract.id)

        setIsCompleting(true)
        try {
            // We need a server action or API route for this. 
            // Since we added logic to store, we should expose it via API.
            // Let's assume we add a specialized endpoint or use the progress update endpoint with a special flag?
            // Better: Create a new API route /api/admin/contracts/[id]/complete

            // For now, let's use the existing contract update route if we strictly follow REST, 
            // but the store logic `completeProject` is specific.
            // I will implement a specific server action or API route next. 
            // Let's assume /api/admin/contracts/[id]/complete exists for now.
            const res = await fetch(`/api/admin/contracts/${contract.id}/complete`, {
                method: 'POST'
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to complete project")

            alert("ปิดโครงการเรียบร้อยแล้ว!")
            router.refresh()
            // Reload local state to reflect changes
            setContract({ ...contract, status: "completed" })
        } catch (error: any) {
            console.error("Error completing project:", error)
            alert(error.message)
        } finally {
            setIsCompleting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <AdminHeader title="สรุปส่งมอบงาน" description="กำลังโหลด..." />
                <div className="flex-1 p-8 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    if (!project || !contract) return null

    const isReadyToComplete = project.milestones.every(m => m.progressPercentage === 100 && m.paymentStatus === "paid")
    const isCompleted = contract.status === "completed"

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            <AdminHeader title="สรุปส่งมอบงาน" description={`โครงการ: ${project.projectName}`} />

            <div className="flex-1 p-8 space-y-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={`/admin/progress/${project.id}`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            กลับไปหน้าความคืบหน้า
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>สถานะความพร้อมส่งมอบ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white border rounded">
                                <span className="font-medium">ความคืบหน้างานก่อสร้าง</span>
                                <div className="flex items-center gap-2">
                                    <span className={project.overallProgress === 100 ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                                        {project.overallProgress}%
                                    </span>
                                    {project.overallProgress === 100 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white border rounded">
                                <span className="font-medium">การชำระเงิน</span>
                                <div className="flex items-center gap-2">
                                    {isReadyToComplete ? (
                                        <>
                                            <span className="text-green-600 font-bold">ครบถ้วน</span>
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-red-600 font-bold">ยังไม่ครบ</span>
                                            <AlertTriangle className="h-5 w-5 text-red-500" />
                                        </>
                                    )}
                                </div>
                            </div>

                            {!isCompleted && !isReadyToComplete && (
                                <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                                    <p className="font-bold flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> ไม่สามารถส่งมอบงานได้</p>
                                    <ul className="list-disc list-inside mt-1 ml-1">
                                        {project.milestones.some(m => m.progressPercentage < 100) && <li>มีงวดงานที่ยังไม่เสร็จสิ้น 100%</li>}
                                        {project.milestones.some(m => m.paymentStatus !== "paid") && <li>มีงวดงานที่ยังไม่ได้ชำระเงิน</li>}
                                    </ul>
                                </div>
                            )}

                            {isCompleted ? (
                                <div className="p-4 bg-green-50 border border-green-200 rounded text-center text-green-800">
                                    <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                                    <h3 className="font-bold text-lg">โครงการนี้ส่งมอบเรียบร้อยแล้ว</h3>
                                    <p>Closed at: {new Date(contract.endDate || Date.now()).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                <Button
                                    className="w-full mt-4"
                                    size="lg"
                                    disabled={!isReadyToComplete || isCompleting}
                                    onClick={handleCompleteProject}
                                >
                                    {isCompleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                    ยืนยันการปิดโครงการ (Complete Project)
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle>เอกสารส่งมอบงาน</CardTitle>
                            <CardDescription>ตรวจสอบและพิมพ์ใบส่งมอบงานสำหรับลูกค้า</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col space-y-4">
                            <div className="flex-1 border bg-slate-200/50 p-4 rounded-lg overflow-auto max-h-[600px] flex justify-center">
                                <div className="shadow-2xl scale-[0.6] origin-top mb-[-240px]">
                                    <HandoverDocument contract={contract} />
                                </div>
                            </div>
                            <Button className="w-full" variant="outline" onClick={handlePrint}>
                                <Printer className="h-4 w-4 mr-2" />
                                พิมพ์ใบส่งมอบงาน
                            </Button>
                        </CardContent>
                    </Card>

                </div>

                {/* Hidden Printable Component */}
                <div style={{ display: "none" }}>
                    <div ref={componentRef}>
                        {contract && <HandoverDocument contract={contract} />}
                    </div>
                </div>
            </div>
        </div>
    )
}
