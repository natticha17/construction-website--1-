import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BedDouble, Bath, Maximize } from "lucide-react"
import type { HousePlan } from "@/lib/data"

interface HousePlanCardProps {
  plan: HousePlan
}

export function HousePlanCard({ plan }: HousePlanCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={plan.image || "/placeholder.svg"}
          alt={plan.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{plan.price} บาท</Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{plan.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            {plan.area} ตร.ม.
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            {plan.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {plan.bathrooms}
          </span>
        </div>
        <Button asChild className="w-full">
          <Link href={`/house-plans/${plan.id}`}>ดูรายละเอียด</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
