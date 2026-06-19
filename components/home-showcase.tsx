import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Calendar, Camera } from "lucide-react"
import { store } from "@/lib/store"
import { formatPriceToMillion } from "@/lib/utils"

export async function HomeShowcase() {
    const projects = await store.getShowcaseProjects()
    const featured = projects.slice(0, 3)

    if (featured.length === 0) return null

    return (
        <section className="pb-24 pt-0 bg-[#FAF9F6] relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#B5A48F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px w-8 bg-primary" />
                            <p className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Our Works</p>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#4A4540] leading-tight">
                            ผลงาน<span className="text-primary">ก่อสร้างจริง</span>
                        </h2>
                    </div>

                    <Button
                        variant="ghost"
                        asChild
                        className="mt-8 md:mt-0 text-[#4A4540] hover:text-primary hover:bg-transparent transition-all duration-300 group px-0 border-b-2 border-primary/20 hover:border-primary h-auto pb-2 rounded-none"
                    >
                        <Link href="/projects" className="flex items-center gap-2 text-lg font-medium">
                            ดูผลงานทั้งหมด
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featured.map((project, index) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="group block h-full animate-in fade-in slide-in-from-bottom duration-1000"
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            <div className="bg-white rounded-[24px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col border border-black/5">
                                {/* Image Area */}
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

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Badge */}
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                            <MapPin className="h-3 w-3 text-primary" />
                                            <span className="text-[10px] font-bold text-[#1C1917] tracking-wider uppercase">{project.location || "THAILAND"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Content */}
                                <div className="p-6 md:p-8 flex flex-col flex-1 relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl md:text-2xl font-bold text-[#1C1917] group-hover:text-primary transition-colors duration-300 font-serif leading-tight line-clamp-2">
                                            {project.name}
                                        </h3>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-black/5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] uppercase tracking-widest text-[#8C8379] font-bold">งบประมาณ</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-primary">
                                                    {project.price ? formatPriceToMillion(project.price) : "-"}
                                                </span>
                                                <span className="text-[10px] font-medium text-[#8C8379]">ล้านบาท</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] uppercase tracking-widest text-[#8C8379] font-bold">แล้วเสร็จ</p>
                                            <div className="flex items-center gap-2 text-[#6B635B]">
                                                <Calendar className="h-3 w-3" />
                                                <span className="text-xs">
                                                    {project.completionDate ? new Date(project.completionDate).toLocaleDateString("th-TH", { month: "short", year: "2-digit" }) : "-"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
