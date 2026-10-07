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
    <div className="max-w-5xl mx-auto px-6 py-12">
      
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

      {/* البحث */}
      <div className="quran-search-wrapper">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن سورة..."
          className="quran-search-input"
        />
        <svg
          className="quran-search-icon"
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
        {search && (
          <button
            onClick={() => setSearch("")}
            className="quran-search-clear"
            aria-label="مسح"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
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
        <div className="quran-grid">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              href={`/quran/${surah.number}`}
              className="quran-card"
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  background: "linear-gradient(180deg, #b8860b 0%, #daa520 50%, #8b6914 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "var(--font-amiri)",
                }}
              >
                {surah.number}
              </span>

              <div
                style={{
                  width: "32px",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
                  margin: "8px auto",
                }}
              />

              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#8b6914",
                  margin: 0,
                  marginBottom: "8px",
                  fontFamily: "var(--font-amiri)",
                  lineHeight: 1.3,
                }}
              >
                {surah.name.replace("سُورَةُ ", "")}
              </h3>

              <div
                style={{
                  width: "32px",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
                  margin: "8px auto",
                }}
              />

              <p style={{ fontSize: "11px", color: "#737373", margin: 0 }}>
                {surah.revelationType === "Meccan" ? "مكية" : "مدنية"} · {surah.numberOfAyahs} آية
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* حالة عدم وجود نتائج */}
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

      {/* CSS خاص بالصفحة */}
      <style jsx global>{`
        .quran-search-wrapper {
          position: relative;
          width: 100%;
          max-width: 500px;
          margin: 0 auto 2.5rem;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .quran-search-input {
          width: 100%;
          box-sizing: border-box;
          padding: 14px 50px 14px 50px;
          border-radius: 16px;
          border: 2px solid rgba(201, 162, 39, 0.3);
          background-color: white;
          font-size: 16px;
          color: #404040;
          text-align: center;
          outline: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
        }

        .quran-search-input:focus {
          border-color: #c9a227;
          box-shadow: 0 0 0 4px rgba(201, 162, 39, 0.1);
        }

        .quran-search-icon {
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          color: #c9a227;
          pointer-events: none;
        }

        .quran-search-clear {
          position: absolute;
          left: 32px;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(201, 162, 39, 0.1);
          color: #8b6914;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }

        .quran-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .quran-card {
          display: block;
          border-radius: 16px;
          border: 1px solid rgba(201, 162, 39, 0.25);
          background: linear-gradient(135deg, #ffffff 0%, #fdfcf7 100%);
          padding: 20px 12px;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s;
        }

        .quran-card:hover {
          border-color: #c9a227;
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(139, 105, 20, 0.15);
        }

        @media (max-width: 1024px) {
          .quran-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .quran-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .quran-card {
            padding: 16px 10px;
          }
          .quran-search-input {
            padding: 12px 45px 12px 45px;
            font-size: 15px;
          }
          .quran-search-icon {
            right: 28px;
          }
          .quran-search-clear {
            left: 28px;
          }
        }

        @media (max-width: 480px) {
          .quran-search-wrapper {
            padding: 0 12px;
          }
        }
      `}</style>
    </div>
  );
}