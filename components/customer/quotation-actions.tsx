"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, Edit3 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export function QuotationActions({ quotationId }: { quotationId: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<"approve" | "reject" | "revision" | null>(null)
    const [revisionNote, setRevisionNote] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAction = async (action: "approve" | "reject" | "revision") => {
        if (action !== "revision" && !confirm(`คุณแน่ใจหรือไม่ที่จะ${action === "approve" ? "ตกลงว่าจ้าง" : "ไม่ตกลงว่าจ้าง"}สำหรับใบเสนอราคานี้?`)) return

        setIsLoading(action)
        try {
            const body: any = {
                status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "revision_requested"
            }
            if (action === "revision") {
                body.revisionNote = revisionNote
            }

            const res = await fetch(`/api/customer/quotations/${quotationId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                const data = await res.json()
                setIsDialogOpen(false)
                if (action === "approve" && data.contractId) {
                    router.push(`/customer/contracts/${data.contractId}`)
                } else {
                    router.refresh()
                }
            } else {
                alert("ทำรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ")
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleAction("reject")} disabled={isLoading !== null} className="border-red-500 text-red-500 hover:bg-red-50">
                {isLoading === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                ไม่ตกลงว่าจ้าง
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                        <Edit3 className="h-4 w-4 mr-2" />
                        ขอแก้ไข
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ขอแก้ไขรายละเอียดใบเสนอราคา</DialogTitle>
                        <DialogDescription>
                            กรุณาระบุรายละเอียดที่ต้องการให้แอดมินแก้ไข (เช่น เพิ่มพื้นที่, ปรับโรงจอดรถ, เปลี่ยนเกรดวัสดุ)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="ระบุรายละเอียดที่คุณต้องการแก้ไขที่นี่..."
                            value={revisionNote}
                            onChange={(e) => setRevisionNote(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>ยกเลิก</Button>
                        <Button
                            onClick={() => handleAction("revision")}
                            disabled={isLoading !== null || !revisionNote.trim()}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            {isLoading === "revision" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            ส่งคำขอแก้ไข
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Button onClick={() => handleAction("approve")} disabled={isLoading !== null} className="bg-green-600 hover:bg-green-700">
                {isLoading === "approve" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                )}
                ตกลงว่าจ้าง
            </Button>
        </div>
    )
}
