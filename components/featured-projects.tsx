import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BedDouble, Bath, Maximize, ArrowRight } from "lucide-react"
import { housePlans } from "@/lib/data"

export function FeaturedProjects() {
  const featured = housePlans.slice(0, 3)

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-primary font-medium mb-2">แบบบ้านยอดนิยม</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">แบบบ้านสำเร็จรูป</h2>
          </div>
          <Button variant="outline" asChild className="mt-4 md:mt-0 bg-transparent">
            <Link href="/house-plans">
              ดูแบบบ้านทั้งหมด
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((plan) => (
            <Card key={plan.id} className="group overflow-hidden hover:shadow-xl transition-shadow">
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
                <h3 className="text-lg font-semibold text-card-foreground mb-3">{plan.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    {plan.area} ตร.ม.
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4" />
                    {plan.bedrooms} ห้องนอน
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {plan.bathrooms} ห้องน้ำ
                  </span>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/house-plans/${plan.id}`}>ดูรายละเอียด</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
