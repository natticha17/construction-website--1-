"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Loader2, Eye, Inbox } from "lucide-react"
import type { ContactInquiry } from "@/lib/data"

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewInquiry, setViewInquiry] = useState<ContactInquiry | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/admin/inquiries")
      const data = await response.json()
      setInquiries(data.inquiries)
    } catch (error) {
      console.error("Error fetching inquiries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/inquiries/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setInquiries(inquiries.filter((i) => i.id !== deleteId))
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="ข้อความจากลูกค้า" description="ดูและจัดการข้อความที่ลูกค้าติดต่อเข้ามา" />

      <div className="flex-1 p-8">
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">ยังไม่มีข้อความ</h3>
                <p className="text-sm text-muted-foreground">เมื่อลูกค้าส่งข้อความผ่านฟอร์มติดต่อ จะแสดงที่นี่</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อ</TableHead>
                    <TableHead>เบอร์โทร</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>วันที่</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium">{inquiry.name}</TableCell>
                      <TableCell>{inquiry.phone}</TableCell>
                      <TableCell>{inquiry.email || "-"}</TableCell>
                      <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setViewInquiry(inquiry)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(inquiry.id)}
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

      <Dialog open={!!viewInquiry} onOpenChange={() => setViewInquiry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>รายละเอียดข้อความ</DialogTitle>
          </DialogHeader>
          {viewInquiry && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อ</p>
                <p className="font-medium">{viewInquiry.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">เบอร์โทรศัพท์</p>
                <p className="font-medium">{viewInquiry.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">อีเมล</p>
                <p className="font-medium">{viewInquiry.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">วันที่ส่ง</p>
                <p className="font-medium">{formatDate(viewInquiry.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ข้อความ</p>
                <p className="font-medium whitespace-pre-wrap">{viewInquiry.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>คุณต้องการลบข้อความนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</AlertDialogDescription>
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
