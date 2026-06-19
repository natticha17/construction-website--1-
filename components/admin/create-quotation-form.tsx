"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Trash2, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { generateBOQ } from "@/lib/boq-calculator"
import { Sparkles, Calculator } from "lucide-react"

interface User {
    id: string
    name: string
    email: string
}

interface HousePlan {
    id: string
    name: string
    area: string
    price: string
}

interface CreateQuotationFormProps {
    users: User[]
    housePlans: HousePlan[]
}

interface QuotationItem {
    id: string
    materialName: string
    quantity: number | string
    unit: string
    pricePerUnit: number | string
    totalPrice: number
}

export function CreateQuotationForm({ users, housePlans }: CreateQuotationFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState<QuotationItem[]>([])

    // Form states
    const [customerId, setCustomerId] = useState("")
    const [housePlanId, setHousePlanId] = useState("")
    const [housePlanName, setHousePlanName] = useState("")
    const [area, setArea] = useState<number | string>("")
    const [budget, setBudget] = useState("")
    const [additionalRequirements, setAdditionalRequirements] = useState("")

    // Costs
    const [laborCost, setLaborCost] = useState<number | string>(0)
    const [operationCost, setOperationCost] = useState<number | string>(0)
    // Subtotal is sum of items
    // Grand total is Subtotal + Labor + Operation + Tax

    // Auto-fill house plan details
    const handleHousePlanChange = (planId: string) => {
        setHousePlanId(planId)
        const plan = housePlans.find(p => p.id === planId)
        if (plan) {
            setHousePlanName(plan.name)
            // Extract number from string (e.g. "150 sq.m" -> 150)
            const areaMatch = plan.area.match(/[\d.]+/)
            setArea(areaMatch ? parseFloat(areaMatch[0]) : 0)
            setBudget(plan.price)
        }
    }

    // Item management
    const addItem = () => {
        const newItem: QuotationItem = {
            id: Date.now().toString(),
            materialName: "",
            quantity: 1,
            unit: "ชิ้น",
            pricePerUnit: 0,
            totalPrice: 0
        }
        setItems([...items, newItem])
    }

    const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                // If value is empty string, keep it as empty string
                // If value is number string, keep it as string for input
                const updatedItem = { ...item, [field]: value }

                if (field === "quantity" || field === "pricePerUnit") {
                    const qty = field === "quantity" ? Number(value) : Number(item.quantity)
                    const price = field === "pricePerUnit" ? Number(value) : Number(item.pricePerUnit)
                    updatedItem.totalPrice = (isNaN(qty) ? 0 : qty) * (isNaN(price) ? 0 : price)
                }
                return updatedItem
            }
            return item
        }))
    }

    // BOQ States
    const [storyType, setStoryType] = useState<"1" | "1.5" | "2">("1")

    // Calculations
    const handleCalculateBOQ = () => {
        const areaNum = Number(area)
        if (!areaNum || areaNum <= 0) {
            alert("กรุณาระบุพื้นที่ใช้สอยให้ถูกต้อง")
            return
        }

        if (confirm("การคำนวณใหม่จะล้างรายการเดิมทั้งหมด คุณต้องการดำเนินการต่อหรือไม่?")) {
            const newItems = generateBOQ({
                area: areaNum,
                storyType
            })
            setItems(newItems)

            // Calculate Material Subtotal directly from new items
            const materialSubtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0)

            // Target Total: Area * 12,000
            const targetTotal = areaNum * 12000
            const targetPreTax = targetTotal / 1.07

            // Set Operation Cost ~ 10-15% of Material
            const opCostVal = Math.round(materialSubtotal * 0.10)
            setOperationCost(opCostVal.toString())

            // Set Labor Cost = TargetPreTax - Material - Operation
            // This ensures Grand Total matches exactly Area * 12,000
            const laborCostVal = Math.round(targetPreTax - materialSubtotal - opCostVal)
            setLaborCost(laborCostVal > 0 ? laborCostVal.toString() : "0")

            // Auto-set budget to Area * 12000 as requested
            setBudget(targetTotal.toLocaleString())
        }
    }

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const tax = Math.round((subtotal + Number(laborCost) + Number(operationCost)) * 0.07)
    const grandTotal = subtotal + Number(laborCost) + Number(operationCost) + tax

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const selectedUser = users.find(u => u.id === customerId)

            const payload = {
                customerId,
                customerName: selectedUser?.name || "",
                housePlanId,
                housePlanName,
                area: Number(area),
                budget,
                additionalRequirements,
                items: items.map(item => ({
                    ...item,
                    quantity: Number(item.quantity),
                    pricePerUnit: Number(item.pricePerUnit)
                })),
                subtotal,
                laborCost: Number(laborCost),
                operationCost: Number(operationCost),
                tax,
                grandTotal,
            }

            const res = await fetch("/api/admin/quotations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to create quotation")

            router.push("/admin/quotations")
            router.refresh()
        } catch (error) {
            console.error("Error creating quotation:", error)
            alert("เกิดข้อผิดพลาดในการสร้างใบเสนอราคา")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href="/admin/quotations">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        กลับ
                    </Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2" />
                    บันทึกใบเสนอราคา
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>ข้อมูลลูกค้าและโครงการ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>ลูกค้า</Label>
                            <Select value={customerId} onValueChange={setCustomerId} required>
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

                        <div className="space-y-2">
                            <Label>แบบบ้าน</Label>
                            <Select value={housePlanId} onValueChange={handleHousePlanChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกแบบบ้าน" />
                                </SelectTrigger>
                                <SelectContent>
                                    {housePlans.map(plan => (
                                        <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ชื่อแบบบ้าน (แสดงในใบเสนอราคา)</Label>
                                <Input value={housePlanName} onChange={e => setHousePlanName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>พื้นที่ใช้สอย (ตร.ม.)</Label>
                                <Input type="number" value={area} onChange={e => setArea(e.target.value)} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ประเภทบ้าน (ชั้น)</Label>
                                <Select value={storyType} onValueChange={(v: "1" | "1.5" | "2") => setStoryType(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 ชั้น</SelectItem>
                                        <SelectItem value="1.5">1.5 ชั้น</SelectItem>
                                        <SelectItem value="2">2 ชั้น</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 flex items-end">
                                <Button
                                    type="button"
                                    onClick={handleCalculateBOQ}
                                    variant="outline"
                                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                                >
                                    <Calculator className="w-4 h-4 mr-2" />
                                    คำนวณ BOQ (สูตร 12,000/ตร.ม.)
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>งบประมาณ (บาท)</Label>
                                <Input value={budget} onChange={e => setBudget(e.target.value)} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>ความต้องการเพิ่มเติม</Label>
                            <Textarea
                                value={additionalRequirements}
                                onChange={e => setAdditionalRequirements(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>สรุปราคา</CardTitle>
                        <CardDescription>คำนวณราคาอัตโนมัติจากรายการวัสดุ</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">รวมค่าวัสดุ</span>
                                <span className="font-medium">{subtotal.toLocaleString()} บาท</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>ค่าแรง</Label>
                                    <Input
                                        type="number"
                                        className="w-32 text-right"
                                        value={laborCost}
                                        onChange={e => setLaborCost(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>ค่าดำเนินการ</Label>
                                    <Input
                                        type="number"
                                        className="w-32 text-right"
                                        value={operationCost}
                                        onChange={e => setOperationCost(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-muted-foreground">ภาษี (7%)</span>
                                <span>{tax.toLocaleString()} บาท</span>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t text-lg font-bold">
                                <span>ยอดรวมทั้งหมด</span>
                                <span className="text-primary">{grandTotal.toLocaleString()} บาท</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>รายการวัสดุ</CardTitle>
                    <Button type="button" onClick={addItem} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        เพิ่มรายการ
                    </Button>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            ยังไม่มีรายการวัสดุ
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">รายการ</TableHead>
                                    <TableHead className="text-right">จำนวน</TableHead>
                                    <TableHead className="text-right w-[100px]">หน่วย</TableHead>
                                    <TableHead className="text-right">ราคา/หน่วย</TableHead>
                                    <TableHead className="text-right">รวม</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Input
                                                value={item.materialName}
                                                onChange={e => updateItem(item.id, "materialName", e.target.value)}
                                                placeholder="ชื่อวัสดุ"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Input
                                                type="number"
                                                className="text-right"
                                                value={item.quantity}
                                                onChange={e => updateItem(item.id, "quantity", e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Input
                                                className="text-right"
                                                value={item.unit}
                                                onChange={e => updateItem(item.id, "unit", e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Input
                                                type="number"
                                                className="text-right"
                                                value={item.pricePerUnit}
                                                onChange={e => updateItem(item.id, "pricePerUnit", e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right font-medium align-middle">
                                            {item.totalPrice.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </form>
    )
}
