import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { store } from "@/lib/store"
import { HousePlanCard } from "./house-plan-card"

export async function FeaturedProjects() {
  const allPlans = await store.getHousePlans()
  const featured = allPlans.slice(0, 3)

  if (featured.length === 0) return null

  return (
    <section className="py-24 pt-0 bg-[#FAF9F6] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#B5A48F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <p className="text-primary font-bold text-xs uppercase tracking-[0.3em]">แบบบ้านยอดนิยม</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#4A4540] leading-tight">
              ค้นพบต้นแบบ <br />
              <span className="text-primary">บ้านสำเร็จรูป</span> ที่ลงตัวที่สุด
            </h2>
          </div>

          <Button
            variant="ghost"
            asChild
            className="mt-8 md:mt-0 text-[#4A4540] hover:text-primary hover:bg-transparent transition-all duration-300 group px-0 border-b-2 border-primary/20 hover:border-primary h-auto pb-2 rounded-none"
          >
            <Link href="/house-plans" className="flex items-center gap-2 text-lg font-medium">
              ดูแบบบ้านทั้งหมด
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((plan, index) => (
            <div
              key={plan.id}
              className="animate-in fade-in slide-in-from-bottom duration-1000"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <HousePlanCard plan={plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
