"use client";

import { useEffect, useState } from "react";
import { downloadAllSurahs, getCachedCount } from "@/lib/quran";

const TOTAL_SURAHS = 114;

export default function QuranDownloader() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSurah, setCurrentSurah] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = getCachedCount();

    if (cached >= TOTAL_SURAHS) {
      setCompleted(true);
      return;
    }

    const timer = setTimeout(() => setShowButton(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const startDownload = async () => {
    setDownloading(true);
    setError("");
    try {
      await downloadAllSurahs((current, total) => {
        setProgress(Math.round((current / total) * 100));
        setCurrentSurah(`السورة ${current} من ${total}`);
      });
      
      const finalCount = getCachedCount();
      if (finalCount >= TOTAL_SURAHS) {
        setCompleted(true);
        setTimeout(() => setShowButton(false), 2000);
      } else {
        setError(`تم تحميل ${finalCount} من ${TOTAL_SURAHS} سورة فقط`);
      }
    } catch (err) {
      setError("فشل التحميل — تأكدي من الاتصال بالإنترنت");
    } finally {
      setDownloading(false);
    }
  };

  if (completed && !downloading) return null;
  if (!showButton && !downloading) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        zIndex: 100,
        maxWidth: "340px",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "16px",
        border: "2px solid #c9a227",
        padding: "16px",
        boxShadow: "0 12px 32px rgba(139, 105, 20, 0.35)",
      }}
    >
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
        <div style={{ flex: 1 }}>
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
            {downloading ? "جاري تحميل القرآن..." : "قرآن بدون إنترنت"}
          </p>
          <p style={{ fontSize: "11px", color: "#737373", margin: 0 }}>
            {downloading ? currentSurah : "حمّل كل السور (يحتاج إنترنت مرة وحدة)"}
          </p>
        </div>
      </div>

      {downloading && (
        <>
          <div
            style={{
              height: "8px",
              backgroundColor: "rgba(201, 162, 39, 0.15)",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #daa520, #8b6914)",
                borderRadius: "4px",
                transition: "width 0.3s",
              }}
            />
          </div>
          <p style={{ fontSize: "12px", color: "#8b6914", textAlign: "center", margin: 0, fontWeight: 600 }}>
            {progress}%
          </p>
        </>
      )}

      {error && !downloading && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <p style={{ fontSize: "11px", color: "#dc2626", margin: 0, textAlign: "center" }}>
            {error}
          </p>
        </div>
      )}

      {!downloading && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={startDownload}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
              color: "white",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-cairo)",
            }}
          >
            {error ? "إعادة المحاولة" : "تحميل الآن"}
          </button>
          <button
            onClick={() => setShowButton(false)}
            style={{
              padding: "12px 14px",
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
    </div>
  );
}