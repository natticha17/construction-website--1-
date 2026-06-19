"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import type { HousePlan } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"

interface HousePlanFormProps {
    initialData?: HousePlan
    mode: "create" | "edit"
}

export function HousePlanForm({ initialData, mode }: HousePlanFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoadingOptions, setIsLoadingOptions] = useState(true)
    const [houseTypes, setHouseTypes] = useState<string[]>([])
    const [houseStyles, setHouseStyles] = useState<string[]>([])

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        image: initialData?.image || "",
        area: initialData?.area || "",
        bedrooms: initialData?.bedrooms || "",
        bathrooms: initialData?.bathrooms || "",
        kitchens: initialData?.kitchens || "1",
        livingRooms: initialData?.livingRooms || "1",
        parking: initialData?.parking || "1",
        price: initialData?.price || "",
        description: initialData?.description || "",
        type: initialData?.type || "",
        style: initialData?.style || "",
        floorPlanImages: initialData?.floorPlanImages || [],
    })

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch("/api/house-options")
                if (res.ok) {
                    const data = await res.json()
                    setHouseTypes(data.types)
                    setHouseStyles(data.styles)

                    // Set defaults if creating new and options exist, or ensure valid initial data
                    if (mode === "create") {
                        setFormData(prev => ({
                            ...prev,
                            type: data.types[0] || "",
                            style: data.styles[0] || ""
                        }))
                    }
                }
            } catch (error) {
                console.error("Failed to fetch options", error)
            } finally {
                setIsLoadingOptions(false)
            }
        }
        fetchOptions()
    }, [mode])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const url = mode === "create" ? "/api/admin/house-plans" : `/api/admin/house-plans/${initialData?.id}`
            const method = mode === "create" ? "POST" : "PUT"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    area: formData.area.toString(), // Keep area as string if modeled that way, or Number if preferred. Actually HousePlan.ts has area as string.
                    price: Number(formData.price),
                    bedrooms: Number(formData.bedrooms),
                    bathrooms: Number(formData.bathrooms),
                    kitchens: Number(formData.kitchens),
                    livingRooms: Number(formData.livingRooms),
                    parking: Number(formData.parking),
                }),
            })

            if (response.ok) {
                router.push("/admin/house-plans")
                router.refresh()
            } else {
                const errorData = await response.json()
                alert(`Error: ${errorData.error || "Something went wrong"}`)
            }
        } catch (error) {
            console.error("Error saving house plan:", error)
            alert("Error saving house plan")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoadingOptions) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8" /></div>
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/house-plans">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        กลับ
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">{mode === "create" ? "เพิ่มแบบบ้านใหม่" : "แก้ไขแบบบ้าน"}</h1>
            </div>

            <Card className="max-w-3xl">
                <CardHeader>
                    <CardTitle>ข้อมูลแบบบ้าน</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">ชื่อแบบบ้าน *</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ประเภทบ้าน</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกประเภทบ้าน" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {houseTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>สไตล์บ้าน</Label>
                                <Select
                                    value={formData.style}
                                    onValueChange={(val) => setFormData({ ...formData, style: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกสไตล์บ้าน" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {houseStyles.map((style) => (
                                            <SelectItem key={style} value={style}>
                                                {style}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>รูปภาพตัวอย่าง *</Label>
                            <ImageUpload
                                value={formData.image ? [formData.image] : []}
                                onChange={(urls: string[]) => setFormData({ ...formData, image: urls[0] || "" })}
                            />
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>พื้นที่ใช้สอย (ตร.ม.) *</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>ราคา (บาท) *</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>ห้องนอน *</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.bedrooms}
                                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>ห้องน้ำ *</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.bathrooms}
                                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>ห้องครัว</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.kitchens}
                                    onChange={(e) => setFormData({ ...formData, kitchens: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>ห้องรับแขก</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.livingRooms}
                                    onChange={(e) => setFormData({ ...formData, livingRooms: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>ที่จอดรถ</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.parking}
                                    onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>รายละเอียด *</Label>
                            <Textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>รูปภาพแปลนบ้าน</Label>
                            <ImageUpload
                                value={formData.floorPlanImages}
                                onChange={(urls: string[]) => setFormData({ ...formData, floorPlanImages: urls })}
                            />
                            <p className="text-xs text-muted-foreground">สามารถเพิ่มรูปภาพแปลนบ้านได้หลายรูป</p>
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "create" ? "เพิ่มแบบบ้าน" : "บันทึกการแก้ไข"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
