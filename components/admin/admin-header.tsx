"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AdminHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  showBackButton?: boolean
  backHref?: string
}

export function AdminHeader({ title, description, children, showBackButton, backHref }: AdminHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <header className="bg-card border-b border-border px-8 py-6 print:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mr-4 gap-2 px-2 hover:bg-muted bg-primary text-primary-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium text-primary-foreground">กลับ</span>
            </Button>
          )}
          <div className="text-right sm:text-left">
            <h1 className="text-2xl font-bold text-card-foreground">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    </header>
  )
}
