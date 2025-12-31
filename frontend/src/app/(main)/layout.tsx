import { SkipToContent } from "@/components/accessibility/skip-to-content";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Valuva",
  description:
    "Minimal luxury clothing with timeless design. Crafted for the modern minimalist.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://valuva.in",
  type: "website",
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col bg-[#fafafa]">
      <SkipToContent />
      <Header />
      <main
        id="main-content"
        className="relative z-10 flex-1 w-full"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
