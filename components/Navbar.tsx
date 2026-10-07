"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/quran", label: "القرآن" },
  { href: "/adhkar/morning", label: "أذكار الصباح" },
  { href: "/adhkar/evening", label: "أذكار المساء" },
  { href: "/duas", label: "الأدعية" },
  { href: "/tasbih", label: "التسبيح" },
  { href: "/about", label: "عن الموقع" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(253, 252, 247, 0.95)" : "rgba(253, 252, 247, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(201, 162, 39, 0.2)",
          boxShadow: scrolled ? "0 4px 20px rgba(139, 105, 20, 0.08)" : "0 1px 3px rgba(0, 0, 0, 0.03)",
        }}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-20">
          
          {/* الشعار */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            {/* أيقونة الشعار */}
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(139, 105, 20, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotate(-5deg) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotate(0deg) scale(1)";
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>

            {/* اسم الموقع */}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #b8860b 0%, #daa520 50%, #8b6914 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "var(--font-amiri)",
                }}
              >
                شفاء القلوب
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "#a8841c",
                  letterSpacing: "3px",
                  marginTop: "2px",
                  opacity: 0.7,
                }}
              >
                SHIFA AL-QULUB
              </span>
            </div>
          </Link>

          {/* روابط سطح المكتب */}
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
            className="hidden lg:flex"
          >
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href} style={{ position: "relative" }}>
                  <Link
                    href={l.href}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: active ? "#8b6914" : "#525252",
                      textDecoration: "none",
                      borderRadius: "10px",
                      transition: "all 0.25s",
                      position: "relative",
                      backgroundColor: active ? "rgba(201, 162, 39, 0.08)" : "transparent",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "rgba(201, 162, 39, 0.06)";
                        e.currentTarget.style.color = "#8b6914";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#525252";
                      }
                    }}
                  >
                    {l.label}
                    {active && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "2px",
                          right: "50%",
                          transform: "translateX(50%)",
                          width: "20px",
                          height: "2px",
                          borderRadius: "2px",
                          background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* زر القائمة للموبايل */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden"
            aria-label="القائمة"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              border: "1px solid rgba(201, 162, 39, 0.3)",
              backgroundColor: open ? "rgba(201, 162, 39, 0.1)" : "white",
              color: "#8b6914",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M3 7h18" />
                  <path d="M3 12h18" />
                  <path d="M3 17h18" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* قائمة الموبايل */}
        <div
          className="lg:hidden"
          style={{
            maxHeight: open ? "600px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
            borderTop: open ? "1px solid rgba(201, 162, 39, 0.2)" : "none",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: "12px 16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 16px",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: active ? "#8b6914" : "#525252",
                      textDecoration: "none",
                      borderRadius: "12px",
                      backgroundColor: active ? "rgba(201, 162, 39, 0.1)" : "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "#c9a227",
                        }}
                      />
                    )}
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      {/* Overlay للموبايل */}
      {open && (
        <div
          className="lg:hidden"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 40,
          }}
        />
      )}
    </>
  );
}