"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 200) {
          setSurahs(json.data);
        } else {
          setError("تعذر جلب قائمة السور");
        }
      })
      .catch(() => setError("حدث خطأ في الاتصال"))
      .finally(() => setLoading(false));
  }, []);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.includes(search) ||
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString() === search
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      
      {/* العنوان */}
      <div className="text-center mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold text-gold gold-glow mb-3"
          style={{ fontFamily: "var(--font-amiri)" }}
        >
          القرآن الكريم
        </h1>
        <div className="diamond-divider mx-auto mb-3">
          <div className="w-3 h-3 rotate-45 border-2 border-[#c9a227] bg-[#fdfcf7]" />
        </div>
        <p className="text-sm text-neutral-600">
          اختر السورة التي تريد قراءتها
        </p>
      </div>

      {/* البحث - مصغّر على الموبايل */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2.5rem",
        }}
      >
        <div
          className="search-container"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن سورة..."
            className="search-input"
            style={{
              width: "100%",
              borderRadius: "16px",
              border: "2px solid rgba(201, 162, 39, 0.3)",
              backgroundColor: "white",
              color: "#404040",
              textAlign: "center",
              outline: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#c9a227";
              e.target.style.boxShadow = "0 0 0 4px rgba(201, 162, 39, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(201, 162, 39, 0.3)";
              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
            }}
          />

          {/* أيقونة البحث */}
          <svg
            className="search-icon"
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#c9a227",
              pointerEvents: "none",
            }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          {/* زر مسح */}
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "rgba(201, 162, 39, 0.1)",
                color: "#8b6914",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="مسح"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* عدد النتائج */}
      {!loading && !error && search && (
        <p className="text-center text-xs text-neutral-500 mb-4">
          {filteredSurahs.length > 0
            ? `تم العثور على ${filteredSurahs.length} سورة`
            : "لا توجد نتائج مطابقة"}
        </p>
      )}

      {/* التحميل */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-[#8b6914]">جاري تحميل السور...</p>
        </div>
      )}

      {/* الخطأ */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* قائمة السور */}
      {!loading && !error && filteredSurahs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              href={`/quran/${surah.number}`}
              className="group relative block rounded-2xl border border-[#c9a227]/25 bg-gradient-to-br from-white to-[#fdfcf7] p-5 hover:border-[#c9a227] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <span
                  className="text-3xl font-bold text-gold"
                  style={{ fontFamily: "var(--font-amiri)" }}
                >
                  {surah.number}
                </span>

                <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />

                <h3
                  className="text-xl md:text-2xl font-bold text-[#8b6914] group-hover:text-[#daa520] transition-colors leading-tight"
                  style={{ fontFamily: "var(--font-amiri)" }}
                >
                  {surah.name.replace("سُورَةُ ", "")}
                </h3>

                <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />

                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  {surah.revelationType === "Meccan" ? "مكية" : "مدنية"} · {surah.numberOfAyahs} آية
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* عدم وجود نتائج */}
      {!loading && !error && filteredSurahs.length === 0 && search && (
        <div className="text-center py-16">
          <p className="text-neutral-500 mb-2">لا توجد نتائج لـ &quot;{search}&quot;</p>
          <button
            onClick={() => setSearch("")}
            className="text-sm text-[#8b6914] hover:text-[#daa520] underline"
          >
            مسح البحث
          </button>
        </div>
      )}

      {/* CSS للبحث على الموبايل */}
      <style jsx global>{`
        /* على الشاشات الكبيرة */
        .search-input {
          padding: 14px 50px 14px 50px;
          font-size: 16px;
        }
        
        /* على الموبايل: أصغر */
        @media (max-width: 768px) {
          .search-input {
            padding: 10px 42px 10px 42px !important;
            font-size: 14px !important;
            border-radius: 12px !important;
          }
          .search-icon {
            right: 12px !important;
            width: 16px !important;
            height: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}