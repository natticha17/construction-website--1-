"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Pencil, Trash2, Camera, MapPin, Calendar, Images } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ShowcaseProject } from "@/lib/types"

export default function AdminShowcasePage() {
    const router = useRouter()
    const [projects, setProjects] = useState<ShowcaseProject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/admin/showcase")
            const data = await response.json()
            setProjects(data.projects || [])
        } catch (error) {
            console.error("Error fetching projects:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)

        try {
            const response = await fetch(`/api/admin/showcase/${deleteId}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setProjects(projects.filter((p) => p.id !== deleteId))
            }
        } catch (error) {
            console.error("Error deleting project:", error)
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            <AdminHeader title="จัดการผลงานที่ผ่านมา" description="เพิ่มและจัดการรูปภาพผลงานก่อสร้างจริง เพื่อแสดงบนหน้าเว็บไซต์">
                <Button asChild className="gap-2 ">
                    <Link href="/admin/showcase/add">
                        <Plus className="h-4 w-4" />
                        เพิ่มผลงานใหม่
                    </Link>
                </Button>
            </AdminHeader>

            <div className="flex-1 p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground animate-pulse">กำลังโหลดข้อมูลผลงาน...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border-2 border-dashed">
                        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                            <Camera className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">ยังไม่มีผลงานที่ผ่านมา</h3>
                        <p className="text-muted-foreground mb-8 max-w-sm text-center">
                            เริ่มสร้างความน่าเชื่อถือด้วยการเพิ่มภาพผลงานการก่อสร้างจริงของคุณที่นี่
                        </p>
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/admin/showcase/add">
                                <Plus className="h-4 w-4" />
                                เพิ่มผลงานชิ้นแรก
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {projects.map((project) => (
                            <Card key={project.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none shadow-md">
                                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                    {project.images && project.images.length > 0 ? (
                                        <img
                                            src={project.images[0]}
                                            alt={project.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                            <Camera className="h-12 w-12" />
                                        </div>
                                    )}
                                    {project.images && project.images.length > 1 && (
                                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] flex items-center gap-1">
                                            <Images className="h-3 w-3" />
                                            +{project.images.length - 1}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <div className="flex gap-2 w-full">
                                            <Button size="sm" variant="secondary" className="flex-1 gap-1" asChild>
                                                <Link href={`/admin/showcase/edit/${project.id}`}>
                                                    <Pencil className="h-3 w-3" />
                                                    แก้ไข
                                                </Link>
                                            </Button>
                                            <Button size="sm" variant="destructive" className="flex-1 gap-1" onClick={() => setDeleteId(project.id)}>
                                                <Trash2 className="h-3 w-3" />
                                                ลบ
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="font-bold text-lg mb-2 line-clamp-1">{project.name}</h4>
                                    <div className="space-y-1.5 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3 w-3 text-primary" />
                                            {project.location || "ไม่ระบุสถานที่"}
                                        </div>
                                        {project.completionDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3 text-primary" />
                                                เสร็จสิ้น: {new Date(project.completionDate).toLocaleDateString("th-TH", { month: "short", year: "numeric" })}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบผลงาน</AlertDialogTitle>
                        <AlertDialogDescription>คุณต้องการลบผลงานนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    กำลังลบ...
                                </>
                            ) : (
                                "ลบผลงาน"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
