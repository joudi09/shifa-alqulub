"use client";

import { useEffect, useState } from "react";
import DhikrCard from "@/components/DhikrCard";
import adhkarData from "@/data/adhkar.json";

type Dhikr = {
  id: string;
  text: string;
  count: number;
  virtue: string;
  reference: string;
};

export default function MorningAdhkarPage() {
  const [adhkar, setAdhkar] = useState<Dhikr[]>([]);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setAdhkar(adhkarData.morning);
  }, []);

  const resetAll = () => {
    adhkar.forEach((d) => localStorage.removeItem(`dhikr_${d.id}`));
    setResetKey((k) => k + 1);
    window.location.reload();
  };

  const completedCount = adhkar.filter((d) => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(`dhikr_${d.id}`) : null;
    return saved && parseInt(saved) >= d.count;
  }).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      
      {/* العنوان */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl md:text-5xl font-bold text-gold gold-glow mb-3"
          style={{ fontFamily: "var(--font-amiri)" }}
        >
          أذكار الصباح
        </h1>
        <div className="diamond-divider mx-auto mb-4">
          <div className="w-3 h-3 rotate-45 border-2 border-[#c9a227] bg-[#fdfcf7]" />
        </div>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          حصّن يومك بأذكار الصباح المأثورة عن النبي ﷺ
        </p>
      </div>

      {/* شريط الحالة */}
      <div
        style={{
          backgroundColor: "rgba(201, 162, 39, 0.08)",
          border: "1px solid rgba(201, 162, 39, 0.3)",
          borderRadius: "16px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #daa520, #8b6914)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "13px", color: "#8b6914", fontWeight: 600, margin: 0 }}>
              إجمالي الأذكار
            </p>
            <p style={{ fontSize: "18px", color: "#8b6914", fontWeight: 700, margin: 0 }}>
              {adhkar.length} ذكر
            </p>
          </div>
        </div>

        <button
          onClick={resetAll}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(201, 162, 39, 0.4)",
            backgroundColor: "white",
            color: "#8b6914",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          🔄 إعادة تعيين الكل
        </button>
      </div>

      {/* الأذكار */}
      <div key={resetKey}>
        {adhkar.map((dhikr) => (
          <DhikrCard key={dhikr.id} dhikr={dhikr} />
        ))}
      </div>
    </div>
  );
}