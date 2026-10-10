import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      
      {/* العنوان */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl md:text-5xl font-bold text-gold gold-glow mb-3"
          style={{ fontFamily: "var(--font-amiri)" }}
        >
          عن الموقع
        </h1>
        <div className="diamond-divider mx-auto mb-4">
          <div className="w-3 h-3 rotate-45 border-2 border-[#c9a227] bg-[#fdfcf7]" />
        </div>
      </div>

      {/* عن الموقع */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          border: "1px solid rgba(201, 162, 39, 0.3)",
          padding: "32px",
          marginBottom: "24px",
          boxShadow: "0 4px 16px rgba(139, 105, 20, 0.06)",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#8b6914",
            marginBottom: "16px",
            fontFamily: "var(--font-amiri)",
          }}
        >
          شفاء القلوب
        </h2>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "2",
            color: "#404040",
            margin: 0,
          }}
        >
          موقع إسلامي شامل يجمع لك القرآن الكريم، أذكار الصباح والمساء، الأدعية المأثورة،
          والمسبحة الإلكترونية في تجربة أنيقة وسهلة. نسأل الله أن ينفع به، وأن يجعله
          في ميزان حسنات كل من ساهم فيه.
        </p>
      </div>

      {/* المطوّرة */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          border: "2px solid rgba(201, 162, 39, 0.4)",
          padding: "32px",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(139, 105, 20, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* زخرفة خلفية */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "-40px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(218, 165, 32, 0.1) 0%, transparent 70%)",
          }}
        />

        <div style={{ position: "relative" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "4px",
              color: "#a8841c",
              fontWeight: 600,
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            Joudi Ibrahim Sabbagh
          </p>

          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "8px",
              background: "linear-gradient(135deg, #b8860b 0%, #daa520 50%, #8b6914 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
           
          </h2>

          <p
            style={{
              fontSize: "14px",
              color: "#a8841c",
              textAlign: "center",
              letterSpacing: "2px",
              marginBottom: "24px",
              fontWeight: 500,
            }}
          >
          
          </p>

          <div
            style={{
              width: "60px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
              margin: "0 auto 24px",
            }}
          />

          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.9",
              color: "#525252",
              textAlign: "center",
              margin: 0,
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            صُمّم وطُوّر هذا الموقع بعناية ليكون رفيقاً إسلامياً شاملاً لكل مسلم.
            نسأل الله أن يتقبّل هذا العمل، وأن يجعله نافعاً لعباده.
          </p>
        </div>
      </div>

      {/* زر العودة */}
      <div style={{ textAlign: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 28px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(139, 105, 20, 0.3)",
            transition: "all 0.2s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}