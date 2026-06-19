"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export function QuotationActions({ quotationId }: { quotationId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<"approve" | null>(null)

  const handleAction = async (action: "approve") => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะ${action === "approve" ? "ส่ง" : "ปฏิเสธการว่าจ้าง"}สำหรับใบเสนอราคานี้?`)) return

    setIsLoading(action)
    try {
      const res = await fetch(`/api/admin/quotations/${quotationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "proposed" : "rejected" }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleAction("approve")} disabled={isLoading !== null}>
        {isLoading === "approve" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-2" />
        )}
        ส่งใบเสนอราคา
      </Button>
    </div>
  )
}
