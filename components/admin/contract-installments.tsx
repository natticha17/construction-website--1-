
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Sparkles, X } from "lucide-react"

export interface Installment {
    installmentNumber: number
    amount: number | string
    dueDate: string // text description or date string
    description: string
    tasks?: string[]
}


interface ContractInstallmentsProps {
    totalValue: number
    installments: Installment[]
    onChange: (installments: Installment[]) => void
    startDate?: string
    period?: string
    endDate?: string
}

export function ContractInstallments({ totalValue, installments, onChange, startDate, endDate, period }: ContractInstallmentsProps) {
    const [localInstallments, setLocalInstallments] = useState<Installment[]>(installments)

    useEffect(() => {
        setLocalInstallments(installments)
    }, [installments])

    const totalAllocated = localInstallments.reduce((sum, item) => {
        const val = typeof item.amount === 'string'
            ? Number((item.amount as string).replace(/,/g, ''))
            : Number(item.amount)
        return sum + (isNaN(val) ? 0 : val)
    }, 0)
    const remaining = totalValue - totalAllocated

    const addInstallment = () => {
        const newNumber = localInstallments.length + 1
        const newItem: Installment = {
            installmentNumber: newNumber,
            amount: "",
            dueDate: "",
            description: "",
            tasks: []
        }
        const updated = [...localInstallments, newItem]
        setLocalInstallments(updated)
        onChange(updated)
    }

    const loadStandardPlan = () => {
        if (totalValue <= 0) {
            alert("ไม่พบยอดเงินทำสัญญา กรุณาระบุมูลค่าสัญญาและบันทึกก่อน")
            return
        }

        const planConfig = [
            {
                pct: 10,
                name: "งวดที่ 1 (มัดจำ)",
                desc: "ชำระเงินล่วงหน้าเพื่อเริ่มดำเนินงานก่อสร้าง และจัดเตรียมวัสดุอุปกรณ์เบื้องต้น",
                tasks: [
                    "เตรียมพื้นที่และวางผังอาคาร",
                    "จัดซื้อและขนส่งวัสดุเบื้องต้น"
                ]
            },
            {
                pct: 20,
                name: "งวดที่ 2 (โครงสร้าง)",
                desc: "งานฐานราก, เสา, โครงหลังคา แล้วเสร็จ",
                tasks: [
                    "งานตอกเข็ม/ฐานราก",
                    "งานหล่อคานคอดิน",
                    "งานโครงสร้างพื้นชั้นล่าง",
                    "งานโครงสร้างเสาและคาน",
                    "งานติดตั้งโครงหลังคา"
                ]
            },
            {
                pct: 25,
                name: "งวดที่ 3 (สถาปัตย์ 1)",
                desc: "งานเทพื้น, มุงหลังคา, ก่อผนัง, ติดตั้งวงกบ แล้วเสร็จ",
                tasks: [
                    "งานมุงหลังคา",
                    "งานก่ออิฐผนัง",
                    "งานติดตั้งวงกบประตู-หน้าต่าง",
                    "งานเทพื้นคอนกรีตภายใน"
                ]
            },
            {
                pct: 25,
                name: "งวดที่ 4 (เทคนิค/ระบบ)",
                desc: "งานฉาบปูน, เดินท่อไฟฟ้า-ประปา, ฝ้าเพดาน แล้วเสร็จ",
                tasks: [
                    "งานฉาบปูนผนังภายในและภายนอก",
                    "งานเดินท่อประปาและสุขาภิบาล",
                    "งานเดินท่อร้อยสายไฟ",
                    "งานติดตั้งฝ้าเพดานภายในและภายนอก"
                ]
            },
            {
                pct: 15,
                name: "งวดที่ 5 (สถาปัตย์ 2)",
                desc: "งานทาสี, ปูพื้น, ติดตั้งสุขภัณฑ์, ติดตั้งโคมไฟ สวิตช์ ปลั๊ก, เก็บรายละเอียดงาน แล้วเสร็จ",
                tasks: [
                    "งานปูวัสดุพื้นและผนัง",
                    "งานทาสีรองพื้นและสีจริง",
                    "งานติดตั้งสุขภัณฑ์และอุปกรณ์ห้องน้ำ",
                    "งานติดตั้งดวงโคม สวิตช์ และปลั๊กไฟ",
                    "งานติดตั้งบานประตู-หน้าต่าง",
                    "งานเก็บรายละเอียด"
                ]
            },
            {
                pct: 5,
                name: "งวดที่ 6 (ส่งมอบงาน)",
                desc: "ประกันผลงาน (ชำระหลังส่งมอบงาน)",
                tasks: [
                    "ตรวจสอบความเรียบร้อยของงานทั้งหมด",
                    "ทดสอบระบบน้ำและไฟฟ้า",
                    "ทำความสะอาดพื้นที่ก่อสร้าง",
                    "ส่งมอบบ้านและเอกสารรับประกัน"
                ]
            }
        ]

        let allocated = 0
        const start = startDate ? new Date(startDate) : new Date()

        // Initialize total duration
        let totalDurationMs = 180 * 24 * 60 * 60 * 1000 // Default 180 days

        if (endDate) {
            const end = new Date(endDate)
            if (!isNaN(end.getTime())) {
                totalDurationMs = end.getTime() - start.getTime()
            }
        } else if (period) {
            // Fallback
            const daysMatch = period.match(/(\d+)\s*วัน/)
            const monthsMatch = period.match(/(\d+)\s*เดือน/)

            if (daysMatch) {
                totalDurationMs = parseInt(daysMatch[1]) * 24 * 60 * 60 * 1000
            } else if (monthsMatch) {
                totalDurationMs = parseInt(monthsMatch[1]) * 30 * 24 * 60 * 60 * 1000
            }
        }

        const newInstallments: Installment[] = planConfig.map((step, index) => {
            const amount = Math.floor(totalValue * (step.pct / 100))
            allocated += amount

            // Calculate due date based on progress percentage
            // 1. Deposit: Day 0
            // 2. Structure: ~25% progress
            // 3. Arch 1: ~50% progress
            // 4. Systems: ~75% progress
            // 5. Arch 2: ~90% progress
            // 6. Handover: 100% progress

            let progressPct = 0
            switch (index) {
                case 0: progressPct = 0; break;
                case 1: progressPct = 0.20; break;
                case 2: progressPct = 0.45; break;
                case 3: progressPct = 0.70; break;
                case 4: progressPct = 0.90; break;
                case 5: progressPct = 1.0; break;
            }

            const daysToAdd = Math.floor((totalDurationMs * progressPct) / (24 * 60 * 60 * 1000))
            const date = new Date(start)
            date.setDate(date.getDate() + daysToAdd)

            const dateStr = date.toISOString().split('T')[0] // yyyy-mm-dd

            return {
                installmentNumber: index + 1,
                amount: amount.toLocaleString(),
                dueDate: dateStr,
                description: step.desc,
                tasks: step.tasks
            }
        })

        // Adjust rounding error to the 5th installment (Index 4)
        const diff = totalValue - allocated
        if (diff !== 0) {
            const targetIdx = 4
            const val = newInstallments[targetIdx].amount
            const oldVal = typeof val === 'string'
                ? Number(val.replace(/,/g, ''))
                : Number(val)
            newInstallments[targetIdx].amount = (oldVal + diff).toLocaleString()
        }

        setLocalInstallments(newInstallments)
        onChange(newInstallments)
    }

    const removeInstallment = (index: number) => {
        const updated = localInstallments.filter((_, i) => i !== index).map((item, i) => ({
            ...item,
            installmentNumber: i + 1 // Re-index
        }))
        setLocalInstallments(updated)
        onChange(updated)
    }

    const updateInstallment = (index: number, field: keyof Installment, value: any) => {
        const updated = [...localInstallments]
        updated[index] = {
            ...updated[index],
            [field]: value
        }
        setLocalInstallments(updated)
        onChange(updated)
    }

    const addTask = (index: number) => {
        const updated = [...localInstallments]
        const tasks = updated[index].tasks || []
        updated[index] = {
            ...updated[index],
            tasks: [...tasks, ""]
        }
        setLocalInstallments(updated)
        onChange(updated)
    }

    const updateTask = (instIndex: number, taskIndex: number, value: string) => {
        const updated = [...localInstallments]
        const tasks = [...(updated[instIndex].tasks || [])]
        tasks[taskIndex] = value
        updated[instIndex] = {
            ...updated[instIndex],
            tasks
        }
        setLocalInstallments(updated)
        onChange(updated)
    }

    const removeTask = (instIndex: number, taskIndex: number) => {
        const updated = [...localInstallments]
        const tasks = (updated[instIndex].tasks || []).filter((_, i) => i !== taskIndex)
        updated[instIndex] = {
            ...updated[instIndex],
            tasks
        }
        setLocalInstallments(updated)
        onChange(updated)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold">ตารางงวดงานและการชำระเงิน</Label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200"
                        onClick={loadStandardPlan}
                    >
                        <Sparkles className="w-3 h-3 mr-2" />
                        โหลดแผนมาตรฐาน (6 งวด)
                    </Button>
                </div>
                <div className="text-sm text-right">
                    <div className={remaining === 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                        เหลือยอดจัดสรร: {remaining.toLocaleString()} บาท
                    </div>
                    <div className="text-muted-foreground text-xs italic">
                        ยอดรวมสัญญา: {totalValue.toLocaleString()} | จัดสรรแล้ว: {totalAllocated.toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden border-slate-300 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-300">
                        <tr>
                            <th className="p-3 text-left w-[60px]">งวด</th>
                            <th className="p-3 text-left w-[180px]">จำนวนเงิน</th>
                            <th className="p-3 text-left w-[80px]">ร้อยละ</th>
                            <th className="p-3 text-left w-[300px]">รายละเอียดงานหลัก</th>
                            <th className="p-3 text-left">รายการงานย่อย (Checklist)</th>
                            <th className="p-3 text-left w-[150px]">กำหนดชำระ</th>
                            <th className="p-3 w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {localInstallments.map((inst, index) => {
                            const amount = typeof inst.amount === 'string'
                                ? Number((inst.amount as string).replace(/,/g, ''))
                                : Number(inst.amount)
                            const percentage = totalValue > 0 ? (amount / totalValue) * 100 : 0

                            return (
                                <tr key={index} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                                    <td className="p-3 text-center align-top">
                                        <div className="font-bold text-blue-800 text-lg">
                                            {inst.installmentNumber}
                                        </div>
                                    </td>
                                    <td className="p-3 align-top">
                                        <Input
                                            type="text"
                                            value={inst.amount}
                                            onChange={(e) => updateInstallment(index, "amount", e.target.value)}
                                            className="h-9 font-mono"
                                            placeholder="เช่น 1,000,000"
                                        />
                                        <div className="text-[10px] text-muted-foreground mt-1 text-center">
                                            {percentage.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                        </div>
                                    </td>
                                    <td className="p-1 align-top font-mono text-xs text-blue-600 font-bold hidden md:table-cell">
                                        {/* Simplified view or just hide this column if merged above */}
                                    </td>
                                    <td className="p-3 align-top">
                                        <Textarea
                                            value={inst.description}
                                            onChange={(e) => updateInstallment(index, "description", e.target.value)}
                                            rows={2}
                                            className="min-h-[60px] resize-none text-xs"
                                            placeholder="รายละเอียดงานหลัก..."
                                        />
                                    </td>
                                    <td className="p-3 align-top">
                                        <div className="space-y-2">
                                            {(inst.tasks || []).map((task, tIdx) => (
                                                <div key={tIdx} className="flex gap-1 items-center">
                                                    <Input
                                                        value={task}
                                                        onChange={(e) => updateTask(index, tIdx, e.target.value)}
                                                        placeholder={`งานที่ ${tIdx + 1}`}
                                                        className="h-7 text-[10px] py-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-slate-400 hover:text-red-500"
                                                        onClick={() => removeTask(index, tIdx)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-6 text-[10px] w-full border-dashed"
                                                onClick={() => addTask(index)}
                                            >
                                                <Plus className="h-3 w-3 mr-1" /> เพิ่มงานย่อย
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="p-3 align-top">
                                        <Input
                                            type="date"
                                            value={inst.dueDate}
                                            onChange={(e) => updateInstallment(index, "dueDate", e.target.value)}
                                            className="h-9 text-xs"
                                        />
                                    </td>
                                    <td className="p-3 text-center align-top">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => removeInstallment(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {localInstallments.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                        ยังไม่มีข้อมูลกรุณาเพิ่มงวดงาน
                    </div>
                )}
            </div>

            <Button type="button" variant="outline" onClick={addInstallment} className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" /> เพิ่มงวดงาน
            </Button>
        </div>
    )
}
