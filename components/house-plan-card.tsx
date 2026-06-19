import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { formatPriceToMillion } from "@/lib/utils"
import type { HousePlan } from "@/lib/types"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HousePlanCardProps {
  plan: HousePlan
}

export function HousePlanCard({ plan }: HousePlanCardProps) {
  return (
    <Link href={`/house-plans/${plan.id}`} className="group block h-full">
      <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl shadow-black/5 hover:shadow-black/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col border border-[#E7E5E4]">
        {/* Image Area - Landscape */}
        <div className="relative aspect-video overflow-hidden bg-[#F5F5F4]">
          <Image
            src={plan.image || "/placeholder.svg"}
            alt={plan.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Details Content */}
        <div className="p-8 flex flex-col flex-1 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#1C1917] group-hover:text-primary transition-colors duration-300 font-serif leading-tight mb-1">
                {plan.name}
              </h3>
              <p className="text-xs uppercase tracking-widest text-primary font-bold">
                {plan.style || "Minimal Nordic Style"}
              </p>
            </div>
            <div className="bg-[#F5F5F4] p-3 rounded-full text-[#1C1917] group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:rotate-[-45deg]">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          <p className="text-[#78716C] line-clamp-2 mb-8 font-light leading-relaxed text-sm">
            {plan.description || "แบบบ้านที่ได้รับการออกแบบด้วยความใส่ใจในทุกรายละเอียด สะท้อนเอกลักษณ์และสไตล์การใช้ชีวิตที่เหนือระดับ..."}
          </p>

          <div className="mt-auto pt-6 border-t border-[#F5F5F4] flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-[#8C8379] font-bold">ราคาเริ่มต้น</p>
              <div className="flex items-baseline gap-1 bg-primary/5 px-3 py-1 rounded-lg w-fit">
                <span className="text-3xl font-bold text-primary drop-shadow-sm">
                  {formatPriceToMillion(plan.price)}
                </span>
                <span className="text-xs font-semibold text-primary/80">ล้านบาท</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-[#8C8379] font-bold">พื้นที่ใช้สอย</p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-bold text-[#1C1917]">
                  {plan.area}
                </span>
                <span className="text-xs font-medium text-[#78716C]">ตร.ม.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
