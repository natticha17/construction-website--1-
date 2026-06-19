"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { Contract } from "@/lib/types"
import { ContractInstallments, type Installment } from "./contract-installments"
import { DEFAULT_CONTRACT_SETTINGS } from "@/lib/constants"

interface User {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    houseNo?: string
    village?: string
    road?: string
    subDistrict?: string
    district?: string
    province?: string
}

interface EditContractFormProps {
    contract: Contract
    users: User[]
}

export function EditContractForm({ contract, users }: EditContractFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [formData, setFormData] = useState({
        contractNumber: contract.contractNumber || "",
        customerId: contract.customerId || "",
        customerAddress: contract.customerAddress || "",
        customerPhone: contract.customerPhone || "",
        projectName: contract.projectName || "",
        projectDetails: contract.projectDetails || "",
        projectLocation: contract.projectLocation || "",
        contractValue: contract.contractValue?.toString() || "",
        constructionPeriod: contract.constructionPeriod || "",
        startDate: contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : "",
        endDate: contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : "",
        contractorName: contract.contractorName || "นายอาคม เจริญผล",
        warrantyDetails: contract.warrantyDetails || "",
        finePolicy: contract.finePolicy || "",
        amendmentPolicy: contract.amendmentPolicy || "",
        contractSignedDate: contract.contractSignedDate ? new Date(contract.contractSignedDate).toISOString().split('T')[0] : "",
        status: contract.status,
    })

    const initialAddress = { houseNo: "", village: "", road: "", subDistrict: "", district: "", province: "" }
    const [customerAddr, setCustomerAddr] = useState({ ...initialAddress, ...(contract.customerAddressStructured || {}) })
    const [projectAddr, setProjectAddr] = useState({ ...initialAddress, ...(contract.projectLocationStructured || {}) })
    const [contractorAddr, setContractorAddr] = useState({
        ...DEFAULT_CONTRACT_SETTINGS.contractor.addressStructured,
        ...(contract.contractorAddressStructured || {})
    })
    const updateFullAddress = (parts: typeof initialAddress) => {
        const villageText = parts.village ? `หมู่บ้าน ${parts.village} ` : ""
        const roadText = parts.road ? `ถนน ${parts.road} ` : ""
        return `บ้านเลขที่ ${parts.houseNo} ${villageText}${roadText}ต.${parts.subDistrict} อ.${parts.district} จ.${parts.province}`
    }

    const [installments, setInstallments] = useState<Installment[]>(contract.installments || [])

    // Auto-sync start date with signed date
    useEffect(() => {
        if (formData.contractSignedDate) {
            setFormData(prev => ({ ...prev, startDate: prev.contractSignedDate }))
        }
    }, [formData.contractSignedDate])

    // Auto-calculate end date based on start date and period
    useEffect(() => {
        if (!formData.startDate || !formData.constructionPeriod) return

        const calculateEndDate = () => {
            try {
                const start = new Date(formData.startDate)
                if (isNaN(start.getTime())) return

                const periodStr = formData.constructionPeriod.trim()

                // Extract number and unit
                const match = periodStr.match(/^(\d+)\s*(.*)$/)
                if (!match) return

                const value = parseInt(match[1])
                const unit = match[2]

                const end = new Date(start)
                if (unit.includes('วัน')) {
                    end.setDate(end.getDate() + value)
                } else {
                    // Default to months if unit is "เดือน" or empty or anything else
                    end.setMonth(end.getMonth() + value)
                }

                setFormData(prev => ({ ...prev, endDate: end.toISOString().split('T')[0] }))
            } catch (err) {
                console.error("Failed to calculate end date:", err)
            }
        }

        calculateEndDate()
    }, [formData.startDate, formData.constructionPeriod])

    // Update contract value automatically when installments change
    const handleInstallmentsChange = (newInstallments: Installment[]) => {
        setInstallments(newInstallments)
        const total = newInstallments.reduce((sum, inst) => {
            const val = typeof inst.amount === 'string'
                ? Number(inst.amount.replace(/,/g, ''))
                : inst.amount
            return sum + (isNaN(val) ? 0 : val)
        }, 0)
        setFormData(prev => ({ ...prev, contractValue: total.toLocaleString() }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const selectedUser = users.find(u => u.id === formData.customerId)

            const payload = {
                ...formData,
                customerName: selectedUser?.name || contract.customerName,
                customerAddress: updateFullAddress(customerAddr),
                customerAddressStructured: customerAddr,
                projectLocation: updateFullAddress(projectAddr),
                projectLocationStructured: projectAddr,
                contractorAddress: updateFullAddress(contractorAddr),
                contractorAddressStructured: contractorAddr,
                contractValue: typeof formData.contractValue === 'string' ? Number(formData.contractValue.replace(/,/g, '')) : formData.contractValue,
                installments: installments.map(inst => ({
                    ...inst,
                    amount: typeof inst.amount === 'string' ? Number(inst.amount.replace(/,/g, '')) : inst.amount
                })),
            }

            const res = await fetch(`/api/admin/contracts/${contract.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to update contract")

            router.push("/admin/contracts")
            router.refresh()
        } catch (error) {
            console.error("Error updating contract:", error)
            alert("เกิดข้อผิดพลาดในการแก้ไขสัญญา")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("คุณต้องการลบสัญญานี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้")) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/contracts/${contract.id}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Failed to delete contract")

            router.push("/admin/contracts")
            router.refresh()
        } catch (error) {
            console.error("Error deleting contract:", error)
            alert("เกิดข้อผิดพลาดในการลบสัญญา")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href="/admin/contracts">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        กลับ
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isLoading}>
                        {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Trash2 className="h-4 w-4 mr-2" />
                        ลบสัญญา
                    </Button>
                    <Button type="submit" disabled={isLoading || isDeleting}>
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Save className="h-4 w-4 mr-2" />
                        บันทึกการแก้ไข
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {/* 1. ข้อมูลคู่สัญญา */}
                <Card>
                    <CardHeader>
                        <CardTitle>1. ข้อมูลคู่สัญญา</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 border rounded-md bg-blue-50/50 border-blue-100">
                            <Label className="font-bold text-blue-800 mb-2 block">เลขที่สัญญา (Contract Number)</Label>
                            <Input
                                value={formData.contractNumber}
                                onChange={e => setFormData({ ...formData, contractNumber: e.target.value })}
                                placeholder="เช่น CN256702-001"
                                className="font-mono font-bold text-lg bg-white border-blue-200 focus:border-blue-500"
                            />
                            <p className="text-[10px] text-blue-600 mt-1 italic">เลขที่สัญญาสำหรับอ้างอิงในเอกสาร</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-muted-foreground">ผู้ว่าจ้าง (ลูกค้า)</h3>
                                <div className="space-y-2">
                                    <Label>ชื่อลูกค้า *</Label>
                                    <Select
                                        value={formData.customerId}
                                        onValueChange={(val) => {
                                            setFormData({ ...formData, customerId: val })
                                            // Auto-populate address and phone
                                            const selectedUser = users.find(u => u.id === val)
                                            if (selectedUser) {
                                                const hasStructured = selectedUser.houseNo || selectedUser.subDistrict || selectedUser.district

                                                if (hasStructured) {
                                                    setCustomerAddr({
                                                        houseNo: selectedUser.houseNo || "",
                                                        village: selectedUser.village || "",
                                                        road: selectedUser.road || "",
                                                        subDistrict: selectedUser.subDistrict || "",
                                                        district: selectedUser.district || "",
                                                        province: selectedUser.province || ""
                                                    })
                                                }

                                                setFormData(prev => ({
                                                    ...prev,
                                                    customerId: val,
                                                    customerPhone: selectedUser.phone || prev.customerPhone,
                                                    customerAddress: hasStructured ? prev.customerAddress : (selectedUser.address || prev.customerAddress || "")
                                                }))
                                            }
                                        }}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="เลือกลูกค้า" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                                    <Label className="font-bold underline">ที่อยู่ตามสัญญา (ที่อยู่บ้าน)</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>บ้านเลขที่/หมู่</Label>
                                            <Input value={customerAddr.houseNo} onChange={e => setCustomerAddr({ ...customerAddr, houseNo: e.target.value })} placeholder="เช่น 123/45 หมู่ 6" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>หมู่บ้าน</Label>
                                            <Input value={customerAddr.village} onChange={e => setCustomerAddr({ ...customerAddr, village: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ถนน/ซอย</Label>
                                            <Input value={customerAddr.road} onChange={e => setCustomerAddr({ ...customerAddr, road: e.target.value })} placeholder="เช่น ถ.วิภาวดีรังสิต" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>ตำบล/แขวง</Label>
                                            <Input value={customerAddr.subDistrict} onChange={e => setCustomerAddr({ ...customerAddr, subDistrict: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>อำเภอ/เขต</Label>
                                            <Input value={customerAddr.district} onChange={e => setCustomerAddr({ ...customerAddr, district: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>จังหวัด</Label>
                                            <Input value={customerAddr.province} onChange={e => setCustomerAddr({ ...customerAddr, province: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>เบอร์โทรศัพท์</Label>
                                    <Input
                                        value={formData.customerPhone}
                                        onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-muted-foreground">ผู้รับจ้าง</h3>
                                <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                                    <Label className="font-bold underline">ที่อยู่ผู้รับจ้าง</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>บ้านเลขที่/หมู่</Label>
                                            <Input
                                                value={contractorAddr.houseNo}
                                                onChange={e => setContractorAddr({ ...contractorAddr, houseNo: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>หมู่บ้าน</Label>
                                            <Input
                                                value={contractorAddr.village}
                                                onChange={e => setContractorAddr({ ...contractorAddr, village: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ถนน</Label>
                                            <Input
                                                value={contractorAddr.road}
                                                onChange={e => setContractorAddr({ ...contractorAddr, road: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>ตำบล/แขวง</Label>
                                            <Input
                                                value={contractorAddr.subDistrict}
                                                onChange={e => setContractorAddr({ ...contractorAddr, subDistrict: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>อำเภอ/เขต</Label>
                                            <Input
                                                value={contractorAddr.district}
                                                onChange={e => setContractorAddr({ ...contractorAddr, district: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>จังหวัด</Label>
                                            <Input
                                                value={contractorAddr.province}
                                                onChange={e => setContractorAddr({ ...contractorAddr, province: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. รายละเอียดโครงการ */}
                <Card>
                    <CardHeader>
                        <CardTitle>2. รายละเอียดโครงการ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ชื่อโครงการ *</Label>
                                <Input
                                    value={formData.projectName}
                                    onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                                    placeholder="เช่น ก่อสร้างบ้านพักอาศัย 2 ชั้น"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>มูลค่าสัญญา (บาท) *</Label>
                                <Input
                                    type="text"
                                    value={formData.contractValue}
                                    onChange={e => setFormData({ ...formData, contractValue: e.target.value })}
                                    placeholder="เช่น 1,000,000"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                            <Label className="font-bold underline">สถานที่ก่อสร้าง (ที่อยู่ก่อสร้าง)</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>บ้านเลขที่/หมู่ *</Label>
                                    <Input value={projectAddr.houseNo} onChange={e => setProjectAddr({ ...projectAddr, houseNo: e.target.value })} placeholder="ระบุบ้านเลขที่ก่อสร้าง" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>หมู่บ้าน</Label>
                                    <Input value={projectAddr.village} onChange={e => setProjectAddr({ ...projectAddr, village: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>ถนน/ซอย</Label>
                                    <Input value={projectAddr.road} onChange={e => setProjectAddr({ ...projectAddr, road: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>ตำบล/แขวง *</Label>
                                    <Input value={projectAddr.subDistrict} onChange={e => setProjectAddr({ ...projectAddr, subDistrict: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>อำเภอ/เขต *</Label>
                                    <Input value={projectAddr.district} onChange={e => setProjectAddr({ ...projectAddr, district: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>จังหวัด *</Label>
                                    <Input value={projectAddr.province} onChange={e => setProjectAddr({ ...projectAddr, province: e.target.value })} required />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>รายละเอียดงานโดยย่อ</Label>
                            <Textarea
                                value={formData.projectDetails}
                                onChange={e => setFormData({ ...formData, projectDetails: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>ระยะเวลาก่อสร้าง</Label>
                                <Input
                                    value={formData.constructionPeriod}
                                    onChange={e => setFormData({ ...formData, constructionPeriod: e.target.value })}
                                    placeholder="เช่น 12 เดือน"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>วันที่ทำสัญญา (หัวกระดาษ)</Label>
                                <Input
                                    type="date"
                                    value={formData.contractSignedDate}
                                    onChange={e => setFormData({ ...formData, contractSignedDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>วันเริ่มสัญญา</Label>
                                <Input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>วันสิ้นสุดสัญญา</Label>
                                <Input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. งวดงาน */}
                <Card>
                    <CardContent className="pt-6">
                        <ContractInstallments
                            totalValue={Number(formData.contractValue.replace(/,/g, '')) || 0}
                            installments={installments}
                            onChange={handleInstallmentsChange}
                            startDate={formData.startDate}
                        />
                    </CardContent>
                </Card>

                {/* 4. เงื่อนไขสัญญา */}
                <Card>
                    <CardHeader>
                        <CardTitle>4. เงื่อนไขสัญญา</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>การรับประกันผลงาน</Label>
                            <Textarea
                                value={formData.warrantyDetails}
                                onChange={e => setFormData({ ...formData, warrantyDetails: e.target.value })}
                                placeholder="เช่น โครงสร้าง 5 ปี, สถาปัตยกรรม 1 ปี..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>เงื่อนไขการปรับ (กรณีล่าช้า)</Label>
                            <Textarea
                                value={formData.finePolicy}
                                onChange={e => setFormData({ ...formData, finePolicy: e.target.value })}
                                placeholder="เช่น ปรับวันละ 0.01% ของมูลค่าสัญญา..."
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>การแก้ไขเปลี่ยนแปลงแบบ</Label>
                            <Textarea
                                value={formData.amendmentPolicy}
                                onChange={e => setFormData({ ...formData, amendmentPolicy: e.target.value })}
                                placeholder="เงื่อนไขการคิดค่าใช้จ่ายเพิ่มลด..."
                                rows={2}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <Label>สถานะสัญญา</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกสถานะ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">รอยืนยัน</SelectItem>
                                    <SelectItem value="accepted">ยอมรับแล้ว</SelectItem>
                                    <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}
