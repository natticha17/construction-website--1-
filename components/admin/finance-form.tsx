"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import type { ProjectProgress } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"

interface FinanceFormProps {
  projects: ProjectProgress[]
  initialProjectId?: string
}

const incomeCategories = [
  "เงินมัดจำงวดที่ 1",
  "เงินงวดที่ 2",
  "เงินงวดที่ 3",
  "เงินงวดที่ 4",
  "งานเพิ่มเติม",
  "อื่นๆ",
]

const expenseCategories = ["ค่าวัสดุ", "ค่าแรง", "ค่าขนส่ง", "ค่าเครื่องจักร", "ค่าน้ำ-ไฟ", "ค่าดำเนินการ", "อื่นๆ"]

export function FinanceForm({ projects, initialProjectId }: FinanceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<"income" | "expense">("income")
  const [projectId, setProjectId] = useState(initialProjectId || "")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [receiptImage, setReceiptImage] = useState("")

  const categories = type === "income" ? incomeCategories : expenseCategories
  const selectedProject = projects.find((p) => p.id === projectId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId || !category || !amount || !date) return

    setLoading(true)
    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          projectName: selectedProject?.projectName || "",
          type,
          category,
          description,
          amount: Number.parseFloat(amount),
          date,
          receiptImage: type === "expense" ? receiptImage : undefined,
        }),
      })

      if (res.ok) {
        router.push("/admin/finance")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to create record:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>บันทึกรายการใหม่</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-3">
            <Label>ประเภทรายการ</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => {
                setType(v as "income" | "expense")
                setCategory("")
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="text-green-600 font-medium">
                  รายรับ
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="text-red-600 font-medium">
                  รายจ่าย
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">โครงการ</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกโครงการ" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">หมวดหมู่</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">จำนวนเงิน (บาท)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">วันที่</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียดเพิ่มเติม</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="รายละเอียดของรายการ..."
              rows={3}
            />
          </div>

          {/* Receipt Image Upload (Expense Only) */}
          {type === "expense" && (
            <div className="space-y-2">
              <Label>รูปภาพใบเสร็จ</Label>
              <ImageUpload
                value={receiptImage ? [receiptImage] : []}
                onChange={(urls) => setReceiptImage(urls[urls.length - 1] || "")}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              บันทึก
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
