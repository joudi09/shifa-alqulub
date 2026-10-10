"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SavedReading = {
  surah: number;
  ayah: number;
  surahName: string;
  date: string;
};

export default function ContinueReading() {
  const [saved, setSaved] = useState<SavedReading | null>(null);

  useEffect(() => {
    const surah = localStorage.getItem("last_read_surah");
    const ayah = localStorage.getItem("last_read_ayah");
    const surahName = localStorage.getItem("last_read_surah_name");
    const date = localStorage.getItem("last_read_date");

    if (surah && ayah && surahName) {
      setSaved({
        surah: parseInt(surah),
        ayah: parseInt(ayah),
        surahName,
        date: date || "",
      });
    }
  }, []);

  if (!saved) return null;

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto 40px",
        padding: "0 24px",
      }}
    >
      <Link
        href={`/quran/${saved.surah}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "20px 24px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #fdfcf7 0%, #f5efdc 100%)",
          border: "2px solid #c9a227",
          textDecoration: "none",
          boxShadow: "0 6px 24px rgba(139, 105, 20, 0.15)",
          transition: "all 0.3s",
          flexWrap: "wrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(139, 105, 20, 0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(139, 105, 20, 0.15)";
        }}
      >
        {/* أيقونة + النص */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(139, 105, 20, 0.3)",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>

          <div>
            <p
              style={{
                fontSize: "12px",
                color: "#a8841c",
                margin: 0,
                marginBottom: "2px",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              استمرار القراءة
            </p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#8b6914",
                margin: 0,
                fontFamily: "var(--font-amiri)",
              }}
            >
              سورة {saved.surahName} — الآية {saved.ayah}
            </p>
          </div>
        </div>

        {/* زر الاستمرار */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "12px",
            backgroundColor: "white",
            border: "1px solid rgba(201, 162, 39, 0.4)",
            color: "#8b6914",
            fontSize: "14px",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          تابع
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
      </Link>
    </div>
  );
}