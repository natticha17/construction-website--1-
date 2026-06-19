"use client"

import { useState, useEffect, Fragment } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Trash2, ArrowLeft, Save, FileSignature } from "lucide-react"
import Link from "next/link"
import type { User, HousePlan, Quotation } from "@/lib/types"

interface QuotationFormProps {
    users: User[]
    housePlans: HousePlan[]
    initialData?: Quotation
    contract?: any // Using any for simplicity or you can use Contract from @/lib/types
    mode?: "create" | "edit"
}

interface QuotationItem {
    id: string
    category?: string
    materialName: string
    quantity: number | string
    unit: string
    materialPrice: number | string
    laborPrice: number | string
    pricePerUnit: number | string
    totalPrice: number
}

// Define room stats type
interface RoomStats {
    bedrooms: number
    bathrooms: number
    kitchens: number
    livingRooms: number
    parking: number
}

// Category type for grouping
type MaterialCategory = "งานเตรียมการ/ฐานราก" | "โครงสร้างหลัก" | "โครงสร้างหลังคา" | "งานสถาปัตย์/ตกแต่ง" | "งานระบบ" | "ประตู-หน้าต่าง" | "งานภายนอก"

interface StandardMaterialDef {
    name: string
    category: MaterialCategory
    unit: string
    materialPrice: number
    laborPrice: number
    qtyFormula: (area: number, storyType: string, rooms: RoomStats) => number
}

