import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { store } from "@/lib/store"
import { EditProfileDialog } from "@/components/customer/edit-profile-dialog"

export default async function CustomerProfilePage() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get("customer_id")

  if (!customerId) {
    redirect("/login")
  }

  const user = await store.getUser(customerId.value)
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Header Area */}
      <div className="flex flex-col space-y-4 mb-8">
        <Button variant="ghost" className="w-fit pl-0 hover:bg-transparent hover:text-primary transition-colors group" asChild>
          <Link href="/customer/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">ย้อนกลับ</span>
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">โปรไฟล์ส่วนตัว</h1>
            <p className="text-muted-foreground text-lg">จัดการข้อมูลสมาชิกและที่อยู่สำหรับการติดต่อ</p>
          </div>
          <EditProfileDialog user={user} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 shadow-md border-primary/10 overflow-hidden h-fit">
          <div className="h-2 bg-primary w-full" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-4 ring-primary/5">
              <span className="text-3xl font-bold text-primary">
                {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <CardTitle className="text-xl font-bold truncate">{user.name}</CardTitle>
            <div className="flex justify-center mt-2">
              <Badge variant={user.customerType === "project_owner" ? "default" : "secondary"} className="px-3 py-1">
                {user.customerType === "project_owner" ? "เจ้าของโครงการ" : "ลูกค้าทั่วไป"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 border-t border-slate-100 mt-4">
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-slate-50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">อีเมล</p>
                  <p className="font-medium truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-slate-50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">เบอร์โทรศัพท์</p>
                  <p className="font-medium">{user.phone || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-slate-50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">วันที่ร่วมเป็นส่วนหนึ่ง</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString("th-TH", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Address Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-md border-primary/10">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <CardTitle className="text-xl">ข้อมูลที่อยู่ติดต่อ</CardTitle>
                <p className="text-xs text-muted-foreground font-normal mt-0.5">รายละเอียดสำหรับการจัดส่งเอกสารและหน้างาน</p>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">อาคาร / หมู่บ้าน</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground">บ้านเลขที่</p>
                        <p className="font-semibold text-foreground">{user.houseNo || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">หมู่บ้าน</p>
                        <p className="font-semibold text-foreground">{user.village || "-"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold text-slate-400 tracking-widest mb-1">ถนน</p>
                    <p className="font-semibold text-foreground">{user.road || "-"}</p>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">เขตพื้นที่</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                      <span className="text-sm text-muted-foreground">ตำบล / แขวง</span>
                      <span className="font-semibold">{user.subDistrict || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                      <span className="text-sm text-muted-foreground">อำเภอ / เขต</span>
                      <span className="font-semibold">{user.district || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">จังหวัด</span>
                      <span className="font-semibold text-primary">{user.province || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {user.address && (
                <div className="mt-8 p-4 rounded-lg bg-amber-50/50 border border-amber-100 flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0 mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  <div>
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">ที่อยู่ที่ระบุไว้เดิม</p>
                    <p className="text-sm text-amber-700 font-medium leading-relaxed italic">
                      "{user.address}"
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="font-bold text-indigo-900 text-lg">ต้องการความช่วยเหลือ?</h3>
              <p className="text-indigo-700/80 text-sm">หากคุณพบข้อมูลไม่ถูกต้องหรือต้องการเปลี่ยนแปลงเอกสารสำคัญ กรุณาติดต่อเราได้ทันทีค่ะ</p>
            </div>
            <Button variant="outline" className="bg-white hover:bg-white/80 border-indigo-200 text-indigo-600 font-semibold px-6 shadow-sm whitespace-nowrap" asChild>
              <Link href="/contact">ติดต่อเรา</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
