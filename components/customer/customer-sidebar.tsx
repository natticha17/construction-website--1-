"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FileText, FileSignature, TrendingUp, LogOut, Building2, User, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
  { href: "/customer/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/customer/quotations", label: "ใบเสนอราคา", icon: FileText },
  { href: "/customer/contracts", label: "สัญญา", icon: FileSignature },
  { href: "/customer/progress", label: "ความคืบหน้า", icon: TrendingUp },
  { href: "/customer/profile", label: "โปรไฟล์", icon: User },
  { href: "/", label: "ไปยังหน้าเว็บไซต์", icon: Globe, external: true },
]

export function CustomerSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/customer/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-card border-r flex flex-col">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Piak House Construction</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              item.external
                ? "text-blue-600 hover:bg-blue-50"
                : pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          ออกจากระบบ
        </Button>
      </div>
    </aside>
  )
}
