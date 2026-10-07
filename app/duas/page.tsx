"use client";

import { useState, useMemo } from "react";
import duasData from "@/data/duas.json";

type Dua = {
  id: string;
  category: string;
  title: string;
  text: string;
  reference: string;
};

type Category = {
  id: string;
  name: string;
};

export default function DuasPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: Category[] = duasData.categories;
  const duas: Dua[] = duasData.duas;

  const filteredDuas = useMemo(() => {
    return duas.filter((d) => {
      const matchCategory = selectedCategory === "all" || d.category === selectedCategory;
      const matchSearch =
        search === "" ||
        d.title.includes(search) ||
        d.text.includes(search) ||
        d.reference.includes(search);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, search, duas]);

  const copyDua = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      
      {/* العنوان */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl md:text-5xl font-bold text-gold gold-glow mb-3"
          style={{ fontFamily: "var(--font-amiri)" }}
        >
          الأدعية
        </h1>
        <div className="diamond-divider mx-auto mb-4">
          <div className="w-3 h-3 rotate-45 border-2 border-[#c9a227] bg-[#fdfcf7]" />
        </div>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          أدعية مأثورة من الكتاب والسنة لكل مناسبة
        </p>
      </div>

      {/* البحث */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن دعاء..."
            style={{
              width: "100%",
              padding: "14px 50px 14px 50px",
              borderRadius: "16px",
              border: "2px solid rgba(201, 162, 39, 0.3)",
              backgroundColor: "white",
              fontSize: "16px",
              color: "#404040",
              textAlign: "center",
              outline: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#c9a227";
              e.target.style.boxShadow = "0 0 0 4px rgba(201, 162, 39, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(201, 162, 39, 0.3)";
              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
            }}
          />
          <svg
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#c9a227",
              pointerEvents: "none",
            }}
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
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "rgba(201, 162, 39, 0.1)",
                color: "#8b6914",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="مسح"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* التصنيفات */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "32px",
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                border: isActive ? "2px solid #8b6914" : "1px solid rgba(201, 162, 39, 0.35)",
                background: isActive
                  ? "linear-gradient(135deg, #daa520 0%, #8b6914 100%)"
                  : "white",
                color: isActive ? "white" : "#8b6914",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: isActive ? "0 4px 12px rgba(139, 105, 20, 0.25)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(201, 162, 39, 0.08)";
                  e.currentTarget.style.borderColor = "#c9a227";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "rgba(201, 162, 39, 0.35)";
                }
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* عدد النتائج */}
      <p
        style={{
          textAlign: "center",
          fontSize: "13px",
          color: "#737373",
          marginBottom: "20px",
        }}
      >
        {filteredDuas.length > 0
          ? `تم العثور على ${filteredDuas.length} دعاء`
          : "لا توجد أدعية مطابقة"}
      </p>

      {/* قائمة الأدعية */}
      {filteredDuas.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredDuas.map((dua) => {
            const isCopied = copiedId === dua.id;
            return (
              <div
                key={dua.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  border: "1px solid rgba(201, 162, 39, 0.3)",
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(139, 105, 20, 0.06)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(139, 105, 20, 0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(139, 105, 20, 0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* رأس البطاقة */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#8b6914",
                        margin: 0,
                        marginBottom: "6px",
                        fontFamily: "var(--font-amiri)",
                      }}
                    >
                      {dua.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#a8841c",
                        backgroundColor: "rgba(201, 162, 39, 0.1)",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontWeight: 600,
                      }}
                    >
                      {dua.reference}
                    </span>
                  </div>

                  <button
                    onClick={() => copyDua(dua.id, dua.text)}
                    aria-label="نسخ"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      border: "1px solid rgba(201, 162, 39, 0.3)",
                      backgroundColor: isCopied ? "rgba(22, 163, 74, 0.1)" : "white",
                      color: isCopied ? "#16a34a" : "#8b6914",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    {isCopied ? (
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
                </div>

                {/* نص الدعاء */}
                <p
                  style={{
                    fontSize: "19px",
                    lineHeight: "2",
                    color: "#1f2937",
                    textAlign: "justify",
                    margin: 0,
                    fontFamily: "var(--font-amiri)",
                    direction: "rtl",
                  }}
                >
                  {dua.text}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#737373",
          }}
        >
          <p style={{ fontSize: "16px" }}>لا توجد أدعية مطابقة لبحثك</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
            style={{
              marginTop: "12px",
              color: "#8b6914",
              background: "none",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            إعادة التعيين
          </button>
        </div>
      )}
    </div>
  );
}