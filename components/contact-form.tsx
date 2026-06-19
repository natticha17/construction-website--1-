"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: "", email: "", message: "" })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-card-foreground mb-2">ส่งข้อความสำเร็จ!</h3>
          <p className="text-muted-foreground mb-4">ขอบคุณที่ติดต่อเรา เราจะติดต่อกลับโดยเร็วที่สุด</p>
          <Button onClick={() => setIsSubmitted(false)}>ส่งข้อความใหม่</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-xl mx-auto border-none shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">ส่งข้อความถึงเรา</CardTitle>
        <CardDescription>กรอกข้อมูลด้านล่างเพื่อติดต่อสอบถามหรือขอใบเสนอราคา</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
            <Input
              id="name"
              required
              className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="กรุณากรอกชื่อ-นามสกุล"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">รายละเอียดที่ต้องการสอบถาม *</Label>
            <Textarea
              id="message"
              required
              rows={5}
              className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="กรุณาระบุรายละเอียดที่ต้องการสอบถาม เช่น แบบบ้านที่สนใจ งบประมาณ พื้นที่ก่อสร้าง ฯลฯ"
            />
          </div>
          <Button type="submit" className="w-full text-lg py-6 shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังส่ง...
              </>
            ) : (
              "ส่งข้อความ"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
