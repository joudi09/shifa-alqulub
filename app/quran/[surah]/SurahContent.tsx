"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Ayah = {
  number: number;
  numberInSurah: number;
  text: string;
};

type SurahData = {
  number: number;
  name: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
};

const formatAyahCount = (count: number): string => {
  if (count === 1) return "آية واحدة";
  if (count === 2) return "آيتان";
  if (count >= 3 && count <= 10) return `${count} آيات`;
  return `${count} آية`;
};

export default function SurahContent() {
  const params = useParams();
  const surahNumber = params.surah as string;
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fontSize, setFontSize] = useState(28);

  useEffect(() => {
    if (!surahNumber) return;
    setLoading(true);
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 200) {
          setSurah(json.data);
        } else {
          setError("تعذر جلب السورة");
        }
      })
      .catch(() => setError("حدث خطأ في الاتصال"))
      .finally(() => setLoading(false));
  }, [surahNumber]);

  const cleanText = (text: string) => {
    return text
      .replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ", "")
      .replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", "");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      
      {/* زر الرجوع */}
      <Link
        href="/quran"
        className="inline-flex items-center gap-2 text-sm text-[#8b6914] hover:text-[#daa520] mb-6 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
        العودة لقائمة السور
      </Link>

      {loading && (
        <div className="text-center py-20">
          <p className="text-[#8b6914]">جاري تحميل السورة...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {surah && !loading && (
        <>
          {/* رأس السورة */}
          <div className="text-center mb-8 p-6 md:p-8 rounded-2xl border-2 border-[#c9a227]/40 bg-gradient-to-br from-white/90 to-[#fdfcf7]/90">
            <h1
              className="text-4xl md:text-5xl font-bold text-gold gold-glow"
              style={{ fontFamily: "var(--font-amiri)", marginBottom: "24px" }}
            >
              سورة {surah.name.replace("سُورَةُ ", "")}
            </h1>

            <div className="diamond-divider mx-auto" style={{ marginBottom: "24px" }}>
              <div className="w-3 h-3 rotate-45 border-2 border-[#c9a227] bg-[#fdfcf7]" />
            </div>

            {/* معلومات السورة */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0 32px",
                rowGap: "8px",
                fontSize: "14px",
                color: "#8b6914",
              }}
            >
              <span style={{ fontWeight: 600 }}>
                {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
              </span>

              <span style={{ color: "#c9a227", fontSize: "18px", fontWeight: 300 }}>|</span>

              <span style={{ fontWeight: 600 }}>
                {formatAyahCount(surah.numberOfAyahs)}
              </span>

              <span style={{ color: "#c9a227", fontSize: "18px", fontWeight: 300 }}>|</span>

              <span style={{ fontWeight: 600 }}>
                السورة رقم {surah.number}
              </span>
            </div>
          </div>

          {/* أزرار التحكم بحجم الخط */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "24px", marginBottom: "40px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "16px",
                padding: "10px 20px",
                borderRadius: "999px",
                backgroundColor: "white",
                border: "2px solid rgba(201, 162, 39, 0.4)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#8b6914",
                  whiteSpace: "nowrap",
                }}
              >
                حجم الخط
              </span>

              <span
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "rgba(201, 162, 39, 0.3)",
                }}
              ></span>

              <button
                onClick={() => setFontSize(Math.max(20, fontSize - 2))}
                disabled={fontSize <= 20}
                aria-label="تصغير"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#fdfcf7",
                  border: "1px solid rgba(201, 162, 39, 0.4)",
                  color: "#8b6914",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: fontSize <= 20 ? "not-allowed" : "pointer",
                  opacity: fontSize <= 20 ? 0.3 : 1,
                  transition: "all 0.2s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M5 12h14" />
                </svg>
              </button>

              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#8b6914",
                  width: "32px",
                  textAlign: "center",
                }}
              >
                {fontSize}
              </span>

              <button
                onClick={() => setFontSize(Math.min(48, fontSize + 2))}
                disabled={fontSize >= 48}
                aria-label="تكبير"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
                  border: "none",
                  color: "white",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: fontSize >= 48 ? "not-allowed" : "pointer",
                  opacity: fontSize >= 48 ? 0.3 : 1,
                  transition: "all 0.2s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>

          {/* البسملة */}
          {surah.number !== 1 && surah.number !== 9 && (
            <div className="text-center mb-8">
              <p
                className="text-3xl md:text-4xl text-gold"
                style={{ fontFamily: "var(--font-amiri)" }}
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          )}

          {/* الآيات */}
          <div
            className="rounded-2xl border border-[#c9a227]/30 bg-white/80 p-6 md:p-10 shadow-sm"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            <p
              className="leading-[2.2] text-neutral-800 text-justify"
              style={{ fontSize: `${fontSize}px` }}
              dir="rtl"
            >
              {surah.ayahs.map((ayah) => (
                <span key={ayah.number}>
                  {ayah.numberInSurah === 1 && surah.number !== 1
                    ? cleanText(ayah.text)
                    : ayah.text}{" "}
                  <span
                    className="inline-flex items-center justify-center text-[#8b6914] font-bold mx-1"
                    style={{ fontSize: `${fontSize - 6}px` }}
                  >
                    ﴿{ayah.numberInSurah}﴾
                  </span>{" "}
                </span>
              ))}
            </p>
          </div>

          {/* التنقل بين السور */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "48px",
              paddingLeft: "20px",
              paddingRight: "20px",
              gap: "12px",
            }}
          >
            {surah.number > 1 ? (
              <Link
                href={`/quran/${surah.number - 1}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 28px",
                  borderRadius: "16px",
                  backgroundColor: "white",
                  border: "2px solid rgba(201, 162, 39, 0.4)",
                  color: "#8b6914",
                  fontWeight: 600,
                  fontSize: "15px",
                  transition: "all 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(201, 162, 39, 0.1)";
                  e.currentTarget.style.borderColor = "#c9a227";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "rgba(201, 162, 39, 0.4)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                السورة السابقة
              </Link>
            ) : (
              <div />
            )}

            {surah.number < 114 ? (
              <Link
                href={`/quran/${surah.number + 1}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 28px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "15px",
                  boxShadow: "0 4px 14px rgba(139, 105, 20, 0.3)",
                  transition: "all 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(139, 105, 20, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(139, 105, 20, 0.3)";
                }}
              >
                السورة التالية
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </>
      )}
    </div>
  );
}