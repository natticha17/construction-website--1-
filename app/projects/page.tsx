import Link from "next/link"
import { store } from "@/lib/store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Camera, ArrowRight, Home, Ruler } from "lucide-react"
import { formatPriceToMillion } from "@/lib/utils"

export default async function ProjectsPage() {
    const projects = await store.getShowcaseProjects()

    return (
        <div className="flex flex-col min-h-screen bg-[#FAFAF9]">
            <Header />

            <main className="flex-1">
                {/* Hero Section - Minimal & Premium */}
                <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20 bg-[#1C1917]">
                    <div className="absolute inset-0 bg-[#0C0A09]">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF9] via-[#1C1917]/80 to-[#1C1917]/90" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center pb-20">
                        <div className="inline-flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="h-px w-8 bg-primary/60" />
                            <p className="text-primary font-medium text-xs md:text-sm uppercase tracking-[0.3em]">Our Masterpieces</p>
                            <div className="h-px w-8 bg-primary/60" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 font-serif">
                            <span className="text-primary">ผลงานของเรา</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#A8A29E] leading-relaxed max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            รวมภาพความสำเร็จจากสถานที่ก่อสร้างจริง ที่เราใส่ใจในทุกรายละเอียด<br className="hidden md:block" />เพื่อส่งมอบบ้านที่สมบูรณ์แบบที่สุดให้กับคุณ
                        </p>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="pb-32 -mt-12 relative z-20 px-4">
                    <div className="container mx-auto">
                        {projects.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[40px] shadow-xl border border-[#E7E5E4]">
                                <Camera className="h-20 w-20 text-[#E7E5E4] mx-auto mb-6" />
                                <h3 className="text-2xl font-semibold text-[#4A4540] mb-3">กำลังรวบรวมข้อมูลผลงาน</h3>
                                <p className="text-[#8C8379] max-w-md mx-auto">ทางเรากำลังถ่ายทำและรวบรวมภาพบ้านจริงที่ก่อสร้างแล้วเสร็จ เพื่อนำมาแบ่งปันแรงบันดาลใจให้คุณเร็วๆ นี้</p>
                            </div>
                        ) : (
                            <div className="grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {projects.map((project, index) => (
                                    <Link key={project.id} href={`/projects/${project.id}`} className="group block h-full">
                                        <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl shadow-black/5 hover:shadow-black/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                                            {/* Image Area - Landscape for Housing */}
                                            <div className="relative aspect-video overflow-hidden bg-[#F5F5F4]">
                                                {project.images && project.images.length > 0 ? (
                                                    <img
                                                        src={project.images[0]}
                                                        alt={project.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Camera className="h-12 w-12 text-[#D6D3D1]" />
                                                    </div>
                                                )}

                                                {/* Overlay on hover */}
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                {/* Badge */}
                                                <div className="absolute top-6 left-6">
                                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                                        <MapPin className="h-3 w-3 text-primary" />
                                                        <span className="text-xs font-bold text-[#1C1917] tracking-wider uppercase">{project.location || "BANGKOK"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details Content */}
                                            <div className="p-8 md:p-10 flex flex-col flex-1 relative">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-2xl md:text-3xl font-bold text-[#1C1917] group-hover:text-primary transition-colors duration-300 font-serif leading-tight">
                                                        {project.name}
                                                    </h3>
                                                    <div className="bg-[#F5F5F4] p-3 rounded-full text-[#1C1917] group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:rotate-[-45deg]">
                                                        <ArrowRight className="h-5 w-5" />
                                                    </div>
                                                </div>

                                                <p className="text-[#78716C] line-clamp-2 mb-8 font-light leading-relaxed">
                                                    {project.description || "บ้านพักอาศัยที่ได้รับการออกแบบและก่อสร้างด้วยความใส่ใจในทุกรายละเอียด..."}
                                                </p>

                                                <div className="mt-auto pt-6 border-t border-[#F5F5F4]">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] uppercase tracking-widest text-[#8C8379] font-bold">งบประมาณก่อสร้าง</p>
                                                            <div className="flex items-baseline gap-1 bg-primary/5 px-3 py-1 rounded-lg w-fit">
                                                                <span className="text-2xl font-bold text-primary drop-shadow-sm">
                                                                    {project.price ? formatPriceToMillion(project.price) : "-"}
                                                                </span>
                                                                <span className="text-xs font-semibold text-primary/80">ล้านบาท</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right space-y-1">
                                                            <p className="text-[10px] uppercase tracking-widest text-[#8C8379] font-bold">พื้นที่ใช้สอย</p>
                                                            <div className="flex items-baseline justify-end gap-1">
                                                                <span className="text-xl font-bold text-[#1C1917]">
                                                                    {project.area || "-"}
                                                                </span>
                                                                <span className="text-xs font-medium text-[#78716C]">ตร.ม.</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F4]/50">
                                                        <div className="flex items-center gap-2 text-[#A8A29E]">
                                                            <Calendar className="h-4 w-4" />
                                                            <span className="text-sm">
                                                                {project.completionDate ? new Date(project.completionDate).toLocaleDateString("th-TH", { month: "short", year: "numeric", day: "numeric" }) : "เร็วๆ นี้"}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-medium text-primary underline decoration-1 underline-offset-4 hover:text-[#1C1917] transition-all">
                                                            ดูรายละเอียด
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Refined CTA section */}
                <section className="py-28 bg-[#1C1917] relative overflow-hidden">
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <Home className="h-12 w-12 text-primary mx-auto mb-6 opacity-80" />
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">สร้างบ้านในฝัน<span className="text-primary">กับเรา</span></h2>
                        <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto font-light">
                            เริ่มต้นโครงการบ้านของคุณวันนี้ ปรึกษาผู้เชี่ยวชาญของเราได้ฟรี ไม่มีค่าใช้จ่าย
                        </p>
                        <Button size="lg" className="h-16 px-12 rounded-full text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1" asChild>
                            <Link href="/contact">ติดต่อเรา</Link>
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
