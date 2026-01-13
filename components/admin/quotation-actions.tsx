"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export function QuotationActions({ quotationId }: { quotationId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null)

  const handleAction = async (action: "approve" | "reject") => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะ${action === "approve" ? "อนุมัติ" : "ไม่อนุมัติ"}ใบเสนอราคานี้?`)) return

    setIsLoading(action)
    try {
      const res = await fetch(`/api/admin/quotations/${quotationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
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
      <Button variant="outline" onClick={() => handleAction("reject")} disabled={isLoading !== null}>
        {isLoading === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
        ไม่อนุมัติ
      </Button>
      <Button onClick={() => handleAction("approve")} disabled={isLoading !== null}>
        {isLoading === "approve" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-2" />
        )}
        อนุมัติ
      </Button>
    </div>
  )
}
