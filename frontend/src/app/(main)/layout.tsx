import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
