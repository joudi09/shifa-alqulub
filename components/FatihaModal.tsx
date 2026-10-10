"use client";

import { useEffect, useState } from "react";

const names = [
  ["خليل صباغ", "فخري محاحي"],
  ["دلال ديب", "فلاح تقي الدين"],
];

export default function FatihaModal() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShow(false);
      setClosing(false);
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 46, 36, 0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        opacity: closing ? 0 : 1,
        transition: "opacity 0.3s",
      }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fdfcf7",
          borderRadius: "24px",
          border: "3px solid #c9a227",
          padding: "32px 24px",
          maxWidth: "460px",
          width: "100%",
          position: "relative",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35), inset 0 0 60px rgba(201, 162, 39, 0.05)",
          transform: closing ? "scale(0.9)" : "scale(1)",
          transition: "transform 0.3s",
          overflow: "hidden",
        }}
      >
        {/* إطار داخلي ذهبي */}
        <div
          style={{
            position: "absolute",
            inset: "8px",
            border: "1px solid rgba(201, 162, 39, 0.4)",
            borderRadius: "18px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", textAlign: "center" }}>
          
          {/* ﷽ */}
          <div
            style={{
              fontSize: "28px",
              color: "#c9a227",
              fontFamily: "var(--font-amiri)",
              marginBottom: "12px",
              lineHeight: 1,
            }}
          >
            ﷽
          </div>

          {/* العنوان */}
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#8b6914",
              margin: 0,
              marginBottom: "6px",
              fontFamily: "var(--font-amiri)",
            }}
          >
            الفاتحة على روح
          </h2>

          <div
            style={{
              width: "50px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
              margin: "8px auto 16px",
            }}
          />

          {/* الأسماء - صفين */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {names.map((pair, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: 600,
                    color: "#1f2937",
                    fontFamily: "var(--font-amiri)",
                  }}
                >
                  {pair[0]}
                </span>
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: "#c9a227",
                    flexShrink: 0,
                  }}
                ></span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: 600,
                    color: "#1f2937",
                    fontFamily: "var(--font-amiri)",
                  }}
                >
                  {pair[1]}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              width: "50px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
              margin: "0 auto 20px",
            }}
          />

          {/* سورة الفاتحة كاملة */}
          <div
            style={{
              backgroundColor: "rgba(201, 162, 39, 0.06)",
              border: "1px solid rgba(201, 162, 39, 0.25)",
              borderRadius: "14px",
              padding: "18px 14px",
              marginBottom: "16px",
            }}
          >
            {/* البسملة */}
            <p
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#8b6914",
                margin: 0,
                marginBottom: "14px",
                fontFamily: "var(--font-amiri)",
                lineHeight: 1.8,
                direction: "rtl",
                paddingBottom: "14px",
                borderBottom: "1px dashed rgba(201, 162, 39, 0.35)",
              }}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>

            {/* الآيات */}
            <p
              style={{
                fontSize: "17px",
                lineHeight: "2",
                color: "#1f2937",
                margin: 0,
                fontFamily: "var(--font-amiri)",
                direction: "rtl",
              }}
            >
              ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ﴿٢﴾ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ﴿٣﴾ مَـٰلِكِ يَوْمِ ٱلدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ﴿٦﴾ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ ﴿٧﴾
            </p>
          </div>

          {/* دعاء */}
          <p
            style={{
              fontSize: "13px",
              color: "#737373",
              lineHeight: 1.6,
              marginBottom: "20px",
              fontStyle: "italic",
            }}
          >
            اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ وَعَافِهِمْ وَاعْفُ عَنْهُمْ
          </p>

          {/* الزر */}
          <button
            onClick={handleClose}
            style={{
              padding: "14px 40px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
              color: "white",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(139, 105, 20, 0.3)",
              transition: "all 0.2s",
              fontFamily: "var(--font-cairo)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(139, 105, 20, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(139, 105, 20, 0.3)";
            }}
          >
            ✓ قرأت الفاتحة
          </button>
        </div>
      </div>
    </div>
  );
}