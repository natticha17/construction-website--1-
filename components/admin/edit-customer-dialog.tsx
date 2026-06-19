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
import { Edit2, Loader2 } from "lucide-react"

export function EditCustomerDialog({ customer }: { customer: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        houseNo: customer.houseNo || "",
        village: customer.village || "",
        road: customer.road || "",
        subDistrict: customer.subDistrict || "",
        district: customer.district || "",
        province: customer.province || "",
        customerType: customer.customerType || "general",
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/customers/${customer.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                setIsOpen(false)
                router.refresh()
            } else {
                const data = await res.json()
                alert(data.error || "เกิดข้อผิดพลาด")
            }
        } catch (error) {
            alert("ไม่สามารถบันทึกข้อมูลได้")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>แก้ไขข้อมูลลูกค้า</DialogTitle>
                        <DialogDescription>
                            ปรับปรุงข้อมูลส่วนตัวและสถานะของลูกค้าตามความเหมาะสม
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">ชื่อ-สกุล</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">อีเมล</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">เบอร์โทร</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">ประเภท</Label>
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
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
