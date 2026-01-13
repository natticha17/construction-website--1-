import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/modern-house-construction-site-professional.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/95 via-sidebar/80 to-sidebar/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <p className="text-primary font-medium mb-4 tracking-wide">บริการรับเหมาก่อสร้างครบวงจร</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sidebar-foreground mb-6 leading-tight text-balance">
            สร้างบ้านในฝัน
            <br />
            ด้วยทีมงานมืออาชีพ
          </h1>
          <p className="text-lg text-sidebar-foreground/80 mb-8 leading-relaxed">
            เราพร้อมให้บริการออกแบบและก่อสร้างบ้านตามความต้องการของคุณ ด้วยประสบการณ์กว่า 15 ปี การันตีคุณภาพงานและราคายุติธรรม
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/house-plans">
                ดูแบบบ้าน
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent border-sidebar-foreground/30 text-sidebar-foreground hover:bg-sidebar-foreground/10"
            >
              <Link href="/contact">ติดต่อเรา</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
