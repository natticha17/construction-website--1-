import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "ติดต่อเรา | บ้านสร้างฝัน",
  description: "ติดต่อสอบถามข้อมูลหรือขอใบเสนอราคาจากบ้านสร้างฝัน บริการรับเหมาก่อสร้างครบวงจร",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">ติดต่อเรา</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">พร้อมให้คำปรึกษาและตอบทุกคำถามเกี่ยวกับการสร้างบ้าน</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">ช่องทางการติดต่อ</h2>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">โทรศัพท์</h3>
                        <p className="text-muted-foreground">02-XXX-XXXX</p>
                        <p className="text-muted-foreground">08X-XXX-XXXX</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">อีเมล</h3>
                        <p className="text-muted-foreground">contact@baansangfun.com</p>
                        <p className="text-muted-foreground">info@baansangfun.com</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">ที่อยู่</h3>
                        <p className="text-muted-foreground">
                          123 ถนนพหลโยธิน แขวงจตุจักร
                          <br />
                          เขตจตุจักร กรุงเทพฯ 10900
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">เวลาทำการ</h3>
                        <p className="text-muted-foreground">จันทร์ - เสาร์: 08:00 - 18:00</p>
                        <p className="text-muted-foreground">อาทิตย์: 09:00 - 15:00</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
