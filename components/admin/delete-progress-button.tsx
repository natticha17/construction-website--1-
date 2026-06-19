"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteProgressButtonProps {
    id: string
    projectName: string
}

export function DeleteProgressButton({ id, projectName }: DeleteProgressButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`คุณต้องการลบข้อมูลความคืบหน้าของโครงการ "${projectName}" ใช่หรือไม่?\nการกระทำนี้ไม่สามารถย้อนกลับได้`)) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/progress/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Failed to delete progress")

            router.refresh()
        } catch (error) {
            console.error("Error deleting progress:", error)
            alert("เกิดข้อผิดพลาดในการลบข้อมูล")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    )
}
