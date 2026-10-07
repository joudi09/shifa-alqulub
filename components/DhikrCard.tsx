"use client";

import { useEffect, useState } from "react";

type Dhikr = {
  id: string;
  text: string;
  count: number;
  virtue: string;
  reference: string;
};

export default function DhikrCard({ dhikr }: { dhikr: Dhikr }) {
  const [currentCount, setCurrentCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // استرجاع العداد من localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`dhikr_${dhikr.id}`);
    if (saved) setCurrentCount(parseInt(saved));
  }, [dhikr.id]);

  // حفظ العداد
  const incrementCount = () => {
    if (currentCount < dhikr.count) {
      const newCount = currentCount + 1;
      setCurrentCount(newCount);
      localStorage.setItem(`dhikr_${dhikr.id}`, newCount.toString());
    }
  };

  const resetCount = () => {
    setCurrentCount(0);
    localStorage.removeItem(`dhikr_${dhikr.id}`);
  };

  const copyText = () => {
    navigator.clipboard.writeText(dhikr.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = (currentCount / dhikr.count) * 100;
  const isComplete = currentCount >= dhikr.count;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        border: isComplete ? "2px solid #16a34a" : "1px solid rgba(201, 162, 39, 0.3)",
        padding: "24px",
        marginBottom: "20px",
        boxShadow: isComplete
          ? "0 4px 20px rgba(22, 163, 74, 0.15)"
          : "0 2px 8px rgba(139, 105, 20, 0.06)",
        transition: "all 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* شريط تقدم علوي */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "4px",
          width: `${progress}%`,
          background: isComplete
            ? "linear-gradient(90deg, #16a34a, #22c55e)"
            : "linear-gradient(90deg, #daa520, #c9a227)",
          transition: "width 0.3s",
        }}
      />

      {/* رأس البطاقة */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* المرجع */}
        <span
          style={{
            fontSize: "12px",
            color: "#a8841c",
            backgroundColor: "rgba(201, 162, 39, 0.1)",
            padding: "4px 12px",
            borderRadius: "20px",
            fontWeight: 600,
          }}
        >
          {dhikr.reference}
        </span>

        {/* أزرار */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={copyText}
            aria-label="نسخ"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: "1px solid rgba(201, 162, 39, 0.3)",
              backgroundColor: copied ? "rgba(22, 163, 74, 0.1)" : "white",
              color: copied ? "#16a34a" : "#8b6914",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>

          <button
            onClick={resetCount}
            aria-label="إعادة تعيين"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: "1px solid rgba(201, 162, 39, 0.3)",
              backgroundColor: "white",
              color: "#8b6914",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>

      {/* نص الذكر */}
      <p
        style={{
          fontSize: "20px",
          lineHeight: "2",
          color: "#1f2937",
          textAlign: "justify",
          marginBottom: "20px",
          fontFamily: "var(--font-amiri)",
          direction: "rtl",
          whiteSpace: "pre-line",
        }}
      >
        {dhikr.text}
      </p>

      {/* الفضل */}
      {dhikr.virtue && (
        <div
          style={{
            backgroundColor: "rgba(201, 162, 39, 0.06)",
            borderRight: "3px solid #c9a227",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#8b6914", lineHeight: 1.7, margin: 0 }}>
            <strong>الفضل: </strong>
            {dhikr.virtue}
          </p>
        </div>
      )}

      {/* العدّاد */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* العدد الحالي */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: "#737373", fontWeight: 600 }}>
            التكرار:
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: isComplete ? "#16a34a" : "#8b6914",
              minWidth: "60px",
              textAlign: "center",
              fontFamily: "var(--font-amiri)",
            }}
          >
            {currentCount} / {dhikr.count}
          </span>
          {isComplete && (
            <span
              style={{
                fontSize: "12px",
                color: "#16a34a",
                fontWeight: 600,
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                padding: "4px 10px",
                borderRadius: "20px",
              }}
            >
              ✓ تم
            </span>
          )}
        </div>

        {/* زر العد */}
        <button
          onClick={incrementCount}
          disabled={isComplete}
          style={{
            padding: "12px 32px",
            borderRadius: "14px",
            border: "none",
            background: isComplete
              ? "linear-gradient(135deg, #16a34a, #22c55e)"
              : "linear-gradient(135deg, #daa520, #8b6914)",
            color: "white",
            fontSize: "15px",
            fontWeight: 700,
            cursor: isComplete ? "default" : "pointer",
            boxShadow: isComplete
              ? "0 4px 12px rgba(22, 163, 74, 0.25)"
              : "0 4px 12px rgba(139, 105, 20, 0.25)",
            transition: "all 0.2s",
            minWidth: "140px",
          }}
          onMouseEnter={(e) => {
            if (!isComplete) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(139, 105, 20, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isComplete) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 105, 20, 0.25)";
            }
          }}
        >
          {isComplete ? "✓ تم الذكر" : "سبّح"}
        </button>
      </div>
    </div>
  );
}