"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { ContractInstallments, type Installment } from "./contract-installments"
import { DEFAULT_CONTRACT_SETTINGS } from "@/lib/constants"
import { Quotation } from "@/lib/types"

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

export function CreateContractForm({ users, initialQuotation }: { users: User[], initialQuotation?: Quotation | null }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        contractNumber: "",
        customerId: "",
        customerAddress: "",
        customerPhone: "",
        projectName: "",
        projectDetails: "",
        projectLocation: "",
        contractValue: "",
        constructionPeriod: "",
        startDate: "",
        endDate: "",
        contractorName: DEFAULT_CONTRACT_SETTINGS.contractor.name,
        warrantyDetails: DEFAULT_CONTRACT_SETTINGS.warrantyDetails,
        finePolicy: DEFAULT_CONTRACT_SETTINGS.finePolicy,
        contractSignedDate: "",
        amendmentPolicy: DEFAULT_CONTRACT_SETTINGS.amendmentPolicy,
        // Hidden fields for data persistence
        quotationId: initialQuotation?.id || "",
        housePlanName: initialQuotation?.housePlanName || "",
        houseImage: initialQuotation?.houseImage || "",
        floorPlanImages: initialQuotation?.floorPlanImages || [] as string[],
        items: initialQuotation?.items || [] as any[]
    })

    const initialAddress = { houseNo: "", village: "", road: "", subDistrict: "", district: "", province: "" }
    const [customerAddr, setCustomerAddr] = useState(initialAddress)
    const [projectAddr, setProjectAddr] = useState(initialAddress)
    const [contractorAddr, setContractorAddr] = useState(DEFAULT_CONTRACT_SETTINGS.contractor.addressStructured)

    const updateFullAddress = (parts: typeof initialAddress) => {
        const villageText = parts.village ? `หมู่บ้าน ${parts.village} ` : ""
        const roadText = parts.road ? `ถนน ${parts.road} ` : ""
        return `บ้านเลขที่ ${parts.houseNo} ${villageText}${roadText}ต.${parts.subDistrict} อ.${parts.district} จ.${parts.province}`
    }

    const [installments, setInstallments] = useState<Installment[]>([])

    // Fetch next sequential contract number on load
    useEffect(() => {
        const fetchNextNumber = async () => {
            try {
                const res = await fetch('/api/admin/contracts/next-number')
                const data = await res.json()
                if (data.nextNumber) {
                    setFormData(prev => ({ ...prev, contractNumber: data.nextNumber }))
                }
            } catch (err) {
                console.error("Failed to fetch next contract number:", err)
            }
        }
        fetchNextNumber()
    }, [])

    // Auto-fill from initialQuotation
    useEffect(() => {
        if (initialQuotation) {
            const selectedUser = users.find(u => u.id === initialQuotation.customerId)

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

                // Update basic form data
                setFormData(prev => ({
                    ...prev,
                    customerId: initialQuotation.customerId,
                    customerPhone: selectedUser.phone || prev.customerPhone,
                    customerAddress: hasStructured ? prev.customerAddress : (selectedUser.address || prev.customerAddress || ""),

                    // Contract specific
                    contractValue: initialQuotation.grandTotal.toLocaleString(),
                    projectName: `ก่อสร้างบ้านพักอาศัย ${initialQuotation.housePlanName}`,
                    projectDetails: `แบบบ้าน: ${initialQuotation.housePlanName}\nพื้นที่ใช้สอย: ${initialQuotation.area} ตร.ม.\nอ้างอิงใบเสนอราคาเลขที่: ${initialQuotation.quotationNumber || initialQuotation.id}`,

                    // Persist quotation details
                    quotationId: initialQuotation.id,
                    housePlanName: initialQuotation.housePlanName || "",
                    houseImage: initialQuotation.houseImage || "",
                    floorPlanImages: initialQuotation.floorPlanImages || [],
                    items: initialQuotation.items || []
                }))
            }
        }
    }, [initialQuotation, users])

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

        // Removed auto-update of contractValue. 
        // We want contractValue to be the "Target" (e.g. from Quotation), 
        // and installments to be the breakdown. 
        // If we auto-update, we can't have a target value different from the current sum, 
        // which breaks the "Remaining" calculation logic and wipes the auto-filled value on first edit.

        /* 
        const total = newInstallments.reduce((sum, inst) => {
            const val = typeof inst.amount === 'string'
                ? Number(inst.amount.replace(/,/g, ''))
                : inst.amount
            return sum + (isNaN(val) ? 0 : val)
        }, 0)
        
        if (newInstallments.length > 0) {
             setFormData(prev => ({ ...prev, contractValue: total.toLocaleString() }))
        } 
        */
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const selectedUser = users.find(u => u.id === formData.customerId)

            const payload = {
                ...formData,
                customerName: selectedUser?.name || "",
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
                status: "pending"
            }

            const res = await fetch("/api/admin/contracts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to create contract")

            router.push("/admin/contracts")
            router.refresh()
        } catch (error) {
            console.error("Error creating contract:", error)
            alert("เกิดข้อผิดพลาดในการสร้างสัญญา")
        } finally {
            setIsLoading(false)
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
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2" />
                    บันทึกสัญญา
                </Button>
            </div>

            <div className="grid gap-6">
                {/* ข้อมูลคู่สัญญา */}
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
                            <p className="text-[10px] text-blue-600 mt-1 italic">ระบบสร้างให้อัตโนมัติ คุณสามารถแก้ไขได้หากต้องการ</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-muted-foreground">ผู้ว่าจ้าง</h3>
                                <div className="space-y-2">
                                    <Label>ชื่อผู้ว่าจ้าง *</Label>
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
                                                } else if (selectedUser.address) {
                                                    // Fallback for legacy address string: put it in houseNo for visibility
                                                    // and let updateFullAddress handle it if possible, 
                                                    // but better to just set the whole thing as a hint
                                                    setFormData(prev => ({ ...prev, customerAddress: selectedUser.address || "" }))
                                                }

                                                setFormData(prev => ({
                                                    ...prev,
                                                    customerId: val,
                                                    customerPhone: selectedUser.phone || prev.customerPhone,
                                                    customerAddress: hasStructured ? prev.customerAddress : (selectedUser.address || prev.customerAddress || ""),
                                                    // Note: We might want to clear housePlanName/quotationId if manually changing customer, 
                                                    // but for now we keep it if it came from initialQuotation
                                                }))
                                            } else {
                                                setFormData({ ...formData, customerId: val })
                                            }
                                        }}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="เลือกจากระบบ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
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
                                            <Input value={customerAddr.village} onChange={e => setCustomerAddr({ ...customerAddr, village: e.target.value })} placeholder="เช่น หมู่บ้านตัวอย่าง" />
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
                                    <Label>เบอร์โทรศัพท์(ผู้ว่าจ้าง)</Label>
                                    <Input
                                        value={formData.customerPhone}
                                        onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-muted-foreground">ผู้รับจ้าง</h3>
                                <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                                    <Label className="font-bold underline">ที่อยู่ผู้รับจ้าง (อัตโนมัติ)</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>บ้านเลขที่/หมู่</Label>
                                            <Input
                                                value={contractorAddr.houseNo}
                                                onChange={e => setContractorAddr({ ...contractorAddr, houseNo: e.target.value })}
                                                suppressHydrationWarning
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>หมู่บ้าน</Label>
                                            <Input
                                                value={contractorAddr.village}
                                                onChange={e => setContractorAddr({ ...contractorAddr, village: e.target.value })}
                                                suppressHydrationWarning
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ถนน</Label>
                                            <Input
                                                value={contractorAddr.road}
                                                onChange={e => setContractorAddr({ ...contractorAddr, road: e.target.value })}
                                                suppressHydrationWarning
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>ตำบล/แขวง</Label>
                                            <Input
                                                value={contractorAddr.subDistrict}
                                                onChange={e => setContractorAddr({ ...contractorAddr, subDistrict: e.target.value })}
                                                suppressHydrationWarning
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>อำเภอ/เขต</Label>
                                            <Input
                                                value={contractorAddr.district}
                                                onChange={e => setContractorAddr({ ...contractorAddr, district: e.target.value })}
                                                suppressHydrationWarning
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>จังหวัด</Label>
                                            <Input
                                                value={contractorAddr.province}
                                                onChange={e => setContractorAddr({ ...contractorAddr, province: e.target.value })}
                                                suppressHydrationWarning
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ชื่อผู้รับจ้าง</Label>
                                        <Input
                                            value={formData.contractorName}
                                            onChange={e => setFormData({ ...formData, contractorName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* รายละเอียดโครงการ */}
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
                                    <Input value={projectAddr.houseNo} onChange={e => setProjectAddr({ ...projectAddr, houseNo: e.target.value })} placeholder="เช่น 123/45" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>หมู่บ้าน</Label>
                                    <Input value={projectAddr.village} onChange={e => setProjectAddr({ ...projectAddr, village: e.target.value })} placeholder="เช่น หมู่บ้านตัวอย่าง" />
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

                {/* งวดงาน */}
                <Card>
                    <CardContent className="pt-6">
                        <ContractInstallments
                            totalValue={Number(formData.contractValue.replace(/[^0-9.]/g, '')) || 0}
                            installments={installments}
                            onChange={handleInstallmentsChange}
                            startDate={formData.startDate}
                            period={formData.constructionPeriod}
                        />
                    </CardContent>
                </Card>

                {/* เงื่อนไขสัญญา */}
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
            </div>
        </form >
    )
}
