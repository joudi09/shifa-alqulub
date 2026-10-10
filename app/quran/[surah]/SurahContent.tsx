"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSurah, type SurahData } from "@/lib/quran";

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
  const [savedAyah, setSavedAyah] = useState<number>(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedSurah = localStorage.getItem("last_read_surah");
    const savedAyahNum = localStorage.getItem("last_read_ayah");
    if (savedSurah === surahNumber && savedAyahNum) {
      setSavedAyah(parseInt(savedAyahNum));
    } else {
      setSavedAyah(0);
    }
  }, [surahNumber]);

  useEffect(() => {
    if (!surahNumber) return;
    setLoading(true);
    const surahNum = parseInt(surahNumber);

    getSurah(surahNum)
      .then((data) => {
        setSurah(data);
      })
      .catch((err) => {
        setError(err.message || "حدث خطأ");
      })
      .finally(() => setLoading(false));
  }, [surahNumber]);

  const cleanText = (text: string) => {
    return text
      .replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ", "")
      .replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", "");
  };

  const saveAyah = (ayahNum: number) => {
    if (!surah) return;
    localStorage.setItem("last_read_surah", surah.id.toString());
    localStorage.setItem("last_read_ayah", ayahNum.toString());
    localStorage.setItem("last_read_surah_name", surah.name);
    localStorage.setItem("last_read_date", new Date().toISOString());
    setSavedAyah(ayahNum);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <p className="text-[#8b6914]">جاري تحميل السورة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/quran" className="text-[#8b6914] underline">
            العودة لقائمة السور
          </Link>
        </div>
      </div>
    );
  }

  if (!surah) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8" style={{ position: "relative" }}>
      
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#16a34a",
            color: "white",
            padding: "12px 24px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(22, 163, 74, 0.3)",
            zIndex: 100,
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          تم حفظ مكان القراءة
        </div>
      )}

      <Link
        href="/quran"
        className="inline-flex items-center gap-2 text-sm text-[#8b6914] hover:text-[#daa520] mb-6 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
        العودة لقائمة السور
      </Link>

      <div className="text-center mb-8 p-6 md:p-8 rounded-2xl border-2 border-[#c9a227]/40 bg-gradient-to-br from-white/90 to-[#fdfcf7]/90">
        <h1
          className="text-4xl md:text-5xl font-bold text-gold gold-glow"
          style={{ fontFamily: "var(--font-amiri)", marginBottom: "24px" }}
        >
          سورة {surah.name}
        </h1>

        <div className="diamond-divider mx-auto" style={{ marginBottom: "24px" }}>
          <div className="w-3 h-3 rotate-45 border-2 border-[#c9a227] bg-[#fdfcf7]" />
        </div>

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
            {surah.type === "meccan" ? "مكية" : "مدنية"}
          </span>
          <span style={{ color: "#c9a227", fontSize: "18px", fontWeight: 300 }}>|</span>
          <span style={{ fontWeight: 600 }}>
            {formatAyahCount(surah.total_verses)}
          </span>
          <span style={{ color: "#c9a227", fontSize: "18px", fontWeight: 300 }}>|</span>
          <span style={{ fontWeight: 600 }}>
            السورة رقم {surah.id}
          </span>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#8b6914",
          marginBottom: "20px",
          padding: "10px 16px",
          backgroundColor: "rgba(201, 162, 39, 0.08)",
          borderRadius: "10px",
          border: "1px dashed rgba(201, 162, 39, 0.3)",
        }}
      >
        💡 اضغط على أي آية لحفظ مكان القراءة
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
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
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#8b6914", whiteSpace: "nowrap" }}>
            حجم الخط
          </span>
          <span style={{ width: "1px", height: "20px", backgroundColor: "rgba(201, 162, 39, 0.3)" }}></span>

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
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>

          <span style={{ fontSize: "16px", fontWeight: 700, color: "#8b6914", width: "32px", textAlign: "center" }}>
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
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      {surah.id !== 1 && surah.id !== 9 && (
        <div className="text-center mb-8">
          <p
            className="text-3xl md:text-4xl text-gold"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      <div
        className="rounded-2xl border border-[#c9a227]/30 bg-white/80 p-6 md:p-10 shadow-sm"
        style={{ fontFamily: "var(--font-amiri)" }}
      >
        <p
          className="leading-[2.2] text-neutral-800 text-justify"
          style={{ fontSize: `${fontSize}px` }}
          dir="rtl"
        >
          {surah.verses.map((ayah) => {
            const isSaved = savedAyah === ayah.id;

            return (
              <span
                key={ayah.id}
                onClick={() => saveAyah(ayah.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: isSaved ? "rgba(201, 162, 39, 0.15)" : "transparent",
                  borderRight: isSaved ? "4px solid #daa520" : "none",
                  paddingRight: isSaved ? "10px" : "0",
                  borderRadius: isSaved ? "6px" : "0",
                  transition: "all 0.2s",
                  display: "inline",
                }}
                title="اضغط لحفظ مكان القراءة"
              >
                {ayah.id === 1 && surah.id !== 1
                  ? cleanText(ayah.text)
                  : ayah.text}{" "}
                <span
                  className="inline-flex items-center justify-center font-bold mx-1"
                  style={{
                    fontSize: `${fontSize - 6}px`,
                    color: isSaved ? "#8b6914" : "#c9a227",
                    backgroundColor: isSaved ? "rgba(218, 165, 32, 0.2)" : "transparent",
                    padding: isSaved ? "2px 6px" : "0",
                    borderRadius: "6px",
                  }}
                >
                  ﴿{ayah.id}﴾
                </span>{" "}
              </span>
            );
          })}
        </p>
      </div>

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
        {surah.id > 1 ? (
          <Link
            href={`/quran/${surah.id - 1}`}
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
              textDecoration: "none",
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

        {surah.id < 114 ? (
          <Link
            href={`/quran/${surah.id + 1}`}
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
              textDecoration: "none",
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
    </div>
  );
}