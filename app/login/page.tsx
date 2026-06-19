"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnifiedLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง")
                return
            }

            // Redirect based on role
            if (data.role === "admin") {
                window.location.href = "/admin"
            } else {
                window.location.href = "/customer/dashboard"
            }

        } catch {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/80 px-4 py-12 relative z-10">
            <Card className="w-full max-w-md shadow-2xl border-primary/10 overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardHeader className="text-center space-y-1 pt-8">
                    <Link href="/" className="flex justify-center mb-6 hover:opacity-80 transition-opacity">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg">
                                <Building2 className="h-8 w-8" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Piak House Construction</span>
                        </div>
                    </Link>
                    <CardTitle className="text-2xl font-bold">เข้าสู่ระบบ</CardTitle>
                    <CardDescription>
                        ยินดีต้อนรับกลับมา! กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 animate-in fade-in slide-in-from-top-1 px-4">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">อีเมล</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 focus-visible:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">รหัสผ่าน</Label>
                                <Link href="#" className="text-xs text-primary hover:underline">ลืมรหัสผ่าน?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 focus-visible:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        
                    </CardContent>

                    <CardFooter className="pt-5 flex flex-col gap-4 pb-8">
                        <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    กำลังตรวจสอบสิทธิ์...
                                </>
                            ) : (
                                <>
                                    เข้าสู่ระบบ
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <div className="relative w-full py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">หรือ</span>
                            </div>
                        </div>

                        <div className="text-center space-y-3">
                            <p className="text-sm text-muted-foreground">
                                ยังไม่มีบัญชีลูกค้า?{" "}
                                <Link href="/customer/register" className="text-primary font-semibold hover:underline decoration-2">
                                    สมัครสมาชิกใหม่
                                </Link>
                            </p>

                            <div className="pt-2">
                                <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 group">
                                    <ArrowRight className="h-3 w-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                    กลับเข้าสู่หน้าเว็บไซต์หลัก
                                </Link>
                            </div>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
