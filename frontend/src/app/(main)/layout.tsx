import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col bg-[#fafafa]">
      <Header />
      <main className="relative z-10 flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
