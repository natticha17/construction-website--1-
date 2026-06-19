"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Lock, Unlock } from "lucide-react"
import Image from "next/image"
import { NotifyPaymentButton } from "./notify-payment-button"

interface MilestonePaymentStatusProps {
    projectId: string
    milestone: {
        id: string
        phase: number
        description: string
        paymentAmount: number
        paymentStatus: string
        paymentMethod?: string
        paymentSlip?: string
        paidAt?: string
        updatedAt?: string
    }
}

export function MilestonePaymentStatus({ projectId, milestone }: MilestonePaymentStatusProps) {
    const isPaid = milestone.paymentStatus === "paid"
    const isWaiting = milestone.paymentStatus === "waiting_verification"
    const isLocked = isPaid || isWaiting

    return (
        <div className="flex justify-between items-center p-4 bg-muted rounded-lg w-full">
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">จำนวนเงินที่ต้องชำระเมื่อครบงวด</p>
                <p className="text-xl font-bold">{milestone.paymentAmount.toLocaleString()} บาท</p>

                {isPaid && (
                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        ชำระแล้วเมื่อ {milestone.paidAt && new Date(milestone.paidAt).toLocaleDateString("th-TH")}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-end gap-2 text-right">
                {isLocked ? (
                    <div className="flex flex-col items-end gap-1">
                        {isPaid ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                <p className="font-medium">ชำระแล้ว</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-blue-600">
                                <Clock className="h-5 w-5" />
                                <p className="font-medium">รอการตรวจสอบ</p>
                            </div>
                        )}

                        {milestone.paymentSlip && (
                            <div className="mt-2">
                                <p className="text-[10px] text-muted-foreground mb-1">หลักฐาน:</p>
                                <div className="relative aspect-[3/4] w-16 border rounded-md overflow-hidden bg-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
                                    <Image
                                        src={milestone.paymentSlip}
                                        alt="Payment Slip"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-end gap-2 w-full">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Clock className="h-5 w-5" />
                            <p className="font-medium">รอชำระ</p>
                        </div>

                        <NotifyPaymentButton
                            projectId={projectId}
                            milestoneId={milestone.id}
                            milestoneDescription={`งวดที่ ${milestone.phase}: ${milestone.description}`}
                            amount={milestone.paymentAmount}
                            initialMethod={milestone.paymentMethod as any}
                            initialSlip={milestone.paymentSlip}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
