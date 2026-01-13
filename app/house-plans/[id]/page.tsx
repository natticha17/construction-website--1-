import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BedDouble, Bath, Maximize, Check, ArrowLeft } from "lucide-react"
import { housePlans } from "@/lib/data"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return housePlans.map((plan) => ({
    id: plan.id,
  }))
}

export default async function HousePlanDetailPage({ params }: PageProps) {
  const { id } = await params
  const plan = housePlans.find((p) => p.id === id)

  if (!plan) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/house-plans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้าแบบบ้าน
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
              <Image src={plan.image || "/placeholder.svg"} alt={plan.name} fill className="object-cover" />
            </div>

            <div>
              <Badge className="mb-4 bg-primary text-primary-foreground">{plan.price} บาท</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{plan.name}</h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">{plan.description}</p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Maximize className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">พื้นที่</p>
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
              </div>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-card-foreground mb-4">คุณสมบัติเด่น</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/contact">ขอใบเสนอราคา</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">สอบถามเพิ่มเติม</Link>
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
