"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import type { HousePlan } from "@/lib/data"

export default function AdminHousePlansPage() {
  const [housePlans, setHousePlans] = useState<HousePlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchHousePlans()
  }, [])

  const fetchHousePlans = async () => {
    try {
      const response = await fetch("/api/admin/house-plans")
      const data = await response.json()
      setHousePlans(data.housePlans)
    } catch (error) {
      console.error("Error fetching house plans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/house-plans/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setHousePlans(housePlans.filter((p) => p.id !== deleteId))
      }
    } catch (error) {
      console.error("Error deleting house plan:", error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="จัดการแบบบ้าน" description="เพิ่ม แก้ไข หรือลบแบบบ้านในระบบ" />

      <div className="flex-1 p-8">
        <div className="flex justify-end mb-6">
          <Button asChild>
            <Link href="/admin/house-plans/new">
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มแบบบ้านใหม่
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">รูปภาพ</TableHead>
                    <TableHead>ชื่อแบบบ้าน</TableHead>
                    <TableHead>พื้นที่</TableHead>
                    <TableHead>ห้องนอน</TableHead>
                    <TableHead>ราคา</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {housePlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image src={plan.image || "/placeholder.svg"} alt={plan.name} fill className="object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.area} ตร.ม.</TableCell>
                      <TableCell>{plan.bedrooms}</TableCell>
                      <TableCell>{plan.price} บาท</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/house-plans/${plan.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(plan.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>คุณต้องการลบแบบบ้านนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</AlertDialogDescription>
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
                "ลบ"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
