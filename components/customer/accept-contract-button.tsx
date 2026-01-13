"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"

export function AcceptContractButton({ contractId }: { contractId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะยอมรับสัญญานี้?")) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/customer/contracts/${contractId}/accept`, {
        method: "POST",
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAccept} disabled={isLoading} size="lg">
      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
      ยอมรับสัญญา
    </Button>
  )
}
