"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const transparentPaths = ["/", "/house-plans", "/contact", "/projects"]
  const isTransparentPage = transparentPaths.includes(pathname)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Check if customer is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setIsLoggedIn(true)
          setUserName(data.user.name)
          setUserRole(data.user.role)
        }
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setIsLoggedIn(false)
      setUserName("")
      window.location.href = "/"
    } catch (err) {
      console.error("Logout error:", err)
      window.location.reload()
    }
  }

  const headerIsTransparent = isTransparentPage && !isScrolled

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${headerIsTransparent
        ? "bg-black/10 backdrop-blur-sm border-b-2 border-primary/30 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] shadow-primary/5"
        : "border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-md"
        }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 ">
          <Building2 className={`h-8 w-8 transition-colors ${headerIsTransparent ? "text-white" : "text-primary"}`} />
          <span className={`text-xl font-bold transition-colors ${headerIsTransparent ? "text-white" : "text-foreground"}`}>Piak House Construction</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-base font-medium transition-all group relative py-1 ${headerIsTransparent ? "text-white drop-shadow-md" : "text-muted-foreground hover:text-primary"
              }`}
          >
            หน้าแรก
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${pathname === "/" ? "scale-x-100" : ""}`} />
          </Link>
          <Link
            href="/house-plans"
            className={`text-base font-medium transition-all group relative py-1 ${headerIsTransparent ? "text-white drop-shadow-md" : "text-muted-foreground hover:text-primary"
              }`}
          >
            แบบบ้าน
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${pathname === "/house-plans" ? "scale-x-100" : ""}`} />
          </Link>
          <Link
            href="/projects"
            className={`text-base font-medium transition-all group relative py-1 ${headerIsTransparent ? "text-white drop-shadow-md" : "text-muted-foreground hover:text-primary"
              }`}
          >
            ผลงานของเรา
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${pathname === "/projects" ? "scale-x-100" : ""}`} />
          </Link>
          <Link
            href="/contact"
            className={`text-base font-medium transition-all group relative py-1 ${headerIsTransparent ? "text-white drop-shadow-md" : "text-muted-foreground hover:text-primary"
              }`}
          >
            ติดต่อเรา
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${pathname === "/contact" ? "scale-x-100" : ""}`} />
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`gap-2 bg-transparent transition-colors ${headerIsTransparent ? "text-white border-white/30 hover:bg-white/10" : "bg-transparent"
                    }`}
                >
                  <User className="h-4 w-4" />
                  {userName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {userRole === "admin" ? (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">แผงควบคุมแอดมิน</Link>
                  </DropdownMenuItem>
                ) : (
                  <>
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
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                asChild
                className={`transition-colors ${headerIsTransparent ? "bg-transparent border-white/30 text-white hover:bg-white/10" : ""
                  }`}
              >
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button asChild className="shadow-lg hover:shadow-primary/25">
                <Link href="/customer/register">สมัครสมาชิก</Link>
              </Button>
            </div>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden transition-colors ${headerIsTransparent && !isMenuOpen ? "text-white" : "text-foreground"}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
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
              href="/projects"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              ผลงานของเรา
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
                  href={userRole === "admin" ? "/admin" : "/customer/dashboard"}
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {userRole === "admin" ? "แผงควบคุมแอดมิน" : "แดชบอร์ดผู้ใช้"}
                </Link>
                <Button variant="destructive" onClick={handleLogout} className="w-full">
                  ออกจากระบบ
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
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
