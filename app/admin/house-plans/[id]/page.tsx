"use client"

import React, { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { HousePlanForm } from "@/components/admin/house-plan-form"
import { Loader2 } from "lucide-react"
import type { HousePlan } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditHousePlanPage({ params }: PageProps) {
  const { id } = React.use(params)
  const [housePlan, setHousePlan] = useState<HousePlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`/api/admin/house-plans/${id}`)
        const data = await res.json()
        if (data.plan) {
          setHousePlan(data.plan)
        }
      } catch (error) {
        console.error("Error fetching house plan:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlan()
  }, [id])

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

  if (!housePlan) {
    return <div>ไม่พบข้อมูลแบบบ้าน</div>
  }

  return <HousePlanForm initialData={housePlan} mode="edit" />
}
