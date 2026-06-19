import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedProjects } from "@/components/featured-projects"
import { HomeShowcase } from "@/components/home-showcase"
import { StatsSection } from "@/components/stats-section"
import { CTASection } from "@/components/cta-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <FeaturedProjects />
        <HomeShowcase />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
