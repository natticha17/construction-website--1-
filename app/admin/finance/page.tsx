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
    redirect("/login")
  }

  const financialRecords = await store.getFinancialRecords()
  const progressList = await store.getProjectProgressList()

  const totalIncome = financialRecords.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0)
  const totalExpense = financialRecords.filter((r) => r.type === "expense").reduce((sum, r) => sum + r.amount, 0)
  const profit = totalIncome - totalExpense

  // Group records by project name for summary
  const projectSummaryMap = new Map<string, { income: number; expense: number }>()

  // Initialize with all projects from progressList to ensure they appear
  progressList.forEach((p) => {
    if (!projectSummaryMap.has(p.projectName)) {
      projectSummaryMap.set(p.projectName, { income: 0, expense: 0 })
    }
  })

  // Add financial records to the map based on projectName
  financialRecords.forEach((r) => {
    const summary = projectSummaryMap.get(r.projectName) || { income: 0, expense: 0 }
    if (r.type === "income") summary.income += r.amount
    else summary.expense += r.amount
    projectSummaryMap.set(r.projectName, summary)
  })

  const projectSummary = Array.from(projectSummaryMap.entries()).map(([name, data]) => ({
    name,
    income: data.income,
    expense: data.expense,
    profit: data.income - data.expense,
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="รายรับ-รายจ่าย" description="ระบบบันทึกรายรับรายจ่ายแต่ละโครงการ" />

      <div className="flex-1 p-8 space-y-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/finance/new">
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มรายการ
            </Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">รายรับทั้งหมด</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{(totalIncome || 0).toLocaleString()} บาท</div>
              <p className="text-xs text-muted-foreground mt-1">จากทุกโครงการ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">รายจ่ายทั้งหมด</CardTitle>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{(totalExpense || 0).toLocaleString()} บาท</div>
              <p className="text-xs text-muted-foreground mt-1">ค่าวัสดุและค่าแรง</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">กำไรสุทธิ</CardTitle>
              <Wallet className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${(profit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {(profit || 0).toLocaleString()} บาท
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
                    <TableRow key={project.name}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/finance/project/${encodeURIComponent(project.name)}`}
                          className="hover:underline text-primary"
                        >
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-green-600">+{(project.income || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">-{(project.expense || 0).toLocaleString()}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${(project.profit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {(project.profit || 0) >= 0 ? "+" : ""}
                        {(project.profit || 0).toLocaleString()}
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