const getStandardMaterials = (): StandardMaterialDef[] => [
    // 0. งานเตรียมการ/ฐานราก
    { name: "ปรับหน้าดิน", category: "งานเตรียมการ/ฐานราก", unit: "ตร.ม.", materialPrice: 0, laborPrice: 80, qtyFormula: (area) => area * 1.0 },
    // Piling & Foundation
    {
        name: "เสาเข็ม (Micropile)",
        category: "งานเตรียมการ/ฐานราก",
        unit: "ต้น",
        materialPrice: 3500,
        laborPrice: 500,
        qtyFormula: (area, story, rooms) => {
            const is2 = story === "2";
            const is15 = story === "1.5";
            const footprint = is2 ? area / 2 : is15 ? area / 1.5 : area;
            const pileSpacing = is2 ? 10 : is15 ? 15 : 20;
            return Math.ceil(footprint / pileSpacing) + Math.ceil(rooms.parking / 15);
        }
    },
    {
        name: "ฐานรากคอนกรีต",
        category: "งานเตรียมการ/ฐานราก",
        unit: "ฐาน",
        materialPrice: 2000,
        laborPrice: 1000,
        qtyFormula: (area, story) => {
            const is2 = story === "2";
            const is15 = story === "1.5";
            const footprint = is2 ? area / 2 : is15 ? area / 1.5 : area;
            const spacing = is2 ? 8 : is15 ? 12 : 15;
            return Math.ceil(footprint / spacing);
        }
    },

    // 1. หมวดวัสดุหลัก
    {
        name: "คอนกรีตผสมเสร็จ",
        category: "โครงสร้างหลัก",
        unit: "คิว",
        materialPrice: 1850,
        laborPrice: 250,
        qtyFormula: (area, story) => {
            const factor = story === "2" ? 0.18 : story === "1.5" ? 0.14 : 0.10;
            return area * factor;
        }
    },
    {
        name: "เหล็กเส้น DB16",
        category: "โครงสร้างหลัก",
        unit: "กก.",
        materialPrice: 22,
        laborPrice: 3,
        qtyFormula: (area, story) => {
            const factor = story === "2" ? 70 : story === "1.5" ? 49 : 28;
            return area * factor;
        }
    },
    { name: "เหล็กเส้นวายเมท", category: "โครงสร้างหลัก", unit: "ตร.ม.", materialPrice: 15, laborPrice: 5, qtyFormula: (area, story) => story === "2" ? area * 0.5 : story === "1.5" ? area * 0.7 : area * 0.9 },
    { name: "อิฐมวลเบา (60x120)", category: "โครงสร้างหลัก", unit: "ก้อน", materialPrice: 22, laborPrice: 5, qtyFormula: (area, story) => area * (story === "2" ? 8 : story === "1.5" ? 7.5 : 7) },

    // Roof
    {
        name: "กระเบื้องหลังคาซีแพค",
        category: "โครงสร้างหลัก",
        unit: "แผ่น",
        materialPrice: 12,
        laborPrice: 3,
        qtyFormula: (area, story) => {
            let roofArea = area * 1.3;
            if (story === "2") roofArea = (area / 2) * 1.4;
            else if (story === "1.5") roofArea = area * 1.4;
            return roofArea * 11;
        }
    },

    // งานสถาปัตย์ (Finishing)
    { name: "กระเบื้องพื้น (60x60)", category: "งานสถาปัตย์/ตกแต่ง", unit: "ตร.ม.", materialPrice: 300, laborPrice: 150, qtyFormula: (area) => area * 0.7 },
    { name: "พื้นลามิเนต (ห้องนอน)", category: "งานสถาปัตย์/ตกแต่ง", unit: "ตร.ม.", materialPrice: 450, laborPrice: 200, qtyFormula: (area) => area * 0.3 },
    { name: "กระเบื้องบุผนัง (ห้องน้ำ/ครัว)", category: "งานสถาปัตย์/ตกแต่ง", unit: "ตร.ม.", materialPrice: 300, laborPrice: 150, qtyFormula: (area, story, rooms) => (rooms.bathrooms * 22) + (rooms.kitchens * 12) },
    { name: "ฝ้าเพดาน (แผ่นซิปซัม)", category: "โครงสร้างหลัก", unit: "ตร.ม.", materialPrice: 250, laborPrice: 100, qtyFormula: (area, story) => area * (story === "2" ? 1.9 : story === "1.5" ? 1.45 : 1.0) },
    { name: "สีทาภายใน/ภายนอก", category: "งานสถาปัตย์/ตกแต่ง", unit: "ตร.ม.", materialPrice: 50, laborPrice: 30, qtyFormula: (area, story) => area * (story === "2" ? 4.25 : story === "1.5" ? 3.75 : 3.25) },

    // 2. หมวดโครงสร้าง / หลังคา
    { name: "โครงหลังคาเหล็ก", category: "โครงสร้างหลังคา", unit: "กก.", materialPrice: 28, laborPrice: 7, qtyFormula: (area, story) => (story === "2" ? area / 2 : story === "1.5" ? area / 1.2 : area) * 25 },
    { name: "ฉนวนกันร้อน", category: "โครงสร้างหลังคา", unit: "ตร.ม.", materialPrice: 120, laborPrice: 30, qtyFormula: (area, story) => (story === "2" ? area / 2 : story === "1.5" ? area / 1.2 : area) },
    { name: "รางน้ำฝน", category: "โครงสร้างหลังคา", unit: "เมตร", materialPrice: 300, laborPrice: 100, qtyFormula: (area, story) => Math.sqrt(story === "2" ? area / 2 : story === "1.5" ? area / 1.2 : area) * 4 },

    // งานพิเศษ
    { name: "โครงสร้างบันได+ราว (สำหรับ 2 ชั้น)", category: "งานสถาปัตย์/ตกแต่ง", unit: "ชุด", materialPrice: 40000, laborPrice: 15000, qtyFormula: (area, story) => story === "2" ? 1 : story === "1.5" ? 0.7 : 0 },
    { name: "เคาน์เตอร์ครัวปูน (บิ้วอิน)", category: "งานสถาปัตย์/ตกแต่ง", unit: "เมตร", materialPrice: 3000, laborPrice: 1500, qtyFormula: (area, story, rooms) => rooms.kitchens * 3 },

    // 3. หมวดงานระบบ
    {
        name: "จุดไฟ/ปลั๊ก/สวิตช์",
        category: "งานระบบ",
        unit: "จุด",
        materialPrice: 500,
        laborPrice: 300,
        qtyFormula: (area, story, rooms) => (rooms.bedrooms * 5) + (rooms.bathrooms * 3) + (rooms.kitchens * 6) + (rooms.livingRooms * 8) + (rooms.parking * 2) + Math.ceil(area / 20)
    },
    {
        name: "เดินท่อประปา",
        category: "งานระบบ",
        unit: "จุด",
        materialPrice: 800,
        laborPrice: 400,
        qtyFormula: (area, story, rooms) => (rooms.bathrooms * 6) + (rooms.kitchens * 3) + (rooms.parking * 1)
    },
    { name: "สุขภัณฑ์", category: "งานระบบ", unit: "ชุด", materialPrice: 8500, laborPrice: 1500, qtyFormula: (area, story, rooms) => rooms.bathrooms },
    { name: "ปั๊มน้ำ", category: "งานระบบ", unit: "เครื่อง", materialPrice: 5500, laborPrice: 500, qtyFormula: () => 1 },
    // 4. หมวดประตู – หน้าต่าง
    { name: "ประตูบานหลัก", category: "ประตู-หน้าต่าง", unit: "ชุด", materialPrice: 13500, laborPrice: 1500, qtyFormula: () => 1 },
    { name: "ประตูภายใน", category: "ประตู-หน้าต่าง", unit: "ชุด", materialPrice: 2500, laborPrice: 500, qtyFormula: (area, story, rooms) => rooms.bedrooms },
    { name: "ประตูห้องน้ำ", category: "ประตู-หน้าต่าง", unit: "ชุด", materialPrice: 2000, laborPrice: 500, qtyFormula: (area, story, rooms) => rooms.bathrooms },
    { name: "หน้าต่างอลูมิเนียม", category: "ประตู-หน้าต่าง", unit: "ชุด", materialPrice: 3000, laborPrice: 500, qtyFormula: (area, story, rooms) => (rooms.bedrooms * 2) + (rooms.livingRooms * 2) + rooms.kitchens },

    // 5. หมวดงานภายนอก
    { name: "พื้นโรงรถ", category: "งานภายนอก", unit: "ตร.ม.", materialPrice: 450, laborPrice: 150, qtyFormula: (area, story, rooms) => rooms.parking * 15 },
    { name: "ทางเดินรอบบ้าน", category: "งานภายนอก", unit: "ตร.ม.", materialPrice: 350, laborPrice: 150, qtyFormula: (area) => area * 0.1 },
    { name: "รั้วบ้าน", category: "งานภายนอก", unit: "เมตร", materialPrice: 1800, laborPrice: 700, qtyFormula: (area) => Math.sqrt(area) * 4 },
]

