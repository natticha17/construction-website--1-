import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">พร้อมเริ่มต้นโครงการของคุณ?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          ติดต่อเราวันนี้เพื่อรับคำปรึกษาฟรี และใบเสนอราคาที่ตรงกับความต้องการของคุณ
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact">ติดต่อเรา</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="tel:0810563522">
              <Phone className="mr-2 h-5 w-5" />
              โทร 0810563522
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
