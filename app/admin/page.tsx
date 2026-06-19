import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, TrendingUp, Wallet, ClipboardList, FileSignature } from "lucide-react"
import { store } from "@/lib/store"
import { Description } from "@radix-ui/react-toast"

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    redirect("/login")
  }

  const housePlans = await store.getHousePlans()
  const customers = await store.getUsers()
  const quotations = await store.getQuotations()
  const contracts = await store.getContracts()
  const progressList = await store.getProjectProgressList()
  const financialRecords = await store.getFinancialRecords()

  const totalIncome = financialRecords.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0)
  const totalExpense = financialRecords.filter((r) => r.type === "expense").reduce((sum, r) => sum + r.amount, 0)
  const profit = totalIncome - totalExpense

  const stats = [
    {
      title: "แบบบ้านทั้งหมด",
      value: housePlans.length.toString(),
      icon: FileText,
      description: "จำนวนแบบบ้านในระบบ",
    },
    {
      title: "ลูกค้าทั้งหมด",
      value: customers.length.toString(),
      icon: Users,
      description: "จำนวนลูกค้าที่ลงทะเบียน",
    },
    {
      title: "ใบเสนอราคา",
      value: quotations.length.toString(),
      icon: ClipboardList,
      description: `รอพิจารณา ${quotations.filter((q) => q.status === "pending").length} รายการ | ว่าจ้างแล้ว ${quotations.filter((q) => q.status === "approved").length} รายการ`,
    },
    {
      title: "สัญญาที่ดำเนินการ",
      value: contracts.filter((c) => c.status === "accepted").length.toString(),
      icon: FileSignature,
      description: `ทั้งหมด ${contracts.length} สัญญา`,
    },
    {
      title: "โครงการทั้งหมด",
      value: progressList.length.toString(),
      icon: TrendingUp,
      description: `โครงการที่กำลังก่อสร้าง ${progressList.filter((p) => p.status === "progress" || (p.overallProgress > 0 && p.overallProgress < 100)).length} โครงการ | โครงการที่เสร็จสิ้น ${progressList.filter((p) => p.status === "completed" || p.overallProgress === 100).length} โครงการ`,
    },
    {
      title: "กำไร/ขาดทุน",
      value: `${(profit || 0) >= 0 ? "+" : ""}${(profit || 0).toLocaleString()}`,
      icon: Wallet,
      description: `รายรับ ${(totalIncome || 0).toLocaleString()} | รายจ่าย ${(totalExpense || 0).toLocaleString()}`,
      highlight: (profit || 0) >= 0 ? "positive" : "negative",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="แดชบอร์ด" description="ภาพรวมระบบจัดการเว็บไซต์" />

      <div className="flex-1 p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold ${stat.highlight === "positive"
                    ? "text-green-600"
                    : stat.highlight === "negative"
                      ? "text-red-600"
                      : "text-card-foreground"
                    }`}
                >
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>ใบเสนอราคาล่าสุด</CardTitle>
            </CardHeader>
            <CardContent>
              {quotations.length === 0 ? (
                <p className="text-muted-foreground text-sm">ยังไม่มีใบเสนอราคา</p>
              ) : (
                <ul className="space-y-3">
                  {quotations.slice(0, 5).map((q) => (
                    <li key={q.id} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-card-foreground">{q.customerName}</span>
                        <span className="text-xs text-muted-foreground ml-2">({q.housePlanName})</span>
                      </div>
                      <span className="text-sm font-medium">{(q.grandTotal || 0).toLocaleString()} บาท</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>โครงการที่กำลังดำเนินการ</CardTitle>
            </CardHeader>
            <CardContent>
              {progressList.length === 0 ? (
                <p className="text-muted-foreground text-sm">ยังไม่มีโครงการ</p>
              ) : (
                <ul className="space-y-3">
                  {progressList.slice(0, 5).map((p) => (
                    <li key={p.id} className="flex items-center justify-between">
                      <span className="text-sm text-card-foreground">{p.projectName}</span>
                      <span className="text-sm font-medium text-primary">{p.overallProgress}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
