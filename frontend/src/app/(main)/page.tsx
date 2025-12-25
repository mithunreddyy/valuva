import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { NewArrivals } from "@/components/home/new-arrivals";

export default function HomePage() {
  return (
    <div className="space-y-20">
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <NewArrivals />
    </div>
  );
}
