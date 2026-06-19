"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function AddCustomerDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        houseNo: "",
        village: "",
        road: "",
        subDistrict: "",
        district: "",
        province: "",
        customerType: "general",
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch("/api/admin/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                toast.success("เพิ่มข้อมูลลูกค้าเรียบร้อยแล้ว")
                setIsOpen(false)
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    houseNo: "",
                    village: "",
                    road: "",
                    subDistrict: "",
                    district: "",
                    province: "",
                    customerType: "general",
                })
                router.refresh()
            } else {
                const data = await res.json()
                toast.error(data.error || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล")
            }
        } catch (error) {
            toast.error("ไม่สามารถบันทึกข้อมูลได้")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    เพิ่มข้อมูลลูกค้า
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>เพิ่มข้อมูลลูกค้าใหม่</DialogTitle>
                        <DialogDescription>
                            กรอกข้อมูลสำหรับลูกค้าที่ตกลงใช้บริการ
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right font-medium text-sm">ชื่อ-สกุล</Label>
                            <Input
                                id="name"
                                placeholder="ชื่อจริง - นามสกุล"
                                value={formData.name}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right font-medium text-sm">อีเมล</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="customer@example.com"
                                value={formData.email}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right font-medium text-sm">เบอร์โทร</Label>
                            <Input
                                id="phone"
                                placeholder="08x-xxx-xxxx"
                                value={formData.phone}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right font-medium text-sm">ประเภท</Label>
                            <div className="col-span-3">
                                <Select
                                    value={formData.customerType}
                                    onValueChange={(val) => setFormData({ ...formData, customerType: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกประเภทลูกค้า" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">ลูกค้าทั่วไป</SelectItem>
                                        <SelectItem value="project_owner">เจ้าของโครงการ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">ที่อยู่สำหรับก่อสร้าง / ติดต่อ</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="houseNo" className="text-right text-xs">บ้านเลขที่</Label>
                            <Input
                                id="houseNo"
                                value={formData.houseNo}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="village" className="text-right text-xs">หมู่บ้าน</Label>
                            <Input
                                id="village"
                                value={formData.village}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="road" className="text-right text-xs">ถนน</Label>
                            <Input
                                id="road"
                                value={formData.road}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, road: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subDistrict" className="text-right text-xs">ตำบล/แขวง</Label>
                            <Input
                                id="subDistrict"
                                value={formData.subDistrict}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="district" className="text-right text-xs">อำเภอ/เขต</Label>
                            <Input
                                id="district"
                                value={formData.district}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="province" className="text-right text-xs">จังหวัด</Label>
                            <Input
                                id="province"
                                value={formData.province}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                            ยกเลิก
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            บันทึกข้อมูล
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
