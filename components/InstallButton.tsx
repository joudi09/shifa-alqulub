"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem("install_button_dismissed");
    if (wasDismissed === "true") {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShow(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("install_button_dismissed", "true");
  };

  if (!show || dismissed || !deferredPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9997,
        maxWidth: "300px",
        backgroundColor: "white",
        borderRadius: "16px",
        border: "2px solid #c9a227",
        padding: "14px",
        boxShadow: "0 12px 32px rgba(139, 105, 20, 0.25)",
        animation: "slideInRight 0.4s ease-out",
      }}
    >
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#8b6914",
              margin: 0,
              marginBottom: "2px",
              fontFamily: "var(--font-amiri)",
            }}
          >
            ثبّت التطبيق
          </p>
          <p style={{ fontSize: "11px", color: "#737373", margin: 0, lineHeight: 1.4 }}>
            أضف شفاء القلوب لشاشتك الرئيسية
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        <button
          onClick={handleInstall}
          style={{
            flex: 1,
            padding: "9px 12px",
            borderRadius: "9px",
            border: "none",
            background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
            color: "white",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          تثبيت
        </button>
        <button
          onClick={handleDismiss}
          style={{
            padding: "9px 12px",
            borderRadius: "9px",
            border: "1px solid rgba(201, 162, 39, 0.4)",
            backgroundColor: "white",
            color: "#8b6914",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          لاحقاً
        </button>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}