import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HousePlanCard } from "@/components/house-plan-card"
import { store } from "@/lib/store"
import { HousePlanFilters } from "@/components/house-plan-filters"
import { Maximize } from "lucide-react"

export const metadata = {
  title: "แบบบ้าน | Piak House Construction",
  description: "รวมแบบบ้านสำเร็จรูปหลากหลายสไตล์ ราคาคุ้มค่า พร้อมปรับแต่งตามความต้องการ",
}

export default async function HousePlansPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; style?: string }>
}) {
  const { type, style } = await searchParams
  const allPlans = await store.getHousePlans()

  // Fetch types and styles from DB to ensure sync with Admin
  await store.connect()
  const dbTypes = await import("@/models/HouseType").then(m => m.default.find().sort({ name: 1 }))
  const dbStyles = await import("@/models/HouseStyle").then(m => m.default.find().sort({ name: 1 }))

  const availableTypes = ["all", ...dbTypes.map(t => t.name)]
  const availableStyles = ["all", ...dbStyles.map(s => s.name)]

  // Filter plans based on search params
  const filteredPlans = allPlans.filter((plan) => {
    if (type && plan.type !== type) return false
    if (style && plan.style !== style) return false
    return true
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
          {/* Background Image with Darker Overlay */}
          <div className="absolute inset-0 bg-[#1C1917]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay grayscale"
              style={{ backgroundImage: "url('/uploads/112.avif')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917]/50 via-[#1C1917]/30 to-[#1C1917]/80" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto animate-in fade-in zoom-in duration-1000">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-primary/60" />
                <span className="text-primary font-medium tracking-[0.2em] text-sm uppercase">Curated Collection</span>
                <div className="h-px w-8 bg-primary/60" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">แบบบ้านสำเร็จรูป</h1>
              <p className="text-[#A8A29E] text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-8">
                เลือกสรรแบบบ้านที่สะท้อนตัวตนของคุณ
                <br className="hidden sm:block" />
                ด้วยมาตรฐานที่เหนือระดับในทุกรายละเอียดแห่งการอยู่อาศัย
              </p>
            </div>

            <HousePlanFilters
              currentType={type}
              currentStyle={style}
              availableTypes={availableTypes}
              availableStyles={availableStyles}
            />
          </div>
        </section>

        <section className="py-20 bg-[#FAFAF9]">
          <div className="container mx-auto px-4">
            {filteredPlans.length === 0 ? (
              <div className="text-center text-[#8C8379] py-20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#B5A48F]/10 flex items-center justify-center">
                  <Maximize className="h-8 w-8 text-[#B5A48F]/40" />
                </div>
                <p className="text-lg font-light tracking-wide">ไม่มีแบบบ้านที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlans.map((plan) => (
                  <HousePlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
