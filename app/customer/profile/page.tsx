import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { store } from "@/lib/store"

export default async function CustomerProfilePage() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/customer/login")
  }

  const user = store.getUser(customerId.value)
  if (!user) {
    redirect("/customer/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">โปรไฟล์</h1>
        <p className="text-muted-foreground">ข้อมูลบัญชีของคุณ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {user.name}
            <Badge variant={user.customerType === "project_owner" ? "default" : "secondary"}>
              {user.customerType === "project_owner" ? "เจ้าของโครงการ" : "ลูกค้าทั่วไป"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">อีเมล</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">เบอร์โทรศัพท์</p>
              <p className="font-medium">{user.phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">ที่อยู่</p>
              <p className="font-medium">{user.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">วันที่สมัครสมาชิก</p>
              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString("th-TH")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
