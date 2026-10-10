"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FridayReminder() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 5 = الجمعة
    const isFriday = dayOfWeek === 5;

    if (!isFriday) return;

    const todayStr = today.toDateString();
    const dismissedDate = localStorage.getItem("friday_reminder_dismissed");

    if (dismissedDate !== todayStr) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      const todayStr = new Date().toDateString();
      localStorage.setItem("friday_reminder_dismissed", todayStr);
      setShow(false);
      setClosing(false);
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto 16px",
        padding: "0 24px",
        opacity: closing ? 0 : 1,
        transform: closing ? "translateY(-10px)" : "translateY(0)",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #daa520 0%, #b8860b 100%)",
          borderRadius: "14px",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          boxShadow: "0 4px 16px rgba(139, 105, 20, 0.25)",
          flexWrap: "wrap",
        }}
      >
        {/* النص */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "white",
              margin: 0,
              fontFamily: "var(--font-amiri)",
            }}
          >
            🕌 يوم الجمعة المبارك — لا تنسَ قراءة سورة الكهف
          </p>
        </div>

        {/* الأزرار */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/quran/18"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#8b6914",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            اقرأ الآن
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>

          <button
            onClick={handleClose}
            aria-label="إغلاق"
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}