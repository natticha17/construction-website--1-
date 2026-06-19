"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import { Trash2, Loader2, Eye, Inbox, Mail, Copy, Check, MessageSquareReply } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ContactInquiry } from "@/lib/types"

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewInquiry, setViewInquiry] = useState<ContactInquiry | null>(null)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedContent, setCopiedContent] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: "email" | "content") => {
    navigator.clipboard.writeText(text)
    if (type === "email") {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedContent(true)
      setTimeout(() => setCopiedContent(false), 2000)
    }
  }

  const getGmailLink = (inquiry: ContactInquiry) => {
    const subject = encodeURIComponent("ตอบกลับจาก Piak House Construction")
    const body = encodeURIComponent(`เรียน คุณ${inquiry.name}\n\n${replyMessage}\n\n---\nข้อความเดิมของคุณ:\n"${inquiry.message}"`)
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${inquiry.email}&su=${subject}&body=${body}`
  }

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

  useEffect(() => {
    fetchInquiries()
  }, [])

  const handleMarkAsReplied = async (id: string) => {
    if (isUpdatingStatus) return
    setIsUpdatingStatus(id)
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "replied" }),
      })

      if (response.ok) {
        const data = await response.json()
        setInquiries(prev => prev.map((i) => (i.id === id ? { ...i, status: "replied" } : i)))
        if (viewInquiry?.id === id) {
          setViewInquiry(prev => prev ? { ...prev, status: "replied" } : null)
        }
      } else {
        const errorData = await response.json()
        alert(`เกิดข้อผิดพลาด: ${errorData.error || "ไม่สามารถอัปเดตสถานะได้"}`)
      }
    } catch (error) {
      console.error("Error updating inquiry status:", error)
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกรุณาลองใหม่อีกครั้ง")
    } finally {
      setIsUpdatingStatus(null)
    }
  }

  const handleReplyAndMark = async (inquiry: ContactInquiry) => {
    // Open Gmail first to avoid popup blockers
    window.open(getGmailLink(inquiry), "_blank")
    // Then update status in background
    await handleMarkAsReplied(inquiry.id)
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
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="ข้อความ" description="ดูและจัดการข้อความที่ติดต่อเข้ามา" />

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
                    <TableHead>อีเมล</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>วันที่</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id} className={inquiry.status === "new" ? "bg-primary/5" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {inquiry.name}
                          {inquiry.status === "new" && (
                            <Badge variant="default" className="bg-primary text-[10px] px-1 h-4">ใหม่</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{inquiry.email || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={inquiry.status === "replied" ? "secondary" : "outline"}>
                          {inquiry.status === "replied" ? "ตอบกลับแล้ว" : "ยังไม่ตอบกลับ"}
                        </Badge>
                      </TableCell>
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

      <Dialog
        open={!!viewInquiry}
        onOpenChange={(open) => {
          if (!open) {
            setViewInquiry(null)
            setReplyMessage("")
          }
        }}
      >
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
                <p className="text-sm text-muted-foreground">อีเมล</p>
                <p className="font-medium">{viewInquiry.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">วันที่ส่ง</p>
                <p className="font-medium">{formatDate(viewInquiry.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">รายละเอียดข้อความ</p>
                <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium whitespace-pre-wrap leading-relaxed">{viewInquiry.message}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium">พิมพ์ข้อความตอบกลับ</label>
                  <Textarea
                    placeholder="พิมพ์ข้อความที่คุณต้องการตอบกลับลูกค้าที่นี่..."
                    className="mt-1.5 min-h-[120px] resize-none"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    {viewInquiry.email && (
                      <>
                        <Button
                          className="flex-1 gap-2 bg-[#EA4335] hover:bg-[#d93025] text-white"
                          disabled={!replyMessage.trim()}
                          onClick={() => viewInquiry && handleReplyAndMark(viewInquiry)}
                        >
                          <Mail className="h-4 w-4" />
                          ตอบกลับผ่าน Gmail
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(viewInquiry.email, "email")}
                          title="คัดลอกอีเมล"
                          className="h-10 w-10 shrink-0"
                        >
                          {copiedEmail ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => viewInquiry && handleMarkAsReplied(viewInquiry.id)}
                    disabled={viewInquiry.status === "replied" || isUpdatingStatus === viewInquiry.id}
                  >
                    {isUpdatingStatus === viewInquiry.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : viewInquiry.status === "replied" ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        ตอบกลับแล้ว
                      </>
                    ) : (
                      <>
                        <MessageSquareReply className="h-4 w-4" />
                        ทำเครื่องหมายว่าตอบกลับแล้ว
                      </>
                    )}
                  </Button>
                </div>
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
