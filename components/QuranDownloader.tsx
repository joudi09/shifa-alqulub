"use client";

import { useEffect, useState } from "react";

const TOTAL_SURAHS = 114;

export default function QuranDownloader() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSurah, setCurrentSurah] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    // نتحقق من حالة التحميل
    const checkStatus = () => {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "CHECK_QURAN_STATUS" });
      }
    };

    // نستمع للرسائل من Service Worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "QURAN_PROGRESS") {
        const { current, total } = event.data;
        setDownloadCount(current);
        setProgress(Math.round((current / total) * 100));
        setCurrentSurah(current);
      }

      if (event.data?.type === "QURAN_COMPLETE") {
        setCompleted(true);
        setDownloading(false);
        setProgress(100);
        setTimeout(() => setShowButton(false), 3000);
      }

      if (event.data?.type === "QURAN_STATUS") {
        const { count, total } = event.data;
        if (count >= total) {
          setCompleted(true);
        } else {
          setShowButton(true);
        }
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleMessage);
      setTimeout(checkStatus, 2000);
    }

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      }
    };
  }, []);

  const startDownload = () => {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
      alert("جاري تحضير التطبيق... حاولي مرة ثانية بعد لحظات");
      return;
    }

    setDownloading(true);
    setProgress(0);
    navigator.serviceWorker.controller.postMessage({ type: "DOWNLOAD_ALL_QURAN" });
  };

  if (completed || !showButton) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        zIndex: 9999,
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
            {downloading
              ? `السورة ${currentSurah} من ${TOTAL_SURAHS}`
              : "حمّلي كل السور (يحتاج إنترنت مرة وحدة)"}
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
            تحميل الآن
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