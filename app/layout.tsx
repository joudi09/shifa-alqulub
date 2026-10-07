import type { Metadata } from "next";
import { Cairo, Amiri } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "شفاء القلوب",
    template: "%s | شفاء القلوب",
  },
  description:
    "موقع إسلامي شامل: القرآن الكريم، أذكار الصباح والمساء، الأدعية، والتسبيح",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable}`}>
      <body className="font-[family-name:var(--font-cairo)] antialiased luxury-bg">
        <Suspense fallback={<div className="h-20 border-b border-[#c9a227]/30 bg-[#fdfcf7]/95" />}>
          <Navbar />
        </Suspense>
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}