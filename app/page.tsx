"use client";

import Link from "next/link";
import PrayerTimes from "@/components/PrayerTimes";
import ContinueReading from "@/components/ContinueReading";

const features = [
  {
    href: "/quran",
    title: "القرآن الكريم",
    desc: "اقرأ القرآن كاملاً بتصميم مريح للعين",
  },
  {
    href: "/adhkar/morning",
    title: "أذكار الصباح",
    desc: "حصّن يومك بأذكار الصباح المأثورة",
  },
  {
    href: "/adhkar/evening",
    title: "أذكار المساء",
    desc: "اختم يومك بالأذكار والاستغفار",
  },
  {
    href: "/duas",
    title: "الأدعية",
    desc: "أدعية مأثورة من الكتاب والسنة",
  },
  {
    href: "/tasbih",
    title: "المسبحة",
    desc: "عداد تسبيح إلكتروني أنيق",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p
            className="text-4xl md:text-5xl text-gold gold-glow"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            ﷽
          </p>

          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-bold text-gold gold-glow leading-tight"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            شفاء القلوب
          </h1>

          <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto leading-relaxed">
            موقعك الإسلامي الشامل — قرآن، أذكار، أدعية، وتسبيح
          </p>

          <div className="diamond-divider mx-auto">
            <div className="w-3 h-3 rotate-45 border-2 border-[#c9a227] bg-[#fdfcf7]" />
          </div>

          <p
            className="text-xl md:text-2xl text-gold leading-loose pt-2"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            ﴿ وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ ﴾
          </p>
        </div>
      </section>

      {/* استمرار القراءة */}
      <ContinueReading />

      {/* أوقات الصلاة */}
      <PrayerTimes />

      {/* الأقسام */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        
        {/* الصف الأول: 3 بطاقات */}
        <div
          className="home-grid-row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {features.slice(0, 3).map((f) => (
            <Link
              key={f.href}
              href={f.href}
              style={{
                display: "block",
                borderRadius: "20px",
                border: "2px solid rgba(201, 162, 39, 0.25)",
                background: "linear-gradient(135deg, #ffffff 0%, #fdfcf7 100%)",
                padding: "32px 20px",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c9a227";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(139, 105, 20, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(201, 162, 39, 0.25)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#8b6914",
                    marginBottom: "12px",
                    fontFamily: "var(--font-amiri)",
                  }}
                >
                  {f.title}
                </h3>

                <div
                  style={{
                    width: "60px",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
                    margin: "0 auto 16px",
                  }}
                />

                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* الصف الثاني: 2 بطاقات في النص */}
        <div
          className="home-grid-row-2"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {features.slice(3, 5).map((f) => (
            <Link
              key={f.href}
              href={f.href}
              style={{
                display: "block",
                width: "calc(33.333% - 14px)",
                borderRadius: "20px",
                border: "2px solid rgba(201, 162, 39, 0.25)",
                background: "linear-gradient(135deg, #ffffff 0%, #fdfcf7 100%)",
                padding: "32px 20px",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c9a227";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(139, 105, 20, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(201, 162, 39, 0.25)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#8b6914",
                    marginBottom: "12px",
                    fontFamily: "var(--font-amiri)",
                  }}
                >
                  {f.title}
                </h3>

                <div
                  style={{
                    width: "60px",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
                    margin: "0 auto 16px",
                  }}
                />

                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CSS للموبايل */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .home-grid-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .home-grid-row-2 {
            flex-direction: column !important;
            align-items: center !important;
          }
          .home-grid-row-2 > a {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}