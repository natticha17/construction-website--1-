"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"
import type { HousePlan } from "@/lib/data"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditHousePlanPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Omit<HousePlan, "id">>({
    name: "",
    image: "",
    area: "",
    bedrooms: 0,
    bathrooms: 0,
    price: "",
    description: "",
    features: [""],
  })

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/admin/house-plans/${id}`)
        const data = await response.json()
        if (data.plan) {
          setFormData({
            ...data.plan,
            features: data.plan.features.length ? data.plan.features : [""],
          })
        }
      } catch (error) {
        console.error("Error fetching house plan:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlan()
  }, [id])

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] })
  }

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures.length ? newFeatures : [""] })
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/house-plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter((f) => f.trim()),
        }),
      })

      if (response.ok) {
        router.push("/admin/house-plans")
      }
    } catch (error) {
      console.error("Error updating house plan:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="แก้ไขแบบบ้าน" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="แก้ไขแบบบ้าน" />

      <div className="flex-1 p-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/admin/house-plans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับ
          </Link>
        </Button>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>ข้อมูลแบบบ้าน</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อแบบบ้าน *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น บ้านสไตล์โมเดิร์น A1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL รูปภาพ</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">พื้นที่ (ตร.ม.) *</Label>
                  <Input
                    id="area"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="เช่น 150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">ราคา (บาท) *</Label>
                  <Input
                    id="price"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="เช่น 2,500,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">จำนวนห้องนอน *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    required
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">จำนวนห้องน้ำ *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    required
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">รายละเอียด *</Label>
                <Textarea
                  id="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="บรรยายรายละเอียดแบบบ้าน"
                />
              </div>

              <div className="space-y-2">
                <Label>คุณสมบัติเด่น</Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="เช่น ห้องนั่งเล่นกว้าง"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveFeature(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                    <Plus className="mr-2 h-4 w-4" />
                    เพิ่มคุณสมบัติ
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    "บันทึกการเปลี่ยนแปลง"
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/house-plans">ยกเลิก</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
