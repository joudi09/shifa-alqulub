export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#c9a227]/30 bg-[#fdfcf7]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* الآية */}
        <div className="text-center space-y-4 mb-8">
          <p
            className="text-3xl md:text-4xl text-gold leading-relaxed"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            ﴿ وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ ﴾
          </p>
          <div className="diamond-divider mx-auto">
            <div className="w-3 h-3 rotate-45 border-2 border-[#c9a227] bg-[#fdfcf7]" />
          </div>
        </div>

        {/* معلومات المطوّر */}
        <div className="text-center space-y-3 pt-6 border-t border-[#c9a227]/20">
          <p className="text-[11px] tracking-[4px] text-[#a8841c] font-semibold uppercase">
            Developed by
          </p>
          <p
            className="text-2xl md:text-3xl font-bold"
            style={{
              fontFamily: "var(--font-amiri)",
              background: "linear-gradient(135deg, #b8860b 0%, #daa520 50%, #8b6914 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Joudi Ibrahim Sabbagh
          </p>
          <p className="text-[11px] tracking-[3px] text-[#a8841c]/70 font-medium uppercase">
            Software Engineer
          </p>
        </div>

        {/* حقوق النشر */}
        <div className="text-center mt-8 pt-6 border-t border-[#c9a227]/20">
          <p className="text-xs text-neutral-500">
        
          </p>
        </div>
      </div>
    </footer>
  );
}