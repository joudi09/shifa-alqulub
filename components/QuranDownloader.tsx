"use client";

import { useEffect, useState } from "react";
import { downloadAllSurahs, getCachedCount } from "@/lib/quran";

const TOTAL_SURAHS = 114;

export default function QuranDownloader() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // نتحقق من عدد السور المحفوظة
    const cached = getCachedCount();

    if (cached >= TOTAL_SURAHS) {
      setCompleted(true);
      return;
    }

    // نعرض الزر بعد 3 ثواني من فتح الموقع
    const timer = setTimeout(() => setShowButton(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const startDownload = async () => {
    setDownloading(true);
    try {
      await downloadAllSurahs((current, total) => {
        setProgress(Math.round((current / total) * 100));
      });
      setCompleted(true);
      setTimeout(() => setShowButton(false), 2000);
    } catch (error) {
      console.error("فشل التحميل:", error);
    } finally {
      setDownloading(false);
    }
  };

  // إذا كل السور محفوظة، ما نعرض شي
  if (completed && !downloading) return null;

  // نعرض الزر فقط بعد 3 ثواني
  if (!showButton && !downloading) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 100,
        maxWidth: "320px",
        backgroundColor: "white",
        borderRadius: "16px",
        border: "2px solid #c9a227",
        padding: "16px",
        boxShadow: "0 12px 32px rgba(139, 105, 20, 0.25)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      {/* العنوان */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#8b6914",
              margin: 0,
              marginBottom: "2px",
              fontFamily: "var(--font-amiri)",
            }}
          >
            {downloading ? "جاري التحميل..." : "قرآن بدون إنترنت"}
          </p>
          <p style={{ fontSize: "11px", color: "#737373", margin: 0 }}>
            {downloading
              ? `تم تحميل ${progress}% من القرآن`
              : "حمّل كل السور للعمل بدون إنترنت"}
          </p>
        </div>
      </div>

      {/* شريط التقدم */}
      {downloading && (
        <div
          style={{
            height: "6px",
            backgroundColor: "rgba(201, 162, 39, 0.15)",
            borderRadius: "3px",
            overflow: "hidden",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #daa520, #8b6914)",
              borderRadius: "3px",
              transition: "width 0.3s",
            }}
          />
        </div>
      )}

      {/* الزر */}
      {!downloading && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={startDownload}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
              color: "white",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "var(--font-cairo)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            تحميل الآن
          </button>
          <button
            onClick={() => setShowButton(false)}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(201, 162, 39, 0.4)",
              backgroundColor: "white",
              color: "#8b6914",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            لاحقاً
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}