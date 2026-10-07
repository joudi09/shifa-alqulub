"use client";

import { useEffect, useState } from "react";

type DhikrOption = {
  id: string;
  text: string;
  target: number;
  isCustom?: boolean;
};

const defaultDhikrOptions: DhikrOption[] = [
  { id: "subhan", text: "سُبْحَانَ اللَّهِ", target: 33 },
  { id: "hamd", text: "الْحَمْدُ لِلَّهِ", target: 33 },
  { id: "akbar", text: "اللَّهُ أَكْبَرُ", target: 34 },
  { id: "tahlil", text: "لَا إِلَٰهَ إِلَّا اللَّهُ", target: 100 },
  { id: "istighfar", text: "أَسْتَغْفِرُ اللَّهَ", target: 100 },
  { id: "salawat", text: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", target: 100 },
  { id: "hawqala", text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", target: 100 },
  { id: "subhan_hamd", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", target: 100 },
];

export default function TasbihPage() {
  const [customDhikrs, setCustomDhikrs] = useState<DhikrOption[]>([]);
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrOption>(defaultDhikrOptions[0]);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [target, setTarget] = useState(defaultDhikrOptions[0].target);
  const [pulse, setPulse] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDhikrText, setNewDhikrText] = useState("");
  const [newDhikrTarget, setNewDhikrTarget] = useState(33);

  // استرجاع الأذكار المخصصة
  useEffect(() => {
    const saved = localStorage.getItem("custom_dhikrs");
    if (saved) {
      try {
        setCustomDhikrs(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // استرجاع بيانات الذكر المحدد
  useEffect(() => {
    const saved = localStorage.getItem(`tasbih_${selectedDhikr.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setCount(data.count || 0);
      setRounds(data.rounds || 0);
      setTarget(data.target || selectedDhikr.target);
    } else {
      setCount(0);
      setRounds(0);
      setTarget(selectedDhikr.target);
    }
  }, [selectedDhikr.id]);

  // حفظ تلقائي
  useEffect(() => {
    const data = { count, rounds, target };
    localStorage.setItem(`tasbih_${selectedDhikr.id}`, JSON.stringify(data));
  }, [count, rounds, target, selectedDhikr.id]);

  const handleTasbih = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 150);

    const newCount = count + 1;

    if (newCount >= target) {
      setCount(0);
      setRounds(rounds + 1);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
    } else {
      setCount(newCount);
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
  };

  const handleReset = () => {
    if (confirm("هل أنت متأكد من إعادة التعيين؟")) {
      setCount(0);
      setRounds(0);
      localStorage.removeItem(`tasbih_${selectedDhikr.id}`);
    }
  };

  // إضافة ذكر مخصص
  const handleAddCustom = () => {
    const trimmed = newDhikrText.trim();
    if (!trimmed) {
      alert("الرجاء كتابة نص الذكر");
      return;
    }
    if (newDhikrTarget < 1) {
      alert("الهدف يجب أن يكون 1 على الأقل");
      return;
    }

    const newDhikr: DhikrOption = {
      id: `custom_${Date.now()}`,
      text: trimmed,
      target: newDhikrTarget,
      isCustom: true,
    };

    const updated = [...customDhikrs, newDhikr];
    setCustomDhikrs(updated);
    localStorage.setItem("custom_dhikrs", JSON.stringify(updated));

    setSelectedDhikr(newDhikr);
    setNewDhikrText("");
    setNewDhikrTarget(33);
    setShowAddForm(false);
  };

  // حذف ذكر مخصص
  const handleDeleteCustom = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الذكر؟")) return;

    const updated = customDhikrs.filter((d) => d.id !== id);
    setCustomDhikrs(updated);
    localStorage.setItem("custom_dhikrs", JSON.stringify(updated));
    localStorage.removeItem(`tasbih_${id}`);

    if (selectedDhikr.id === id) {
      setSelectedDhikr(defaultDhikrOptions[0]);
    }
  };

  const allDhikrs = [...defaultDhikrOptions, ...customDhikrs];
  const progress = (count / target) * 100;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      
      {/* العنوان */}
      <div className="text-center mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold text-gold gold-glow mb-3"
          style={{ fontFamily: "var(--font-amiri)" }}
        >
          المسبحة
        </h1>
        <div className="diamond-divider mx-auto mb-4">
          <div className="w-3 h-3 rotate-45 border-2 border-[#c9a227] bg-[#fdfcf7]" />
        </div>
        <p className="text-sm text-neutral-600">
          سبّح واحفظ أذكارك
        </p>
      </div>

      {/* اختيار الذكر */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}
      >
        {allDhikrs.map((d) => {
          const isActive = selectedDhikr.id === d.id;
          return (
            <div
              key={d.id}
              style={{
                position: "relative",
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => {
                  setSelectedDhikr(d);
                  setShowSettings(false);
                  setShowAddForm(false);
                }}
                style={{
                  padding: "10px 18px",
                  paddingLeft: d.isCustom ? "18px" : "18px",
                  paddingRight: d.isCustom ? "42px" : "18px",
                  borderRadius: "999px",
                  border: isActive ? "2px solid #8b6914" : "1px solid rgba(201, 162, 39, 0.3)",
                  background: isActive
                    ? "linear-gradient(135deg, #daa520 0%, #8b6914 100%)"
                    : "white",
                  color: isActive ? "white" : "#8b6914",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-amiri)",
                  boxShadow: isActive ? "0 4px 12px rgba(139, 105, 20, 0.25)" : "none",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {d.text}
              </button>

              {/* زر حذف للذكر المخصص */}
              {d.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCustom(d.id);
                  }}
                  aria-label="حذف"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "8px",
                    transform: "translateY(-50%)",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "rgba(201, 162, 39, 0.1)",
                    color: isActive ? "white" : "#8b6914",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}

        {/* زر إضافة ذكر */}
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowSettings(false);
          }}
          style={{
            padding: "10px 18px",
            borderRadius: "999px",
            border: "2px dashed rgba(201, 162, 39, 0.5)",
            background: showAddForm ? "rgba(201, 162, 39, 0.1)" : "white",
            color: "#8b6914",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          ذكر مخصص
        </button>
      </div>

      {/* نموذج إضافة ذكر */}
      {showAddForm && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            border: "2px solid rgba(201, 162, 39, 0.4)",
            padding: "24px",
            marginBottom: "20px",
            boxShadow: "0 4px 16px rgba(139, 105, 20, 0.08)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#8b6914",
              marginBottom: "16px",
              margin: 0,
              fontFamily: "var(--font-amiri)",
            }}
          >
            إضافة ذكر مخصص
          </h3>

          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "#8b6914",
              marginBottom: "8px",
              marginTop: "16px",
            }}
          >
            نص الذكر
          </label>
          <input
            type="text"
            value={newDhikrText}
            onChange={(e) => setNewDhikrText(e.target.value)}
            placeholder="مثال: سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(201, 162, 39, 0.4)",
              fontSize: "15px",
              color: "#404040",
              outline: "none",
              fontFamily: "var(--font-amiri)",
              textAlign: "right",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#c9a227";
              e.target.style.boxShadow = "0 0 0 3px rgba(201, 162, 39, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(201, 162, 39, 0.4)";
              e.target.style.boxShadow = "none";
            }}
          />

          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "#8b6914",
              marginBottom: "8px",
              marginTop: "16px",
            }}
          >
            الهدف (عدد المرات)
          </label>
          <input
            type="number"
            value={newDhikrTarget}
            onChange={(e) => setNewDhikrTarget(parseInt(e.target.value) || 0)}
            min="1"
            max="10000"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(201, 162, 39, 0.4)",
              fontSize: "15px",
              color: "#404040",
              outline: "none",
              textAlign: "center",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#c9a227";
              e.target.style.boxShadow = "0 0 0 3px rgba(201, 162, 39, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(201, 162, 39, 0.4)";
              e.target.style.boxShadow = "none";
            }}
          />

          {/* أزرار سريعة للهدف */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "12px",
              justifyContent: "center",
            }}
          >
            {[10, 33, 100, 500, 1000].map((t) => (
              <button
                key={t}
                onClick={() => setNewDhikrTarget(t)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  border: newDhikrTarget === t ? "2px solid #8b6914" : "1px solid rgba(201, 162, 39, 0.3)",
                  background: newDhikrTarget === t
                    ? "linear-gradient(135deg, #daa520 0%, #8b6914 100%)"
                    : "white",
                  color: newDhikrTarget === t ? "white" : "#8b6914",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* أزرار الإجراء */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={handleAddCustom}
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
                color: "white",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(139, 105, 20, 0.25)",
                transition: "all 0.2s",
              }}
            >
              ✓ إضافة الذكر
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewDhikrText("");
                setNewDhikrTarget(33);
              }}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(201, 162, 39, 0.4)",
                backgroundColor: "white",
                color: "#8b6914",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* البطاقة الرئيسية */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "28px",
          border: "2px solid rgba(201, 162, 39, 0.3)",
          padding: "32px 24px",
          boxShadow: "0 8px 32px rgba(139, 105, 20, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "6px",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #daa520, #c9a227)",
            transition: "width 0.2s",
          }}
        />

        <p
          style={{
            textAlign: "center",
            fontSize: "32px",
            fontWeight: 700,
            color: "#8b6914",
            marginBottom: "24px",
            fontFamily: "var(--font-amiri)",
            lineHeight: 1.5,
          }}
        >
          {selectedDhikr.text}
        </p>

        {/* العدّاد */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: `conic-gradient(#daa520 ${progress}%, rgba(201, 162, 39, 0.15) 0)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              transform: pulse ? "scale(1.05)" : "scale(1)",
              boxShadow: pulse
                ? "0 0 30px rgba(218, 165, 32, 0.5)"
                : "0 4px 20px rgba(139, 105, 20, 0.15)",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "60px",
                  fontWeight: 700,
                  color: "#8b6914",
                  lineHeight: 1,
                  fontFamily: "var(--font-amiri)",
                }}
              >
                {count}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "#a8841c",
                  marginTop: "4px",
                  fontWeight: 600,
                }}
              >
                من {target}
              </span>
            </div>
          </div>
        </div>

        {/* معلومات الدورات */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginBottom: "28px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#737373", margin: 0, marginBottom: "4px" }}>
              الدورات المكتملة
            </p>
            <p
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#8b6914",
                margin: 0,
                fontFamily: "var(--font-amiri)",
              }}
            >
              {rounds}
            </p>
          </div>

          <div style={{ width: "1px", backgroundColor: "rgba(201, 162, 39, 0.3)" }} />

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#737373", margin: 0, marginBottom: "4px" }}>
              الهدف الحالي
            </p>
            <p
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#8b6914",
                margin: 0,
                fontFamily: "var(--font-amiri)",
              }}
            >
              {target}
            </p>
          </div>
        </div>

        {/* زر التسبيح */}
        <button
          onClick={handleTasbih}
          style={{
            width: "100%",
            padding: "24px",
            borderRadius: "20px",
            border: "none",
            background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
            color: "white",
            fontSize: "22px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(139, 105, 20, 0.3)",
            transition: "all 0.15s",
            fontFamily: "var(--font-amiri)",
            letterSpacing: "1px",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.98)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 105, 20, 0.4)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(139, 105, 20, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(139, 105, 20, 0.3)";
          }}
        >
          سَبِّح
        </button>

        {/* أزرار صغيرة */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => setShowSettings(!showSettings)}
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
            ⚙️ تغيير الهدف
          </button>

          <button
            onClick={handleReset}
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
            🔄 إعادة تعيين
          </button>
        </div>

        {/* إعدادات الهدف */}
        {showSettings && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "rgba(201, 162, 39, 0.06)",
              borderRadius: "16px",
              border: "1px solid rgba(201, 162, 39, 0.2)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#8b6914",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              اختر الهدف
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {[33, 34, 100, 500, 1000].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTarget(t);
                    setCount(0);
                    setShowSettings(false);
                  }}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "999px",
                    border: target === t ? "2px solid #8b6914" : "1px solid rgba(201, 162, 39, 0.3)",
                    background: target === t
                      ? "linear-gradient(135deg, #daa520 0%, #8b6914 100%)"
                      : "white",
                    color: target === t ? "white" : "#8b6914",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* آية */}
      <p
        className="text-center mt-10"
        style={{
          fontFamily: "var(--font-amiri)",
          fontSize: "20px",
          color: "#8b6914",
          lineHeight: 1.8,
        }}
      >
        ﴿ فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ ﴾
      </p>
    </div>
  );
}