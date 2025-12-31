import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ScrollWidthHandler } from "@/components/layout/scroll-width-handler";

export default function HomePage() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col bg-[#fafafa]">
      <ScrollWidthHandler />
      <Header />
      <main className="relative z-10 flex-1 w-full">
        <HeroSection />
        <FeaturedProducts />
        {/* <CategoryShowcase />
        <NewArrivals /> */}
      </main>
      <Footer />
    </div>
  );
}
