"use client";

import { useEffect, useState } from "react";

const TOTAL_SURAHS = 114;

export default function QuranDownloader() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [show, setShow] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "QURAN_PROGRESS") {
        const { current: c, total } = event.data;
        setCurrent(c);
        setProgress(Math.round((c / total) * 100));
        setDownloading(true);
        setShow(true);
        setStuck(false);
      }

      if (event.data?.type === "QURAN_COMPLETE") {
        setCompleted(true);
        setProgress(100);
        setDownloading(false);
        setTimeout(() => setShow(false), 3000);
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleMessage);
    }

    const startTimer = setTimeout(() => {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "DOWNLOAD_ALL_QURAN",
        });
        setShow(true);
        setDownloading(true);
      }
    }, 2000);

    // نتحقق إذا واقف
    const stuckTimer = setInterval(() => {
      setCurrent((prevCurrent) => {
        // إذا ما تغير العدد لمدة 30 ثانية
        if (prevCurrent > 0 && prevCurrent < TOTAL_SURAHS) {
          setStuck(true);
        }
        return prevCurrent;
      });
    }, 30000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(stuckTimer);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      }
    };
  }, []);

  const retry = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "DOWNLOAD_ALL_QURAN",
      });
      setStuck(false);
      setDownloading(true);
    }
  };

  if (!show && !downloading) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        zIndex: 9999,
        maxWidth: "320px",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "16px",
        border: completed ? "2px solid #16a34a" : "2px solid #c9a227",
        padding: "14px",
        boxShadow: "0 12px 32px rgba(139, 105, 20, 0.35)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: completed ? 0 : "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: completed
              ? "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)"
              : "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {completed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: completed ? "#16a34a" : "#8b6914",
              margin: 0,
              marginBottom: "2px",
              fontFamily: "var(--font-amiri)",
            }}
          >
            {completed
              ? "القرآن جاهز بدون إنترنت"
              : stuck
              ? "التوقف — اضغط إعادة"
              : "جاري تحميل القرآن..."}
          </p>
          <p style={{ fontSize: "11px", color: "#737373", margin: 0 }}>
            {completed
              ? "كل السور متاحة offline"
              : `السورة ${current} من ${TOTAL_SURAHS} (${progress}%)`}
          </p>
        </div>
      </div>

      {!completed && (
        <>
          <div
            style={{
              height: "6px",
              backgroundColor: "rgba(201, 162, 39, 0.15)",
              borderRadius: "3px",
              overflow: "hidden",
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

          {stuck && (
            <button
              onClick={retry}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
                color: "white",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              إعادة المحاولة
            </button>
          )}
        </>
      )}
    </div>
  );
}