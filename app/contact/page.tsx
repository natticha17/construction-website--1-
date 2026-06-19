import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { COMPANY_INFO } from "@/lib/constants"

export const metadata = {
  title: "ติดต่อเรา | Piak House Construction",
  description: "ติดต่อสอบถามข้อมูลหรือขอใบเสนอราคาจาก Piak House Construction บริการรับเหมาก่อสร้างครบวงจร",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/house-design.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom duration-700">ติดต่อเรา</h1>
            <p className="text-gray-200 max-w-2xl mx-auto text-lg animate-in fade-in slide-in-from-bottom delay-100 duration-700">
              พร้อมให้คำปรึกษาและตอบทุกคำถามเกี่ยวกับการสร้างบ้าน
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="animate-in fade-in slide-in-from-left duration-700 delay-200">
                <h2 className="text-2xl font-bold text-foreground mb-6">ช่องทางการติดต่อ</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="flex flex-col items-center text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-card-foreground mb-1">โทรศัพท์</h3>
                      <p className="text-muted-foreground text-sm">{COMPANY_INFO.phone}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="flex flex-col items-center text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-card-foreground mb-1">อีเมล</h3>
                      <p className="text-muted-foreground text-sm">{COMPANY_INFO.email}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="flex flex-col items-center text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-card-foreground mb-1">Line ID</h3>
                      <p className="text-muted-foreground text-sm">{COMPANY_INFO.lineId}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-card-foreground mb-1">ที่อยู่</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {COMPANY_INFO.address}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-right duration-700 delay-300">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
