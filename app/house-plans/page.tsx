import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HousePlanCard } from "@/components/house-plan-card"
import { housePlans } from "@/lib/data"

export const metadata = {
  title: "แบบบ้าน | บ้านสร้างฝัน",
  description: "รวมแบบบ้านสำเร็จรูปหลากหลายสไตล์ ราคาคุ้มค่า พร้อมปรับแต่งตามความต้องการ",
}

export default function HousePlansPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">แบบบ้านสำเร็จรูป</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                เลือกแบบบ้านที่ถูกใจจากคอลเลกชันของเรา พร้อมปรับแต่งตามความต้องการ
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {housePlans.map((plan) => (
                <HousePlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
