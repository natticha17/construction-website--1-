import { PencilRuler, Home, PlusCircle, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    title: "ออกแบบบ้าน",
    description: "ออกแบบบ้านตามความต้องการ พร้อมแบบก่อสร้างครบชุด โดยสถาปนิกมืออาชีพ",
    icon: PencilRuler,
  },
  {
    title: "ก่อสร้างบ้าน",
    description: "รับสร้างบ้านครบวงจร ตั้งแต่วางฐานรากจนถึงส่งมอบบ้าน ควบคุมงานโดยวิศวกร",
    icon: Home,
  },
  {
    title: "ต่อเติมบ้าน",
    description: "ต่อเติมพื้นที่ใช้สอย เพิ่มห้อง ขยายครัว ตามความต้องการ งานคุณภาพ",
    icon: PlusCircle,
  },
  {
    title: "รีโนเวทบ้าน",
    description: "ปรับปรุงบ้านเก่าให้ใหม่ เปลี่ยนโฉมบ้านในฝัน ตรงตามสไตล์ที่ต้องการ",
    icon: RefreshCw,
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">บริการของเรา</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">บริการรับเหมาก่อสร้างครบวงจร</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            เรามีบริการครบทุกความต้องการด้านการก่อสร้าง ตั้งแต่ออกแบบ สร้างใหม่ ต่อเติม และรีโนเวท
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow border-none bg-card">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
