import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Wallet, ArrowLeft, Image as ImageIcon } from "lucide-react"
import { store } from "@/lib/store"
import NextImage from "next/image"

export default async function ProjectFinanceDetailPage({ params }: { params: { name: string } }) {
    const { name } = await params
    const projectName = decodeURIComponent(name)

    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")

    if (!token) {
        redirect("/login")
    }

    const allRecords = await store.getFinancialRecords()
    const records = allRecords.filter(r => r.projectName === projectName)
    const progressList = await store.getProjectProgressList()
    const subProjects = progressList.filter(p => p.projectName === projectName)

    const totalIncome = records.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0)
    const totalExpense = records.filter((r) => r.type === "expense").reduce((sum, r) => sum + r.amount, 0)
    const profit = totalIncome - totalExpense

    return (
        <div className="flex flex-col min-h-screen">
            <AdminHeader
                title={`รายละเอียดการเงิน: ${projectName}`}
                description={`สรุปรายรับ-รายจ่ายของโครงการ ${projectName}`}
            />

            <div className="flex-1 p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href="/admin/finance">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            กลับหน้าหลัก
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/admin/finance/new?projectId=${subProjects[0]?.id || ""}`}>
                            เพิ่มรายการ
                        </Link>
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">รายรับโครงการ</CardTitle>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{totalIncome.toLocaleString()} บาท</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">รายจ่ายโครงการ</CardTitle>
                            <TrendingDown className="h-5 w-5 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">{totalExpense.toLocaleString()} บาท</div>
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
                        </CardContent>
                    </Card>
                </div>

                {/* Individual Houses / Sub-projects if any */}
                {subProjects.length > 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>รายการบ้านในโครงการ</CardTitle>
                            <CardDescription>การเงินแยกตามแปลง/หลัง</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {subProjects.map(p => {
                                    const pRecords = records.filter(r => r.projectId === p.id)
                                    const pIncome = pRecords.filter(r => r.type === "income").reduce((s, r) => s + r.amount, 0)
                                    const pExpense = pRecords.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0)
                                    return (
                                        <div key={p.id} className="p-4 rounded-lg border bg-card">
                                            <p className="font-bold mb-2">ID: {p.id.substring(0, 8)}...</p>
                                            <div className="flex justify-between text-sm">
                                                <span>รายรับ:</span>
                                                <span className="text-green-600">+{pIncome.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>รายจ่าย:</span>
                                                <span className="text-red-600">-{pExpense.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between font-bold border-t mt-2 pt-2 text-sm">
                                                <span>รวม:</span>
                                                <span className={pIncome - pExpense >= 0 ? "text-green-600" : "text-red-600"}>
                                                    {(pIncome - pExpense).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* All Records for this project */}
                <Card>
                    <CardHeader>
                        <CardTitle>รายการทั้งหมดในโครงการ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {records.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">ยังไม่มีรายการบันทึก</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>วันที่</TableHead>
                                        <TableHead>ประเภท</TableHead>
                                        <TableHead>หมวดหมู่</TableHead>
                                        <TableHead>รายละเอียด</TableHead>
                                        <TableHead>ใบเสร็จ</TableHead>
                                        <TableHead className="text-right">จำนวนเงิน</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell>{new Date(record.date).toLocaleDateString("th-TH")}</TableCell>
                                                <TableCell>
                                                    <Badge variant={record.type === "income" ? "default" : "destructive"}>
                                                        {record.type === "income" ? "รายรับ" : "รายจ่าย"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{record.category}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">{record.description}</TableCell>
                                                <TableCell>
                                                    {record.receiptImage ? (
                                                        <Link
                                                            href={record.receiptImage}
                                                            target="_blank"
                                                            className="text-primary hover:underline flex items-center gap-1 text-xs"
                                                        >
                                                            <ImageIcon className="h-3 w-3" />
                                                            ดูรูป
                                                        </Link>
                                                    ) : "-"}
                                                </TableCell>
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
