import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import { store } from "@/lib/store"

export default async function AdminContractsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    redirect("/admin/login")
  }

  const contracts = store.getContracts()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500 text-white">ยอมรับแล้ว</Badge>
      case "completed":
        return <Badge className="bg-blue-500 text-white">เสร็จสิ้น</Badge>
      default:
        return <Badge variant="secondary">รอยืนยัน</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="จัดการสัญญา" description="รายการสัญญาทั้งหมด" />

      <div className="flex-1 p-8">
        <Card>
          <CardContent className="p-0">
            {contracts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">ยังไม่มีสัญญา</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เลขที่สัญญา</TableHead>
                    <TableHead>โครงการ</TableHead>
                    <TableHead>ลูกค้า</TableHead>
                    <TableHead className="text-right">มูลค่า</TableHead>
                    <TableHead>ระยะเวลา</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-mono text-sm">{contract.id}</TableCell>
                      <TableCell className="font-medium">{contract.projectName}</TableCell>
                      <TableCell>{contract.customerName}</TableCell>
                      <TableCell className="text-right font-medium">
                        {contract.contractValue.toLocaleString()} บาท
                      </TableCell>
                      <TableCell>{contract.constructionPeriod}</TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/contracts/${contract.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
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
