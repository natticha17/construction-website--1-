import { Plus, Check } from "lucide-react"
import Image from "next/image"

const features = [
  {
    title: "รับเหมาก่อสร้าง",
    thaiTitle: "ให้บริการรับเหมาก่อสร้างบ้านและอาคารทุกประเภท ตั้งแต่บ้านพักอาศัย อาคารพาณิชย์ ไปจนถึงโครงการขนาดเล็กและขนาดกลาง",
    description: "ตรวจสอบมาตรฐานการก่อสร้างทุกขั้นตอนด้วยความประณีต",
  },
  {
    title: "ต่อเติมบ้าน",
    thaiTitle: "บริการต่อเติมและขยายพื้นที่ใช้สอย เพื่อรองรับความต้องการของผู้อยู่อาศัยที่เปลี่ยนไป",
    description: "ต่อเติมห้องนอน ห้องครัว ห้องน้ำ โรงจอดรถ ปรับโครงสร้างให้กลมกลืนกับบ้านเดิม",
  },
  {
    title: "รีโนเวทบ้าน",
    thaiTitle: "ปรับปรุงบ้านเก่าหรือพื้นที่เดิมให้กลับมาสวยงาม ทันสมัย และใช้งานได้อย่างมีประสิทธิภาพ",
    description: "รีโนเวททั้งภายในและภายนอก ปรับปรุงโครงสร้างให้แข็งแรงและสวยงาม",
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 bg-[#FAF9F6] relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full  -skew-x-12 transform translate-x-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* Left Side: Luxurious Image Framing */}
          <div className="lg:col-span-5 relative group">
            {/* Elegant Background Frame */}
            <div className="absolute -top-6 -left-6 w-full h-full border border-[#B5A48F]/30 rounded-sm translate-x-3 translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />

            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
              <Image
                src="/uploads/japan.jpg"
                alt="Minimal Japanese Style House"
                fill
                className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A4540]/20 to-transparent" />
            </div>
          </div>

          {/* Right Side: Sophisticated Content */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-[#4A4540] leading-tight">
                บริการของเรา
              </h2>
              <div className="w-90 h-1.5 bg-[#B5A48F] rounded-full" />

              <p className="text-lg text-[#6B635B] leading-relaxed max-w-2xl font-light">
                เราพร้อมให้บริการด้านงานก่อสร้างอย่างครบวงจร ด้วยทีมงานมืออาชีพและมาตรฐานคุณภาพในทุกขั้นตอน ตั้งแต่การวางแผน ออกแบบ ก่อสร้าง ไปจนถึงการดูแลหลังส่งมอบงาน
              </p>
            </div>

            {/* Refined Features List */}
            <div className="grid gap-8 pt-4 border-t border-[#D1C7BA]/30">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-6 group cursor-default">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#B5A48F]/30 flex items-center justify-center group-hover:bg-[#B5A48F] group-hover:border-[#B5A48F] transition-all duration-500">
                    <Check className="h-4 w-4 text-[#B5A48F] group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[30px] text-[#B5A48F] font-bold tracking-widest">{feature.title}</span>
                      <h4 className="text-xl font-medium text-[#4A4540]">{feature.thaiTitle}</h4>
                    </div>
                    <p className="text-[#8C8379] text-sm font-light leading-relaxed max-w-lg">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}