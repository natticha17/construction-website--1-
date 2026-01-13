"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Building2, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Check if customer is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/customer/me")
        if (res.ok) {
          const data = await res.json()
          setIsLoggedIn(true)
          setUserName(data.user.name)
        }
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/customer/logout", { method: "POST" })
    setIsLoggedIn(false)
    setUserName("")
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">บ้านสร้างฝัน</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            หน้าแรก
          </Link>
          <Link
            href="/house-plans"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            แบบบ้าน
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            ติดต่อเรา
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <User className="h-4 w-4" />
                  {userName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/customer/dashboard">แดชบอร์ด</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/customer/quotations">ใบเสนอราคา</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/customer/contracts">สัญญา</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/customer/progress">ความคืบหน้า</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/customer/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button asChild>
                <Link href="/customer/register">สมัครสมาชิก</Link>
              </Button>
            </div>
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              หน้าแรก
            </Link>
            <Link
              href="/house-plans"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              แบบบ้าน
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              ติดต่อเรา
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/customer/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  แดชบอร์ด
                </Link>
                <Button variant="destructive" onClick={handleLogout} className="w-full">
                  ออกจากระบบ
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/customer/login" onClick={() => setIsMenuOpen(false)}>
                    เข้าสู่ระบบ
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/customer/register" onClick={() => setIsMenuOpen(false)}>
                    สมัครสมาชิก
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
