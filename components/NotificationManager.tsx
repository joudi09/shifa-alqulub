"use client";

import { useEffect, useState } from "react";
import {
  getDailyVerse,
  shouldSendDailyVerse,
  wasVerseSentToday,
  markVerseSent,
} from "@/lib/dailyVerses";

const CHECK_INTERVAL = 60 * 1000;

const shouldNotify = (day: number, hour: number): boolean => {
  const now = new Date();
  const today = now.getDay();
  const currentHour = now.getHours();
  return today === day && currentHour === hour;
};

const alreadySent = (key: string): boolean => {
  const today = new Date().toDateString();
  return localStorage.getItem(`notif_${key}_${today}`) === "sent";
};

const markAsSent = (key: string): void => {
  const today = new Date().toDateString();
  localStorage.setItem(`notif_${key}_${today}`, "sent");
};

export default function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [showAskButton, setShowAskButton] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      if (Notification.permission === "default") {
        const timer = setTimeout(() => setShowAskButton(true), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    if (permission !== "granted") return;

    const checkNotifications = () => {
      if (shouldNotify(5, 8) && !alreadySent("friday")) {
        new Notification("🕌 يوم الجمعة المبارك", {
          body: "لا تنسَ قراءة سورة الكهف\n﴿إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ﴾",
          icon: "/web-app-manifest-192x192.png",
          badge: "/web-app-manifest-192x192.png",
        });
        markAsSent("friday");
      }

      if (shouldNotify(4, 18) && !alreadySent("thursday")) {
        new Notification("🌙 غداً الجمعة", {
          body: "استعد لقراءة سورة الكهف والصلاة على النبي ﷺ",
          icon: "/web-app-manifest-192x192.png",
          badge: "/web-app-manifest-192x192.png",
        });
        markAsSent("thursday");
      }

      if (shouldSendDailyVerse() && !wasVerseSentToday()) {
        const verse = getDailyVerse();
        new Notification("✨ آية اليوم", {
          body: `﴿${verse.text}﴾\n\nسورة ${verse.surah} — الآية ${verse.ayah}`,
          icon: "/web-app-manifest-192x192.png",
          badge: "/web-app-manifest-192x192.png",
        });
        markVerseSent();
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [permission]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("متصفحك لا يدعم الإشعارات");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      setShowAskButton(false);
      new Notification("✅ تم تفعيل الإشعارات", {
        body: "سنذكّرك بآية اليوم وسورة الكهف وأذكار الصباح والمساء",
        icon: "/web-app-manifest-192x192.png",
      });
    }
  };

  if (!showAskButton) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "140px",
        right: "20px",
        zIndex: 9998,
        maxWidth: "320px",
        backgroundColor: "white",
        borderRadius: "16px",
        border: "2px solid #c9a227",
        padding: "16px",
        boxShadow: "0 12px 32px rgba(139, 105, 20, 0.25)",
      }}
    >
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#8b6914",
              margin: 0,
              marginBottom: "2px",
              fontFamily: "var(--font-amiri)",
            }}
          >
            فعّل الإشعارات
          </p>
          <p style={{ fontSize: "11px", color: "#737373", margin: 0, lineHeight: 1.5 }}>
            آية يومية + تذكير بسورة الكهف
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={requestPermission}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #daa520 0%, #8b6914 100%)",
            color: "white",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          فعّل
        </button>
        <button
          onClick={() => setShowAskButton(false)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(201, 162, 39, 0.4)",
            backgroundColor: "white",
            color: "#8b6914",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          لاحقاً
        </button>
      </div>
    </div>
  );
}