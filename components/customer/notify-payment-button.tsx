"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageUpload } from "@/components/image-upload"
import { Loader2, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface NotifyPaymentButtonProps {
    projectId: string
    milestoneId: string
    milestoneDescription: string
    amount: number
    initialMethod?: "cash" | "transfer"
    initialSlip?: string
    buttonText?: string
    buttonVariant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
}

export function NotifyPaymentButton({
    projectId,
    milestoneId,
    milestoneDescription,
    amount,
    initialMethod,
    initialSlip,
    buttonText = "แจ้งชำระเงิน",
    buttonVariant = "outline",
}: NotifyPaymentButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer">(initialMethod || "transfer")
    const [paymentSlip, setPaymentSlip] = useState(initialSlip || "")
    const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0])
    const router = useRouter()

    const handleSubmit = async () => {
        if (paymentMethod === "transfer" && !paymentSlip) {
            alert("กรุณาแนบสลิปโอนเงินเพื่อเป็นหลักฐาน")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/customer/progress/${projectId}/notify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    milestoneId,
                    paymentMethod,
                    paymentSlip: paymentMethod === "transfer" ? paymentSlip : undefined,
                    transferDate,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to notify payment")
            }

            setIsOpen(false)
            router.refresh()
        } catch (error: any) {
            console.error("Error notifying payment:", error)
            alert(`เกิดข้อผิดพลาด: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} size="sm" className="w-full mt-2">
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>แจ้งชำระเงิน</DialogTitle>
                    <DialogDescription>
                        แจ้งรายละเอียดการชำระเงินสำหรับ: {milestoneDescription}
                        <br />
                        จำนวนเงิน: <span className="font-bold text-primary">{amount.toLocaleString()} บาท</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-3">
                        <Label>วิธีการชำระเงิน</Label>
                        <RadioGroup
                            value={paymentMethod}
                            onValueChange={(val: "cash" | "transfer") => setPaymentMethod(val)}
                            className="flex flex-col space-y-2"
                        >
                            <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <RadioGroupItem value="transfer" id="transfer" />
                                <Label htmlFor="transfer" className="flex-1 cursor-pointer">โอนผ่านบัญชีธนาคาร</Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <RadioGroupItem value="cash" id="cash" />
                                <Label htmlFor="cash" className="flex-1 cursor-pointer">ชำระด้วยเงินสด</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Date picker for both methods */}
                    <div className="space-y-3">
                        <Label>วันที่ชำระเงิน *</Label>
                        <input
                            type="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={transferDate}
                            onChange={(e) => setTransferDate(e.target.value)}
                            required
                        />
                    </div>

                    {paymentMethod === "transfer" && (
                        <div className="space-y-3">
                            <Label>แนบรูปภาพสลิปเงินโอน *</Label>
                            <ImageUpload
                                value={paymentSlip ? [paymentSlip] : []}
                                onChange={(urls) => setPaymentSlip(urls[urls.length - 1] || "")}
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        ยืนยันการแจ้งชำระเงิน
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
