"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { HousePlan } from "@/lib/types"

export default function RequestQuotationPage() {
  const router = useRouter()
  const [housePlans, setHousePlans] = useState<HousePlan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    housePlanId: "",
    area: "",
    budget: "",
    materialType: "มาตรฐาน",
    additionalRequirements: "",
  })

  useEffect(() => {
    fetch("/api/house-plans")
      .then((res) => res.json())
      .then((data) => setHousePlans(data.housePlans))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/customer/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/customer/quotations/${data.quotation.id}`)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlan = housePlans.find((p) => p.id === formData.housePlanId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/customer/quotations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">ขอใบเสนอราคาเบื้องต้น</h1>
          <p className="text-muted-foreground">กรอกข้อมูลเพื่อรับใบเสนอราคาประมาณการ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>เลือกแบบบ้าน</CardTitle>
              <CardDescription>เลือกแบบบ้านที่คุณสนใจ</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.housePlanId}
                onValueChange={(value) => {
                  const plan = housePlans.find((p) => p.id === value)
                  setFormData({
                    ...formData,
                    housePlanId: value,
                    area: plan?.area || "",
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกแบบบ้าน" />
                </SelectTrigger>
                <SelectContent>
                  {housePlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - {plan.area} ตร.ม.
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPlan && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <img
                    src={selectedPlan.image || "/placeholder.svg"}
                    alt={selectedPlan.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold">{selectedPlan.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>{selectedPlan.bedrooms} ห้องนอน</span>
                    <span>{selectedPlan.bathrooms} ห้องน้ำ</span>
                    <span>{selectedPlan.area} ตร.ม.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลความต้องการ</CardTitle>
              <CardDescription>ระบุรายละเอียดเพิ่มเติม</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="area">พื้นที่ใช้สอย (ตร.ม.)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="เช่น 150"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">งบประมาณ (บาท)</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="เช่น 2,500,000"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>ระดับวัสดุ</Label>
                <RadioGroup
                  value={formData.materialType}
                  onValueChange={(value) => setFormData({ ...formData, materialType: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ประหยัด" id="economy" />
                    <Label htmlFor="economy" className="font-normal cursor-pointer">
                      ประหยัด
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="มาตรฐาน" id="standard" />
                    <Label htmlFor="standard" className="font-normal cursor-pointer">
                      มาตรฐาน
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="พรีเมียม" id="premium" />
                    <Label htmlFor="premium" className="font-normal cursor-pointer">
                      พรีเมียม
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">ความต้องการเพิ่มเติม</Label>
                <Textarea
                  id="requirements"
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                  placeholder="เช่น ต้องการเพิ่มห้องเก็บของ, ต้องการสระว่ายน้ำ..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading || !formData.housePlanId}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ขอใบเสนอราคา
          </Button>
        </div>
      </form>
    </div>
  )
}
