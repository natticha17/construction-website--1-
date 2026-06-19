"use client"

import { ShowcaseForm } from "@/components/admin/showcase-form"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AddShowcasePage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            <AdminHeader
                title="เพิ่มผลงานที่ผ่านมา"
                description="กรอกข้อมูลผลงานการก่อสร้างจริงเพื่อแสดงบนหน้าเว็บไซต์"
                showBackButton
                backHref="/admin/showcase"
            />

            <div className="flex-1 p-8">
                <ShowcaseForm />
            </div>
        </div>
    )
}
