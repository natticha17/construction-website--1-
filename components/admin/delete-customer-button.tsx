"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteCustomerButton({ id, name }: { id: string, name: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/customers/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                router.refresh()
            } else {
                const data = await res.json()
                alert(data.error || "ไม่สามารถลบข้อมูลได้")
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>ยืนยันการลบลูกค้า?</AlertDialogTitle>
                    <AlertDialogDescription>
                        คุณต้องการลบข้อมูลลูกค้า <span className="font-bold text-foreground">{name}</span> ใช่หรือไม่?
                        การกระทำนี้จะลบบัญชีผู้ใช้และข้อมูลที่เกี่ยวข้อง (ถ้ามี) อย่างถาวร
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        ลบข้อมูล
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