const getAdjustedMaterials = (style: string): StandardMaterialDef[] => {
    const baseMaterials = getStandardMaterials();
    if (style !== "Contemporary") return baseMaterials;

    return baseMaterials.map(item => {
        // Apply 30% increase for specific categories as requested
        const premiumItems = ["โครงหลังคาเหล็ก", "กระเบื้องหลังคาซีแพค", "ฝ้าเพดาน (แผ่นซิปซัม)", "รางน้ำฝน"];
        if (premiumItems.includes(item.name)) {
            return {
                ...item,
                materialPrice: Math.round(item.materialPrice * 1.3)
            };
        }
        return item;
    });
};

export function QuotationForm({ users, housePlans, initialData, contract, mode = "create" }: QuotationFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    // ... rest of the component
    const [items, setItems] = useState<QuotationItem[]>(
        initialData?.items.map(item => ({ ...item, id: item.id || Date.now().toString() + Math.random() })) || []
    )

    // Form states
    const [customerId, setCustomerId] = useState(initialData?.customerId || "")
    const [housePlanId, setHousePlanId] = useState(initialData?.housePlanId || "")
    const [housePlanName, setHousePlanName] = useState(initialData?.housePlanName || "")
    const [houseImage, setHouseImage] = useState(initialData?.houseImage || "")
    const [floorPlanImages, setFloorPlanImages] = useState<string[]>(initialData?.floorPlanImages || [])
    const [houseStyle, setHouseStyle] = useState<string>(() => {
        if (initialData?.housePlanId) {
            const plan = housePlans.find(p => p.id === initialData.housePlanId)
            return plan?.style || "Modern"
        }
        return "Modern"
    })
    const [area, setArea] = useState<number | string>(initialData?.area || "")
    const [storyType, setStoryType] = useState<string>(() => {
        if (initialData?.housePlanId) {
            const plan = housePlans.find(p => p.id === initialData.housePlanId)
            if (plan) {
                if (plan.name.includes("1.5 ชั้น") || plan.type?.includes("1.5 ชั้น")) return "1.5"
                if (plan.name.includes("2 ชั้น") || plan.name.includes("2 Story") || plan.type?.includes("2 ชั้น")) return "2"
            }
        }
        return "1"
    })
    const [roomStats, setRoomStats] = useState<RoomStats>(() => {
        if (initialData?.housePlanId) {
            const plan = housePlans.find(p => p.id === initialData.housePlanId)
            if (plan) {
                return {
                    bedrooms: plan.bedrooms || 0,
                    bathrooms: plan.bathrooms || 0,
                    kitchens: plan.kitchens || 0,
                    livingRooms: plan.livingRooms || 0,
                    parking: plan.parking || 0
                }
            }
        }
        return {
            bedrooms: 0,
            bathrooms: 0,
            kitchens: 0,
            livingRooms: 0,
            parking: 0
        }
    })
    const [budget, setBudget] = useState(initialData?.budget || "")
    const [additionalRequirements, setAdditionalRequirements] = useState(initialData?.additionalRequirements || "")
    const [quotationNumber, setQuotationNumber] = useState(initialData?.quotationNumber || "")
    const [notes, setNotes] = useState(() => {
        const defaultNotes = "ราคาประเมินเบื้องต้นอาจมีการเปลี่ยนแปลงตามปริมาณงานจริง รายละเอียดหน้างาน และวัสดุที่ลูกค้าเลือกใช้ ทั้งนี้จะแจ้งให้ทราบก่อนดำเนินการทุกครั้ง"
        const placeholderNotes = "เจ้าหน้าที่กำลังประเมินราคาตามรายละเอียดที่คุณต้องการ"

        if (initialData?.notes === placeholderNotes) return defaultNotes
        return initialData?.notes || defaultNotes
    })
    const [conditions, setConditions] = useState(() => {
        const defaultConditions = "1. ราคานี้รวมค่าดำเนินการและค่าแรงเรียบร้อยแล้ว\n2. ใบเสนอราคานี้มีอายุ 30 วัน นับจากวันที่เสนอราคา\n3. กำหนดการทำงานและระยะเวลาดำเนินการจะยืนยันอีกครั้งหลังได้รับการอนุมัติใบเสนอราคา"
        const placeholderConditions = "ใบเสนอราคาตัวจริงจะออกให้หลังจากเจ้าหน้าที่ตรวจสอบรายละเอียดครบถ้วน"

        if (initialData?.conditions === placeholderConditions) return defaultConditions
        return initialData?.conditions || defaultConditions
    })

    // Sync house plan details when housePlanId changes (especially for edit mode initial load)
    useEffect(() => {
        if (housePlanId) {
            const plan = housePlans.find(p => p.id === housePlanId)
            if (plan) {
                setRoomStats({
                    bedrooms: plan.bedrooms || 0,
                    bathrooms: plan.bathrooms || 0,
                    kitchens: plan.kitchens || 0,
                    livingRooms: plan.livingRooms || 0,
                    parking: plan.parking || 0
                })

                let sType = "1"
                if (plan.name.includes("1.5 ชั้น") || plan.type?.includes("1.5 ชั้น")) sType = "1.5"
                else if (plan.name.includes("2 ชั้น") || plan.name.includes("2 Story") || plan.type?.includes("2 ชั้น")) sType = "2"
                setStoryType(sType)
                setHouseStyle(plan.style)
            }
        }
    }, [housePlanId, housePlans])

    // Costs
    const [laborCost, setLaborCost] = useState<number>(Number(initialData?.laborCost) || 0)
    const [operationCost, setOperationCost] = useState<number>(Number(initialData?.operationCost) || 0)

    useEffect(() => {
        // BOQ: Calculate Total Material and Total Labor from items
        const currentTotalMaterial = items.reduce((sum, item) => {
            const qty = Number(item.quantity) || 0
            const mPrice = Number(item.materialPrice) || 0
            return sum + (qty * mPrice)
        }, 0)

        const currentTotalLabor = items.reduce((sum, item) => {
            const qty = Number(item.quantity) || 0
            const lPrice = Number(item.laborPrice) || 0
            return sum + (qty * lPrice)
        }, 0)

        setLaborCost(currentTotalLabor)

        // Operation Cost 5% of subtotal
        const currentSubtotal = currentTotalMaterial + currentTotalLabor
        const operationPercentage = 0.05
        const calculatedOperation = Math.round(currentSubtotal * operationPercentage)
        setOperationCost(calculatedOperation)

    }, [items])

    // Fetch next quotation number for new quotations
    useEffect(() => {
        if (mode === "create" && !initialData) {
            fetch("/api/admin/quotations/next-number")
                .then(res => res.json())
                .then(data => {
                    if (data.nextNumber) {
                        setQuotationNumber(data.nextNumber)
                    }
                })
                .catch(err => console.error("Error fetching next quotation number:", err))
        }
    }, [mode, initialData])

    // Auto-fill house plan details
    const handleHousePlanChange = (planId: string) => {
        setHousePlanId(planId)
        const plan = housePlans.find(p => p.id === planId)
        if (plan) {
            setHousePlanName(plan.name)
            setHouseImage(plan.image)
            setFloorPlanImages(plan.floorPlanImages || [])
            setHouseStyle(plan.style) // Track style for pricing
            // Extract number from string (e.g. "150 sq.m" -> 150)
            const areaMatch = plan.area.match(/[\d.]+/)
            setArea(areaMatch ? parseFloat(areaMatch[0]) : 0)
            // Auto-fill budget with 15% buffer (as requested)
            const basePrice = plan.price
            const bufferedPrice = Math.round(basePrice * 1.15)
            setBudget(bufferedPrice.toString())

            // Set rooms
            setRoomStats({
                bedrooms: plan.bedrooms || 0,
                bathrooms: plan.bathrooms || 0,
                kitchens: plan.kitchens || 0,
                livingRooms: plan.livingRooms || 0,
                parking: plan.parking || 0
            })

            // Auto-detect story type
            let sType = "1"
            if (plan.name.includes("1.5 ชั้น") || plan.type?.includes("1.5 ชั้น")) sType = "1.5"
            else if (plan.name.includes("2 ชั้น") || plan.name.includes("2 Story") || plan.type?.includes("2 ชั้น")) sType = "2"
            setStoryType(sType)
        }
    }

    // Item management
    const addItem = () => {
        const newItem: QuotationItem = {
            id: Date.now().toString(),
            category: "อื่นๆ",
            materialName: "",
            quantity: 1,
            unit: "ชิ้น",
            materialPrice: 0,
            laborPrice: 0,
            pricePerUnit: 0,
            totalPrice: 0
        }
        setItems([...items, newItem])
    }

    const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value }

                // Recalculate totalPrice
                const qty = field === "quantity" ? Number(value) : Number(item.quantity)
                const mPrice = field === "materialPrice" ? Number(value) : Number(item.materialPrice)
                const lPrice = field === "laborPrice" ? Number(value) : Number(item.laborPrice)

                const validQty = isNaN(qty) ? 0 : qty
                const validMPrice = isNaN(mPrice) ? 0 : mPrice
                const validLPrice = isNaN(lPrice) ? 0 : lPrice

                updatedItem.pricePerUnit = validMPrice + validLPrice
                updatedItem.totalPrice = validQty * (validMPrice + validLPrice)

                return updatedItem
            }
            return item
        }))
    }

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    const calculateStandardMaterials = () => {
        const currentArea = Number(area)
        if (!currentArea || currentArea <= 0) {
            alert("กรุณาระบุพื้นที่ใช้สอยก่อนคำนวณ")
            return
        }

        const newItems = [...items]
        const materials = getAdjustedMaterials(houseStyle)

        materials.forEach(stdItem => {
            const quantity = Math.ceil(stdItem.qtyFormula(currentArea, storyType, roomStats))

            // Skip items with 0 quantity
            if (quantity <= 0) return

            const existingIndex = newItems.findIndex(item => item.materialName === stdItem.name)
            const unitPrice = stdItem.materialPrice + stdItem.laborPrice
            const totalPrice = quantity * unitPrice

            if (existingIndex >= 0) {
                // Update existing
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    category: stdItem.category,
                    quantity: quantity,
                    materialPrice: stdItem.materialPrice,
                    laborPrice: stdItem.laborPrice,
                    pricePerUnit: unitPrice,
                    totalPrice: totalPrice
                }
            } else {
                // Add new
                newItems.push({
                    id: Date.now().toString() + Math.random(),
                    category: stdItem.category,
                    materialName: stdItem.name,
                    quantity: quantity,
                    unit: stdItem.unit,
                    materialPrice: stdItem.materialPrice,
                    laborPrice: stdItem.laborPrice,
                    pricePerUnit: unitPrice,
                    totalPrice: totalPrice
                })
            }
        })

        setItems(newItems)
    }

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const grandTotal = subtotal + Number(laborCost) + Number(operationCost)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const selectedUser = users.find(u => u.id === customerId)

            const payload = {
                customerId,
                customerName: selectedUser?.name || initialData?.customerName || "",
                housePlanId,
                housePlanName,
                houseImage,
                floorPlanImages,
                area: Number(area),
                budget,
                additionalRequirements,
                items: items.map(item => ({
                    ...item,
                    category: item.category || "อื่นๆ",
                    quantity: Number(item.quantity),
                    materialPrice: Number(item.materialPrice),
                    laborPrice: Number(item.laborPrice),
                    pricePerUnit: Number(item.materialPrice) + Number(item.laborPrice),
                    totalPrice: Number(item.totalPrice)
                })),
                totalMaterial: items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.materialPrice)), 0),
                totalLabor: Number(laborCost),
                subtotal,
                laborCost: Number(laborCost),
                operationCost: Number(operationCost),
                tax: 0,
                grandTotal,
                quotationNumber,
                notes,
                conditions,
                // Automatically transition to 'revised' if previously 'revision_requested'
                status: mode === "edit" && initialData?.status === "revision_requested"
                    ? "revised"
                    : (initialData?.status || "pending")
            }

            const url = mode === "create" ? "/api/admin/quotations" : `/api/admin/quotations/${initialData?.id}`
            const method = mode === "create" ? "POST" : "PATCH"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error(`Failed to ${mode} quotation`)

            router.push(mode === "create" ? "/admin/quotations" : `/admin/quotations/${initialData?.id}`)
            router.refresh()
        } catch (error) {
            console.error(`Error ${mode} quotation:`, error)
            alert(`เกิดข้อผิดพลาดในการ${mode === "create" ? "สร้าง" : "แก้ไข"}ใบเสนอราคา`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href={mode === "create" ? "/admin/quotations" : `/admin/quotations/${initialData?.id}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        กลับ
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Save className="h-4 w-4 mr-2" />
                        {mode === "create" ? "สร้างใบเสนอราคา" : "บันทึกการแก้ไข"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>ข้อมูลลูกค้าและโครงการ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>เลขที่ใบเสนอราคา</Label>
                                {contract?.contractNumber && (
                                    <div className="flex items-center gap-2 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200 shadow-sm">
                                        <FileSignature className="h-3 w-3" />
                                        เลขที่สัญญา: {contract.contractNumber}
                                    </div>
                                )}
                            </div>
                            <Input
                                value={quotationNumber}
                                onChange={e => setQuotationNumber(e.target.value)}
                                placeholder="เช่น QT-2026-0001"
                                className="font-mono font-bold text-blue-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>ลูกค้า</Label>
                            <Select value={customerId} onValueChange={setCustomerId} disabled={mode === "edit"} required>
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

                        {houseImage && (
                            <div className="space-y-2">
                                <Label>รูปภาพแบบบ้าน</Label>
                                <div className="mt-2 border rounded-md overflow-hidden bg-muted/20">
                                    <img src={houseImage} alt="House Preview" className="w-full h-auto max-h-[200px] object-contain" />
                                </div>
                            </div>
                        )}

                        {floorPlanImages && floorPlanImages.length > 0 && (
                            <div className="space-y-2">
                                <Label>แปลนบ้าน ({floorPlanImages.length} รูป)</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {floorPlanImages.map((img, idx) => (
                                        <div key={idx} className="border rounded-md overflow-hidden bg-muted/20">
                                            <img src={img} alt={`Floor Plan ${idx + 1}`} className="w-full h-auto max-h-[100px] object-contain" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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

                        <div className="space-y-2">
                            <Label>จำนวนชั้น</Label>
                            <Select value={storyType} onValueChange={setStoryType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกจำนวนชั้น" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">บ้านชั้นเดียว</SelectItem>
                                    <SelectItem value="1.5">บ้านชั้นครึ่ง (1.5 ชั้น)</SelectItem>
                                    <SelectItem value="2">บ้านสองชั้น</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-4 border rounded-md bg-muted/20">
                            <div className="space-y-1">
                                <Label className="text-xs">ห้องนอน</Label>
                                <Input type="number" value={roomStats.bedrooms} onChange={e => setRoomStats({ ...roomStats, bedrooms: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">ห้องน้ำ</Label>
                                <Input type="number" value={roomStats.bathrooms} onChange={e => setRoomStats({ ...roomStats, bathrooms: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">ห้องครัว</Label>
                                <Input type="number" value={roomStats.kitchens} onChange={e => setRoomStats({ ...roomStats, kitchens: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">ห้องรับแขก</Label>
                                <Input type="number" value={roomStats.livingRooms} onChange={e => setRoomStats({ ...roomStats, livingRooms: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">ที่จอดรถ</Label>
                                <Input type="number" value={roomStats.parking} onChange={e => setRoomStats({ ...roomStats, parking: Number(e.target.value) })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>งบประมาณ (บาท)</Label>
                                <Input value={budget} onChange={e => setBudget(e.target.value)} required />
                                <p className="text-[10px] text-muted-foreground">
                                    * เป็นราคาที่รวมสำรอง 15% แล้ว (ปรับเปลี่ยนได้ตามความเหมาะสม)
                                </p>
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
                                <span className="font-medium">{(items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.materialPrice)), 0)).toLocaleString()} บาท</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>ค่าแรง</Label>
                                    <Input
                                        type="number"
                                        className="w-32 text-right"
                                        value={laborCost}
                                        onChange={e => setLaborCost(Number(e.target.value))}
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
                                        onChange={e => setOperationCost(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* Tax Removed */}

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
                    <div className="flex gap-2">
                        <Button type="button" onClick={calculateStandardMaterials} size="sm" variant="secondary">
                            คำนวณวัสดุมาตรฐาน
                        </Button>
                        <Button type="button" onClick={addItem} size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            เพิ่มรายการ
                        </Button>
                    </div>
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
                                    <TableHead className="w-[30%]">รายการ</TableHead>
                                    <TableHead className="text-right">จำนวน</TableHead>
                                    <TableHead className="text-right w-[80px]">หน่วย</TableHead>
                                    <TableHead className="text-right">ราคาวัสดุ</TableHead>
                                    <TableHead className="text-right">ค่าแรง</TableHead>
                                    <TableHead className="text-right">รวม</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    "งานเตรียมการ/ฐานราก",
                                    "โครงสร้างหลัก",
                                    "โครงสร้างหลังคา",
                                    "งานสถาปัตย์/ตกแต่ง",
                                    "งานระบบ",
                                    "ประตู-หน้าต่าง",
                                    "งานภายนอก",
                                    "อื่นๆ"
                                ].map((cat) => {
                                    const categoryItems = items.filter(item => (item.category === cat) || (!item.category && cat === "อื่นๆ"))
                                    if (categoryItems.length === 0) return null

                                    return (
                                        <Fragment key={cat}>
                                            <TableRow key={`${cat}-header`} className="bg-muted/30">
                                                <TableCell colSpan={7} className="font-bold py-2">
                                                    {cat}
                                                </TableCell>
                                            </TableRow>
                                            {categoryItems.map((item) => (
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
                                                            value={item.materialPrice}
                                                            onChange={e => updateItem(item.id, "materialPrice", e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Input
                                                            type="number"
                                                            className="text-right"
                                                            value={item.laborPrice}
                                                            onChange={e => updateItem(item.id, "laborPrice", e.target.value)}
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
                                        </Fragment>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>หมายเหตุและเงื่อนไข (แสดงในใบเสนอราคา)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>หมายเหตุ</Label>
                        <Textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="เช่น ราคาประเมินนี้อาจเปลี่ยนแปลงตามหน้างาน..."
                            rows={2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>เงื่อนไข</Label>
                        <Textarea
                            value={conditions}
                            onChange={e => setConditions(e.target.value)}
                            placeholder="เช่น 1. ยืนราคา 30 วัน..."
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
