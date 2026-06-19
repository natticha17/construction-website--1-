import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Plus } from "lucide-react"
import { store } from "@/lib/store"
import { DeleteQuotationButton } from "@/components/admin/delete-quotation-button"

export default async function AdminQuotationsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    redirect("/login")
  }

  const quotations = await store.getQuotations()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "revision_requested":
        return <Badge className="bg-amber-500 text-white">ขอแก้ไข</Badge>
      case "revised":
        return <Badge className="bg-indigo-500 text-white">แก้ไขแล้ว</Badge>
      case "proposed":
        return <Badge className="bg-blue-500 text-white">รอตรวจสอบ</Badge>
      case "approved":
        return <Badge className="bg-green-600 text-white">ว่าจ้างแล้ว</Badge>
      case "rejected":
        return <Badge variant="destructive">ไม่ว่าจ้าง</Badge>
      default:
        return <Badge variant="secondary">รอจัดทำ</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="จัดการใบเสนอราคา" description="รายการใบเสนอราคาทั้งหมด" />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">ใบเสนอราคาทั้งหมด ({quotations.length} รายการ)</h2>
          <Button asChild>
            <Link href="/admin/quotations/new">
              <Plus className="h-4 w-4 mr-2" />
              สร้างใบเสนอราคา
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {quotations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">ยังไม่มีใบเสนอราคา</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เลขที่</TableHead>
                    <TableHead>ลูกค้า</TableHead>
                    <TableHead>แบบบ้าน</TableHead>
                    <TableHead>พื้นที่ใช้สอย</TableHead>
                    <TableHead >ยอดรวม</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>วันที่สร้าง</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-mono text-sm text-blue-600 font-bold">
                        {quotation.quotationNumber || quotation.id}
                      </TableCell>
                      <TableCell className="font-medium">{quotation.customerName}</TableCell>
                      <TableCell>{quotation.housePlanName}</TableCell>
                      <TableCell>{quotation.area} ตร.ม.</TableCell>
                      <TableCell className="font-medium">
                        {(quotation.grandTotal || 0).toLocaleString()} บาท
                      </TableCell>
                      <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                      <TableCell>{new Date(quotation.createdAt).toLocaleDateString("th-TH")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/quotations/${quotation.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteQuotationButton
                            id={quotation.id}
                            quotationNumber={quotation.quotationNumber}
                          />
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
    </div>
  )
}
