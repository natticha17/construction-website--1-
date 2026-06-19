"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building2,
  Home,
  FileText,
  Users,
  LogOut,
  ClipboardList,
  FileSignature,
  TrendingUp,
  Wallet,
  Globe,
  Inbox,
  Images,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "แดชบอร์ด", icon: Home },
  { href: "/admin/house-plans", label: "จัดการแบบบ้าน", icon: FileText },
  { href: "/admin/showcase", label: "จัดการผลงาน", icon: Images },
  { href: "/admin/customers", label: "จัดการลูกค้า", icon: Users },
  { href: "/admin/inquiries", label: "ข้อความ", icon: Inbox },
  { href: "/admin/quotations", label: "ใบเสนอราคา", icon: ClipboardList },
  { href: "/admin/contracts", label: "สัญญา", icon: FileSignature },
  { href: "/admin/progress", label: "ความคืบหน้าโครงการ", icon: TrendingUp },
  { href: "/admin/finance", label: "รายรับ-รายจ่าย", icon: Wallet },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col print:hidden">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Admin</span>
        </Link>
      </div>



      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm",
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          asChild
        >
          <Link href="/" target="_blank">
            <Globe className="mr-3 h-5 w-5 text-blue-400" />
            ไปหน้าเว็บไซต์
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          ออกจากระบบ
        </Button>
      </div>
    </aside>
  )
}
