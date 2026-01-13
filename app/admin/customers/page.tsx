import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { store } from "@/lib/store"

export default async function AdminCustomersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    redirect("/admin/login")
  }

  const customers = store.getUsers()

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="จัดการลูกค้า" description="รายชื่อลูกค้าทั้งหมดในระบบ" />

      <div className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle>ลูกค้าทั้งหมด ({customers.length} ราย)</CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">ยังไม่มีลูกค้าในระบบ</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อ-นามสกุล</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>เบอร์โทร</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>วันที่สมัคร</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        <Badge variant={customer.customerType === "project_owner" ? "default" : "secondary"}>
                          {customer.customerType === "project_owner" ? "เจ้าของโครงการ" : "ลูกค้าทั่วไป"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(customer.createdAt).toLocaleDateString("th-TH")}</TableCell>
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
