import type { Metadata, Viewport } from "next";
import { Cairo, Amiri } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FatihaModal from "@/components/FatihaModal";
import FridayReminder from "@/components/FridayReminder";
import QuranDownloader from "@/components/QuranDownloader";
import NotificationManager from "@/components/NotificationManager";
import InstallButton from "@/components/InstallButton";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "شفاء القلوب",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#c9a227",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" className={`${cairo.variable} ${amiri.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-[family-name:var(--font-cairo)] antialiased luxury-bg">
        <Suspense fallback={<div className="h-20 border-b border-[#c9a227]/30 bg-[#fdfcf7]/95" />}>
          <Navbar />
        </Suspense>
        <FridayReminder />
        <FatihaModal />
        <QuranDownloader />
        <NotificationManager />
        <InstallButton />
        <ServiceWorkerRegister />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}