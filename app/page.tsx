import { Navbar } from "@/components/layout/navbar"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { CategorySection } from "@/components/sections/category-section"
import { StatsSection } from "@/components/sections/stats-section"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <StatsSection />
      <Footer />
    </div>
  )
}
