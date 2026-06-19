import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BedDouble, Bath, Maximize, Check, ArrowLeft, Sofa, ChefHat, CarFront } from "lucide-react"
import { store } from "@/lib/store"
import { formatPriceToMillion } from "@/lib/utils"
import { FloorPlanGallery } from "@/components/floor-plan-gallery"
import { cookies } from "next/headers"

interface PageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 0

export async function generateStaticParams() {
  const plans = await store.getHousePlans()
  return plans.map((plan) => ({
    id: plan.id,
  }))
}

export default async function HousePlanDetailPage({ params }: PageProps) {
  const { id } = await params
  const plan = await store.getHousePlan(id)

  if (!plan) {
    notFound()
  }

  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has("customer_id")
  const requestUrl = isLoggedIn
    ? `/customer/quotations/request?planId=${plan.id}`
    : `/customer/register?redirect=/customer/quotations/request?planId=${plan.id}`

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Link
            href="/house-plans"
            className="inline-flex items-center gap-2 text-[#78716C] hover:text-primary transition-colors mb-8 w-fit group"
          >
            <div className="bg-[#F5F5F4] p-2 rounded-full group-hover:bg-primary/10 transition-all">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-lg font-medium tracking-wide">ย้อนกลับไปหน้าแบบบ้าน</span>
          </Link>
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            <div>
              <div className="relative h-[400px] lg:h-[500px] rounded-[32px] overflow-hidden shadow-2xl mb-6">
                <Image src={plan.image || "/placeholder.svg"} alt={plan.name} fill className="object-cover" />
              </div>

              {/* Floor Plans directly under main image */}
              {plan.floorPlanImages && plan.floorPlanImages.length > 0 && (
                <FloorPlanGallery images={plan.floorPlanImages} planName={plan.name} />
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {plan.style || "Modern Style"}
                </Badge>
                <div className="h-px w-8 bg-primary/20 md:block hidden" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Model: {plan.name}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-6 font-serif tracking-tight leading-tight">
                {plan.name}
              </h1>

              {/* Enhanced Price Section */}
              <div className="mb-8 bg-[#FAFAF9] p-8 rounded-[24px] border border-[#E7E5E4] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
                <p className="text-xs font-bold text-[#8C8379] uppercase tracking-[0.2em] mb-3">ราคาเริ่มต้น</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl md:text-6xl font-bold text-primary drop-shadow-sm">
                    {formatPriceToMillion(plan.price)}
                  </span>
                  <span className="text-2xl font-bold text-[#1C1917]">ล้านบาท*</span>
                </div>
              </div>

              <p className="text-[#57534E] mb-8 leading-relaxed text-lg font-light">
                {plan.description}
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Maximize className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">พื้นที่ใช้สอย</p>
                    <p className="font-semibold text-foreground">{plan.area} ตร.ม.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BedDouble className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ห้องนอน</p>
                    <p className="font-semibold text-foreground">{plan.bedrooms} ห้อง</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bath className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ห้องน้ำ</p>
                    <p className="font-semibold text-foreground">{plan.bathrooms} ห้อง</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sofa className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ห้องรับแขก</p>
                    <p className="font-semibold text-foreground">{plan.livingRooms || 1} ห้อง</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ChefHat className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ห้องครัว</p>
                    <p className="font-semibold text-foreground">{plan.kitchens || 1} ห้อง</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CarFront className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ที่จอดรถ</p>
                    <p className="font-semibold text-foreground">{plan.parking || 1} คัน</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-[#1C1917] hover:bg-primary text-white px-10 h-14 rounded-full shadow-lg shadow-black/10 text-lg w-full sm:w-fit transition-all duration-300">
                  <Link href={requestUrl}>ขอใบเสนอราคา</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary/5 px-10 h-14 rounded-full text-lg w-full sm:w-fit">
                  <Link href="/contact">สนใจสอบถามข้อมูล</Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )

}

