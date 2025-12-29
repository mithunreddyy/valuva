import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toast";
import { ReactQueryProvider } from "@/lib/react-query";
import { ReduxProvider } from "@/lib/redux-provider";
import type { Metadata } from "next";
import { Manrope, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-telugu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "valuva",
  description: "premium minimal fashion",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/favicon.ico",
    other: {
      rel: "icon",
      url: "/favicon/favicon.ico",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${notoSansTelugu.variable}`}>
      <body className={`${manrope.className} antialiased`}>
        <ErrorBoundary>
          <ReduxProvider>
            <ReactQueryProvider>
              {children}
              <Toaster />
            </ReactQueryProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
