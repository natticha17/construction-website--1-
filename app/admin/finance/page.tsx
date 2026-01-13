import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react"
import { store } from "@/lib/store"

export default async function AdminFinancePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    redirect("/admin/login")
  }

  const financialRecords = store.getFinancialRecords()
  const progressList = store.getProjectProgressList()

  const totalIncome = financialRecords.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0)
  const totalExpense = financialRecords.filter((r) => r.type === "expense").reduce((sum, r) => sum + r.amount, 0)
  const profit = totalIncome - totalExpense

  // Group records by project for summary
  const projectSummary = progressList.map((project) => {
    const records = financialRecords.filter((r) => r.projectId === project.id)
    const income = records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0)
    const expense = records.filter((r) => r.type === "expense").reduce((sum, r) => sum + r.amount, 0)
    return {
      id: project.id,
      name: project.projectName,
      income,
      expense,
      profit: income - expense,
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="รายรับ-รายจ่าย" description="ระบบบันทึกรายรับรายจ่ายแต่ละโครงการ" />

      <div className="flex-1 p-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">รายรับทั้งหมด</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalIncome.toLocaleString()} บาท</div>
              <p className="text-xs text-muted-foreground mt-1">จากทุกโครงการ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">รายจ่ายทั้งหมด</CardTitle>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{totalExpense.toLocaleString()} บาท</div>
              <p className="text-xs text-muted-foreground mt-1">ค่าวัสดุและค่าแรง</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">กำไรสุทธิ</CardTitle>
              <Wallet className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                {profit.toLocaleString()} บาท
              </div>
              <p className="text-xs text-muted-foreground mt-1">รายรับ - รายจ่าย</p>
            </CardContent>
          </Card>
        </div>

        {/* Project Summary */}
        <Card>
          <CardHeader>
            <CardTitle>สรุปรายโครงการ</CardTitle>
          </CardHeader>
          <CardContent>
            {projectSummary.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">ยังไม่มีโครงการ</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>โครงการ</TableHead>
                    <TableHead className="text-right">รายรับ</TableHead>
                    <TableHead className="text-right">รายจ่าย</TableHead>
                    <TableHead className="text-right">กำไร/ขาดทุน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectSummary.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell className="text-right text-green-600">+{project.income.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">-{project.expense.toLocaleString()}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${project.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {project.profit >= 0 ? "+" : ""}
                        {project.profit.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* All Records */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>รายการทั้งหมด</CardTitle>
            <Button asChild>
              <Link href="/admin/finance/new">
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มรายการ
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {financialRecords.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">ยังไม่มีรายการบันทึก</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่</TableHead>
                    <TableHead>โครงการ</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead>รายละเอียด</TableHead>
                    <TableHead className="text-right">จำนวนเงิน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString("th-TH")}</TableCell>
                        <TableCell>{record.projectName}</TableCell>
                        <TableCell>
                          <Badge variant={record.type === "income" ? "default" : "destructive"}>
                            {record.type === "income" ? "รายรับ" : "รายจ่าย"}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.category}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{record.description}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${record.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {record.type === "income" ? "+" : "-"}
                          {record.amount.toLocaleString()}
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
