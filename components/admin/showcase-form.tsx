"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, Plus, X, Image as ImageIcon, ArrowLeft } from "lucide-react"
import type { ShowcaseProject, HousePlan } from "@/lib/types"

interface ShowcaseFormProps {
    project?: ShowcaseProject | null
}

export function ShowcaseForm({ project }: ShowcaseFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const subFileInputRef = useRef<HTMLInputElement>(null)
    const [housePlans, setHousePlans] = useState<HousePlan[]>([])

    // Initialize form data directly from project prop if available
    const [formData, setFormData] = useState(() => {
        const initial = {
            name: "",
            housePlanId: "none",
            location: "",
            description: "",
            completionDate: "",
            price: "" as string | number,
            bedrooms: "" as string | number,
            bathrooms: "" as string | number,
            kitchens: "" as string | number,
            livingRooms: "" as string | number,
            parking: "" as string | number,
            area: "" as string | number,
            ownerName: "",
            images: [] as string[],
            subImages: [] as string[]
        }

        if (project) {
            let formattedDate = ""
            try {
                if (project.completionDate) {
                    const date = new Date(project.completionDate)
                    if (!isNaN(date.getTime())) {
                        formattedDate = date.toISOString().split('T')[0]
                    }
                }
            } catch (e) {
                console.error("Invalid date:", project.completionDate)
            }

            return {
                ...initial,
                name: project.name || "",
                housePlanId: project.housePlanId || "none",
                location: project.location || "",
                description: project.description || "",
                completionDate: formattedDate,
                price: project.price ?? "",
                bedrooms: project.bedrooms ?? "",
                bathrooms: project.bathrooms ?? "",
                kitchens: project.kitchens ?? "",
                livingRooms: project.livingRooms ?? "",
                parking: project.parking ?? "",
                area: project.area ?? "",
                ownerName: project.ownerName || "",
                images: project.images || [],
                subImages: project.subImages || []
            }
        }
        return initial
    })

    useEffect(() => {
        fetchHousePlans()
    }, [])

    const fetchHousePlans = async () => {
        try {
            const response = await fetch("/api/admin/house-plans")
            const data = await response.json()
            setHousePlans(data.plans || [])
        } catch (error) {
            console.error("Error fetching house plans:", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const payload = {
                ...formData,
                housePlanId: formData.housePlanId === "none" ? undefined : formData.housePlanId,
                price: formData.price !== "" ? Number(formData.price) : undefined,
                bedrooms: formData.bedrooms !== "" ? Number(formData.bedrooms) : undefined,
                bathrooms: formData.bathrooms !== "" ? Number(formData.bathrooms) : undefined,
                kitchens: formData.kitchens !== "" ? Number(formData.kitchens) : undefined,
                livingRooms: formData.livingRooms !== "" ? Number(formData.livingRooms) : undefined,
                parking: formData.parking !== "" ? Number(formData.parking) : undefined,
                area: formData.area !== "" ? Number(formData.area) : undefined,
            }

            const url = project
                ? `/api/admin/showcase/${project.id}`
                : "/api/admin/showcase"

            const method = project ? "PATCH" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                router.push("/admin/showcase")
                router.refresh()
            } else {
                const errorData = await response.json()
                alert(`เกิดข้อผิดพลาด: ${errorData.error || "ไม่สามารถบันทึกข้อมูลได้"}`)
            }
        } catch (error) {
            console.error("Error saving showcase project:", error)
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "images" | "subImages" = "images") => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        try {
            for (let i = 0; i < files.length; i++) {
                const uploadData = new FormData()
                uploadData.append("file", files[i])

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                })

                if (response.ok) {
                    const data = await response.json()
                    setFormData(prev => ({ ...prev, [field]: [...prev[field], data.url] }))
                }
            }
        } catch (error) {
            console.error("Error uploading file:", error)
        } finally {
            setIsUploading(false)
            if (e.target) e.target.value = ""
        }
    }

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const removeSubImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            subImages: prev.subImages.filter((_, i) => i !== index)
        }))
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">{project ? "แก้ไขผลงาน" : "เพิ่มผลงานที่ผ่านมา"}</CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">ชื่อผลงาน/ชื่อโครงการ *</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="เช่น บ้านคุณปัญญา - จ.ร้อยเอ็ด"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="housePlan">เชื่อมโยงกับแบบบ้าน</Label>
                            <Select
                                value={formData.housePlanId}
                                onValueChange={(value) => setFormData({ ...formData, housePlanId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกแบบบ้าน (ถ้ามี)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">ไม่ระบุ</SelectItem>
                                    {housePlans.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                            {plan.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="location">สถานที่ก่อสร้าง</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="เช่น อ.เมือง จ.ขอนแก่น"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="completionDate">วันที่เสร็จสิ้น</Label>
                            <Input
                                id="completionDate"
                                type="date"
                                value={formData.completionDate}
                                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="bedrooms">จำนวนห้องนอน</Label>
                            <Input
                                id="bedrooms"
                                type="number"
                                value={formData.bedrooms}
                                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bathrooms">จำนวนห้องน้ำ</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                value={formData.bathrooms}
                                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="kitchens">จำนวนห้องครัว</Label>
                            <Input
                                id="kitchens"
                                type="number"
                                value={formData.kitchens}
                                onChange={(e) => setFormData({ ...formData, kitchens: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="livingRooms">จำนวนห้องรับแขก</Label>
                            <Input
                                id="livingRooms"
                                type="number"
                                value={formData.livingRooms}
                                onChange={(e) => setFormData({ ...formData, livingRooms: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parking">ที่จอดรถ (คัน)</Label>
                            <Input
                                id="parking"
                                type="number"
                                value={formData.parking}
                                onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">ราคาก่อสร้าง (บาท)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="area">พื้นที่ใช้สอย (ตร.ม.)</Label>
                            <Input
                                id="area"
                                type="number"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ownerName">ชื่อเจ้าของบ้าน (ถ้าต้องการระบุ)</Label>
                            <Input
                                id="ownerName"
                                value={formData.ownerName}
                                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                placeholder="เช่น คุณปัญญา มโนราห์"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">รายละเอียดโครงการ</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="ระบุจุดเด่น วัสดุที่ใช้ หรือข้อมูลเพิ่มเติม..."
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-bold">1. รูปภาพบ้านหน้าหลัก (Exterior)</Label>
                                <p className="text-xs text-muted-foreground">จะแสดงในส่วนหัวและหน้าแสดงรายการโครงการ</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleFileUpload(e, "images")}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="gap-2"
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                {isUploading ? "กำลังอัปโหลด..." : "เพิ่มรูปภาพหลัก"}
                            </Button>
                        </div>

                        {formData.images.length === 0 ? (
                            <div className="border-2 border-dashed rounded-lg py-12 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                                <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                                <p className="text-sm">ยังไม่มีรูปภาพหลัก</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative aspect-square group">
                                        <img
                                            src={url}
                                            alt={`Project Main ${index + 1}`}
                                            className="w-full h-full object-cover rounded-md border"
                                            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded uppercase font-medium">หลัก</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-bold">2. รูปภาพภายใน / รายละเอียดเพิ่มเติม (Interior/Details)</Label>
                                <p className="text-xs text-muted-foreground">ภาพห้องต่างๆ ภายในบ้าน หรือจุดเด่นงานสถาปัตยกรรม</p>
                            </div>
                            <input
                                type="file"
                                ref={subFileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleFileUpload(e, "subImages")}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => subFileInputRef.current?.click()}
                                className="gap-2"
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                {isUploading ? "กำลังอัปโหลด..." : "เพิ่มรูปภาพย่อย"}
                            </Button>
                        </div>

                        {formData.subImages.length === 0 ? (
                            <div className="border-2 border-dashed rounded-lg py-12 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                                <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                                <p className="text-sm">ยังไม่มีรูปภาพย่อย</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                {formData.subImages.map((url, index) => (
                                    <div key={index} className="relative aspect-square group">
                                        <img
                                            src={url}
                                            alt={`Project Sub ${index + 1}`}
                                            className="w-full h-full object-cover rounded-md border"
                                            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSubImage(index)}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        <div className="absolute top-1 left-1 bg-primary/80 text-white text-[10px] px-1.5 rounded uppercase font-medium">ย่อย</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-[10px] text-muted-foreground">* ระบบจะอัปโหลดรูปภาพตัวอย่างของคุณไปยังเซิร์ฟเวอร์โดยอัตโนมัติ</p>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 border-t py-6">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        ยกเลิก
                    </Button>
                    <Button type="submit" disabled={isSubmitting || isUploading} className="min-w-[150px]">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังบันทึก...
                            </>
                        ) : (
                            "บันทึกข้อมูล"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
