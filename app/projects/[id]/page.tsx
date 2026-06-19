import { store } from "@/lib/store"
import { formatPriceToMillion } from "@/lib/utils"
import Image from "next/image"
import { FloorPlanGallery } from "@/components/floor-plan-gallery"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, MapPin, BedDouble, Bath, Ruler, Calendar, ArrowRight, Home, Sofa, ChefHat } from "lucide-react"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const project = await store.getShowcaseProject(id)

    if (!project) {
        notFound()
    }

    // Find linked house plan if any
    const plan = project.housePlanId ? await store.getHousePlan(project.housePlanId) : null
    const heroImage = project.images && project.images.length > 0 ? project.images[0] : null

    // Remaining images for gallery (excluding hero)
    const galleryImages = project.images && project.images.length > 1 ? project.images.slice(1) : []

    return (
        <div className="flex flex-col min-h-screen bg-[#FAFAF9]">
            <Header />

            <main className="flex-1">
                {/* 1. Immersive Hero Section */}
                <section className="relative h-[85vh] w-full overflow-hidden bg-[#1C1917]">
                    {heroImage ? (
                        <>
                            <div className="absolute inset-0">
                                <img
                                    src={heroImage}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Premium Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#1C1917]/90" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-[#1C1917] flex items-center justify-center">
                            <span className="text-white/20 text-lg">No Image Available</span>
                        </div>
                    )}

                    <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-24 md:pb-32">
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 w-fit group"
                        >
                            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-all">
                                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span className="text-lg font-medium tracking-wide">กลับหน้ารวมผลงาน</span>
                        </Link>

                        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {project.ownerName && (
                                <div className="mb-4 inline-block bg-primary/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/30">
                                    <span className="text-white text-sm font-bold tracking-widest uppercase">Owner: {project.ownerName}</span>
                                </div>
                            )}
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                                {project.name}
                            </h1>

                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-white/90 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 backdrop-blur-sm rounded-full">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <span className="text-xl md:text-3xl font-bold tracking-tight text-white">{project.location || "Location Not Specified"}</span>
                                </div>
                                <div className="hidden md:block w-px h-8 bg-white/20" />
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-light tracking-wide opacity-80">
                                        {project.completionDate
                                            ? `ส่งมอบเมื่อ ${new Date(project.completionDate).toLocaleDateString("th-TH", { month: "long", year: "numeric" })}`
                                            : "ยังไม่ระบุวันที่ส่งมอบ"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 px-4 -mt-12 relative z-20">
                    <div className="container mx-auto">
                        <div className="bg-white rounded-[32px] shadow-xl p-8 md:p-12 border border-[#E7E5E4] max-w-10xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                                {/* Left: Description */}
                                <div className="lg:col-span-7 space-y-8">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-6 font-serif">
                                            แนวคิด<span className="text-primary italic">การออกแบบ</span>
                                        </h2>
                                        <div className="prose text-[#57534E] leading-relaxed max-w-none">
                                            <p>{project.description || "บ้านที่ถูกออกแบบมาเพื่อความลงตัวของสมาชิกทุกคนในครอบครัว ผสานความหรูหราเข้ากับฟังก์ชันการใช้งานที่ตอบโจทย์ชีวิตยุคใหม่..."}</p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {plan && (
                                        <div className="pt-4">
                                            <Button size="lg" className="h-14 px-8 rounded-full text-lg gap-2 bg-[#1C1917] hover:bg-[#1C1917]/90 shadow-xl shadow-black/10" asChild>
                                                <Link href={`/house-plans/${plan.id}`}>
                                                    ดูแบบบ้าน {plan.name} <ArrowRight className="h-5 w-5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Stats Grid */}
                                <div className="lg:col-span-5">
                                    <div className="bg-[#FAFAF9] rounded-[28px] p-6 md:p-8 border border-[#E7E5E4]">
                                        <h3 className="text-xl font-bold text-[#1C1917] mb-8 flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                                            ข้อมูลโครงการ
                                        </h3>

                                        {/* Priority: Showcase Data > Linked House Plan Data */}
                                        <div className="grid grid-cols-2 gap-6 md:gap-8">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[#A8A29E]">
                                                    <BedDouble className="h-5 w-5" />
                                                    <span className="text-base md:text-lg font-semibold tracking-wide">ห้องนอน</span>
                                                </div>
                                                <p className="text-2xl font-bold text-[#1C1917]">
                                                    {project.bedrooms ?? plan?.bedrooms ?? "-"} <span className="text-sm font-normal text-[#A8A29E]">ห้อง</span>
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[#A8A29E]">
                                                    <Bath className="h-5 w-5" />
                                                    <span className="text-base md:text-lg font-semibold tracking-wide">ห้องน้ำ</span>
                                                </div>
                                                <p className="text-2xl font-bold text-[#1C1917]">
                                                    {project.bathrooms ?? plan?.bathrooms ?? "-"} <span className="text-sm font-normal text-[#A8A29E]">ห้อง</span>
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[#A8A29E]">
                                                    <Sofa className="h-5 w-5" />
                                                    <span className="text-base md:text-lg font-semibold tracking-wide">ห้องรับแขก</span>
                                                </div>
                                                <p className="text-2xl font-bold text-[#1C1917]">
                                                    {project.livingRooms ?? "-"} <span className="text-sm font-normal text-[#A8A29E]">ห้อง</span>
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[#A8A29E]">
                                                    <ChefHat className="h-5 w-5" />
                                                    <span className="text-base md:text-lg font-semibold tracking-wide">ห้องครัว</span>
                                                </div>
                                                <p className="text-2xl font-bold text-[#1C1917]">
                                                    {project.kitchens ?? "-"} <span className="text-sm font-normal text-[#A8A29E]">ห้อง</span>
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[#A8A29E]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>
                                                    <span className="text-base md:text-lg font-semibold tracking-wide">ที่จอดรถ</span>
                                                </div>
                                                <p className="text-2xl font-bold text-[#1C1917]">
                                                    {project.parking ?? "-"} <span className="text-sm font-normal text-[#A8A29E]">คัน</span>
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[#A8A29E]">
                                                    <Ruler className="h-5 w-5" />
                                                    <span className="text-base md:text-lg font-semibold tracking-wide">พื้นที่ใช้สอย</span>
                                                </div>
                                                <p className="text-2xl font-bold text-[#1C1917]">
                                                    {project.area ?? plan?.area ?? "-"} <span className="text-sm font-normal text-[#A8A29E]">ตร.ม.</span>
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[#A8A29E]">
                                                    <Calendar className="h-5 w-5" />
                                                    <span className="text-base md:text-lg font-semibold tracking-wide">ปีที่สร้าง</span>
                                                </div>
                                                <p className="text-2xl font-bold text-[#1C1917]">
                                                    {project.completionDate ? new Date(project.completionDate).getFullYear() : "-"}
                                                </p>
                                            </div>
                                        </div>

                                        {(project.price || plan?.price) && (
                                            <div className="mt-8 pt-8 border-t border-[#E7E5E4] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700" />
                                                <p className="text-xs font-bold text-[#8C8379] uppercase tracking-[0.2em] mb-3 leading-none">งบประมาณก่อสร้างประมาณ</p>
                                                <div className="flex items-baseline gap-2">
                                                    <p className="text-4xl md:text-5xl font-bold text-primary drop-shadow-sm">
                                                        {formatPriceToMillion(project.price || plan?.price || 0)}
                                                    </p>
                                                    <span className="text-xl font-bold text-[#1C1917]">ล้านบาท*</span>
                                                </div>
                                                <div className="mt-3 flex items-center gap-2 text-[#A8A29E] text-xs">
                                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                                    <p>ราคาอาจเปลี่ยนแปลงตามพื้นที่และวัสดุ</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Refined Gallery Grid - CATEGORIZED */}
                <section className="py-2 bg-[#FAFAF9]">
                    <div className="container mx-auto px-4">
                        {/* Main Exterior Gallery */}
                        {galleryImages.length > 0 && (
                            <div className="mb-8">
                                <div className="text-center mb-16">
                                    <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">Private Gallery</span>
                                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C1917] mt-3 mb-6 font-serif">ภาพภายนอกโครงการ</h2>
                                    <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                    {galleryImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`group relative overflow-hidden rounded-[32px] shadow-lg cursor-zoom-in bg-[#E7E5E4] ${
                                                // Make every 3rd image span full width on desktop for variety
                                                (index + 1) % 3 === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${project.name} exterior ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sub Interior/Details Gallery */}
                        {project.subImages && project.subImages.length > 0 && (
                            <div className="mt-8">
                                <div className="text-center mb-16">
                                    <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">Interior & Details</span>
                                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C1917] mt-3 mb-6 font-serif">ภาพภายในและรายละเอียด</h2>
                                    <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                    {project.subImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className="group relative overflow-hidden rounded-[24px] shadow-md cursor-zoom-in aspect-square"
                                        >
                                            <img
                                                src={img}
                                                alt={`${project.name} interior ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Floor Plan Gallery (If linked to house plan) */}
                        {plan?.floorPlanImages && plan.floorPlanImages.length > 0 && (
                            <FloorPlanGallery images={plan.floorPlanImages} planName={plan.name} />
                        )}
                    </div>
                </section>

                {/* 4. Bottom Navigation/CTA */}
                <section className="py-20 bg-[#1C1917] text-center border-t border-white/5">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-white mb-8 font-serif">สนใจสร้างบ้านแบบนี้?</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-white/20 text-white hover:bg-white hover:text-[#1C1917] transition-all" asChild>
                                <Link href="/contact">ติดต่อเรา</Link>
                            </Button>
                            <Button size="lg" className="h-14 px-10 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20" asChild>
                                <Link href="/house-plans">ดูแบบบ้านทั้งหมด</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
