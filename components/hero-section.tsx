import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage: "url('/modern-house-construction-site-professional.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 ">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom duration-1000">
          <p className="text-primary font-medium mb-4 tracking-wide text-lg animate-in fade-in slide-in-from-bottom delay-100 duration-1000">
            บริการรับเหมาก่อสร้างครบวงจร
          </p>
          <h1 className="text-xl md:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance animate-in fade-in slide-in-from-bottom delay-200 duration-1000 drop-shadow-lg">
            Piak House Construction
            <br />
            ด้วย<span className="text-primary">ทีมงานมืออาชีพ</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom delay-300 duration-1000 max-w-xl">
            เราพร้อมให้บริการออกแบบและก่อสร้างบ้านตามความต้องการของคุณ ด้วยประสบการณ์กว่า 15 ปี การันตีคุณภาพงานและราคายุติธรรม
          </p>
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom delay-500 duration-1000">
            <Button size="lg" asChild className="text-lg px-8 py-6 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-primary/25">
              <Link href="/house-plans">
                ดูแบบบ้าน
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm"
            >
              <Link href="/contact">ติดต่อเรา</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
