import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { NewArrivals } from "@/components/home/new-arrivals";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function HomePage() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col bg-[#fafafa]">
      <Header />
      <main className="relative z-10 flex-1 w-full">
        <HeroSection />
        <FeaturedProducts />
        <CategoryShowcase />
        <NewArrivals />
      </main>
      <Footer />
    </div>
  );
}
