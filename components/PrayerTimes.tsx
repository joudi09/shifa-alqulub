"use client";

import { useEffect, useState } from "react";

type Timings = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

type PrayerData = {
  timings: Timings;
  date: {
    hijri: {
      day: string;
      month: { ar: string };
      year: string;
    };
  };
};

const prayerNames: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const format12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "م" : "ص";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const paddedHour = hour12.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${paddedHour}:${paddedMinutes} ${period}`;
};

const syrianLocations = [
  { name: "دمشق", lat: 33.5138, lng: 36.2765, region: "دمشق" },
  { name: "قدسيا", lat: 33.5417, lng: 36.2167, region: "ريف دمشق" },
  { name: "ضاحية قدسيا", lat: 33.55, lng: 36.2, region: "ريف دمشق" },
  { name: "جرمانا", lat: 33.4833, lng: 36.35, region: "ريف دمشق" },
  { name: "عربين", lat: 33.5, lng: 36.3667, region: "ريف دمشق" },
  { name: "دوما", lat: 33.5714, lng: 36.4028, region: "ريف دمشق" },
  { name: "حرستا", lat: 33.5667, lng: 36.3667, region: "ريف دمشق" },
  { name: "داريا", lat: 33.4667, lng: 36.2333, region: "ريف دمشق" },
  { name: "صحنايا", lat: 33.4667, lng: 36.25, region: "ريف دمشق" },
  { name: "معضمية الشام", lat: 33.4667, lng: 36.2, region: "ريف دمشق" },
  { name: "الكسوة", lat: 33.3667, lng: 36.25, region: "ريف دمشق" },
  { name: "التل", lat: 33.6333, lng: 36.3167, region: "ريف دمشق" },
  { name: "الزبداني", lat: 33.7167, lng: 36.1, region: "ريف دمشق" },
  { name: "مضايا", lat: 33.7333, lng: 36.0833, region: "ريف دمشق" },
  { name: "بلودان", lat: 33.7333, lng: 36.0667, region: "ريف دمشق" },
  { name: "النبك", lat: 34.0167, lng: 36.7333, region: "ريف دمشق" },
  { name: "يبرود", lat: 33.9667, lng: 36.65, region: "ريف دمشق" },
  { name: "القطيفة", lat: 33.7333, lng: 36.6, region: "ريف دمشق" },
  { name: "جيرود", lat: 33.8167, lng: 36.5167, region: "ريف دمشق" },
  { name: "الرحيبة", lat: 33.7833, lng: 36.6833, region: "ريف دمشق" },
  { name: "قطنا", lat: 33.6, lng: 36.15, region: "ريف دمشق" },
  { name: "صيدنايا", lat: 33.7333, lng: 36.3833, region: "ريف دمشق" },
  { name: "معلولا", lat: 33.85, lng: 36.55, region: "ريف دمشق" },
  { name: "دير عطية", lat: 34.0, lng: 36.7167, region: "ريف دمشق" },
  { name: "الديماس", lat: 33.65, lng: 36.15, region: "ريف دمشق" },
  { name: "كفر بطنا", lat: 33.55, lng: 36.35, region: "ريف دمشق" },
  { name: "المليحة", lat: 33.5, lng: 36.4, region: "ريف دمشق" },
  { name: "حلب", lat: 36.2021, lng: 37.1343, region: "حلب" },
  { name: "أعزاز", lat: 36.5833, lng: 37.0333, region: "حلب" },
  { name: "الباب", lat: 36.3667, lng: 37.5167, region: "حلب" },
  { name: "منبج", lat: 36.5333, lng: 37.95, region: "حلب" },
  { name: "عين العرب", lat: 36.8833, lng: 38.35, region: "حلب" },
  { name: "جرابلس", lat: 36.8167, lng: 38.0167, region: "حلب" },
  { name: "الأتارب", lat: 36.3667, lng: 36.8167, region: "حلب" },
  { name: "إدلب", lat: 35.9333, lng: 36.6333, region: "إدلب" },
  { name: "معرة النعمان", lat: 35.6333, lng: 36.6667, region: "إدلب" },
  { name: "أريحا", lat: 35.8167, lng: 36.6, region: "إدلب" },
  { name: "جسر الشغور", lat: 35.8167, lng: 36.3167, region: "إدلب" },
  { name: "حمص", lat: 34.7333, lng: 36.7167, region: "حمص" },
  { name: "تدمر", lat: 34.55, lng: 38.2833, region: "حمص" },
  { name: "الرستن", lat: 34.9333, lng: 36.7333, region: "حمص" },
  { name: "تلكلخ", lat: 34.5167, lng: 36.1167, region: "حمص" },
  { name: "القصير", lat: 34.5, lng: 36.5833, region: "حمص" },
  { name: "المخرم", lat: 34.8167, lng: 37.05, region: "حمص" },
  { name: "حماة", lat: 35.1333, lng: 36.75, region: "حماة" },
  { name: "السلمية", lat: 35.0, lng: 37.05, region: "حماة" },
  { name: "مصياف", lat: 35.0667, lng: 36.3333, region: "حماة" },
  { name: "محردة", lat: 35.25, lng: 36.5833, region: "حماة" },
  { name: "اللاذقية", lat: 35.5333, lng: 35.7833, region: "اللاذقية" },
  { name: "جبلة", lat: 35.3667, lng: 35.9167, region: "اللاذقية" },
  { name: "القرداحة", lat: 35.45, lng: 36.0167, region: "اللاذقية" },
  { name: "الحفة", lat: 35.6, lng: 36.0333, region: "اللاذقية" },
  { name: "كسب", lat: 35.9167, lng: 35.9333, region: "اللاذقية" },
  { name: "طرطوس", lat: 34.8833, lng: 35.8833, region: "طرطوس" },
  { name: "بانياس", lat: 35.1833, lng: 35.95, region: "طرطوس" },
  { name: "صافيتا", lat: 34.8167, lng: 36.1167, region: "طرطوس" },
  { name: "دريكيش", lat: 34.9, lng: 36.1333, region: "طرطوس" },
  { name: "الشيخ بدر", lat: 34.9833, lng: 36.0667, region: "طرطوس" },
  { name: "درعا", lat: 32.6167, lng: 36.1, region: "درعا" },
  { name: "إزرع", lat: 32.8667, lng: 36.25, region: "درعا" },
  { name: "نوى", lat: 32.8833, lng: 36.0333, region: "درعا" },
  { name: "الصنمين", lat: 33.0667, lng: 36.1833, region: "درعا" },
  { name: "السويداء", lat: 32.7, lng: 36.5667, region: "السويداء" },
  { name: "صلخد", lat: 32.5, lng: 36.7167, region: "السويداء" },
  { name: "شهبا", lat: 32.85, lng: 36.6167, region: "السويداء" },
  { name: "القنيطرة", lat: 33.1167, lng: 35.8167, region: "القنيطرة" },
  { name: "دير الزور", lat: 35.3333, lng: 40.15, region: "دير الزور" },
  { name: "الميادين", lat: 35.0167, lng: 40.45, region: "دير الزور" },
  { name: "البوكمال", lat: 34.45, lng: 40.9167, region: "دير الزور" },
  { name: "الرقة", lat: 35.95, lng: 39.0167, region: "الرقة" },
  { name: "تل أبيض", lat: 36.7, lng: 38.95, region: "الرقة" },
  { name: "الحسكة", lat: 36.5, lng: 40.75, region: "الحسكة" },
  { name: "القامشلي", lat: 37.05, lng: 41.2167, region: "الحسكة" },
  { name: "رأس العين", lat: 36.85, lng: 40.0667, region: "الحسكة" },
];

const regions = ["دمشق", "ريف دمشق", "حلب", "إدلب", "حمص", "حماة", "اللاذقية", "طرطوس", "درعا", "السويداء", "القنيطرة", "دير الزور", "الرقة", "الحسكة"];

export default function PrayerTimes() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [city, setCity] = useState<string>("دمشق");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("ريف دمشق");
  const [nextPrayerName, setNextPrayerName] = useState<string>("");

  useEffect(() => {
    fetchPrayerTimes(33.5138, 36.2765, "دمشق");
  }, []);

  const fetchPrayerTimes = async (lat: number, lng: number, cityName: string) => {
    try {
      setLoading(true);
      setError("");
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=4`
      );
      const json = await res.json();

      if (json.code === 200) {
        setData(json.data);
        setCity(cityName);

        const now = new Date();
        const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        let found = "الفجر";
        for (const p of prayers) {
          const [hours, minutes] = json.data.timings[p].split(":").map(Number);
          const prayerTime = new Date();
          prayerTime.setHours(hours, minutes, 0, 0);

          if (prayerTime > now) {
            found = prayerNames[p];
            break;
          }
        }
        setNextPrayerName(found);
      }
    } catch {
      setError("تعذر جلب أوقات الصلاة");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (loc: typeof syrianLocations[0]) => {
    setShowCityPicker(false);
    fetchPrayerTimes(loc.lat, loc.lng, loc.name);
  };

  const filteredLocations = syrianLocations.filter((l) => l.region === selectedRegion);

  if (loading) {
    return (
      <div className="mb-8 max-w-3xl mx-auto px-6">
        <div className="rounded-2xl border border-[#c9a227]/30 bg-white/80 p-5 text-center">
          <p className="text-xs text-[#8b6914]">جاري تحميل أوقات الصلاة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 max-w-3xl mx-auto px-6">
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-center">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 max-w-3xl mx-auto px-6">
      <div className="rounded-2xl border border-[#c9a227]/40 bg-white/85 backdrop-blur-sm p-4 md:p-5 shadow-md">

        {/* الهيدر */}
        <div className="text-center mb-4 space-y-3">
          <h2
            className="text-xl md:text-2xl font-bold text-[#8b6914]"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            أوقات الصلاة
          </h2>

          {/* زر المدينة - ستايل جديد يشبه أزرار حجم الخط */}
          <div>
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                borderRadius: "999px",
                backgroundColor: "white",
                border: "2px solid rgba(201, 162, 39, 0.4)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c9a227";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 105, 20, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(201, 162, 39, 0.4)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#8b6914",
                  whiteSpace: "nowrap",
                }}
              >
                المدينة
              </span>

              <span
                style={{
                  width: "1px",
                  height: "18px",
                  backgroundColor: "rgba(201, 162, 39, 0.3)",
                }}
              ></span>

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8b6914"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>

              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#8b6914",
                  fontFamily: "var(--font-amiri)",
                }}
              >
                {city}
              </span>

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8b6914"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: showCityPicker ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          {nextPrayerName && (
            <p className="text-xs text-neutral-500">
              الصلاة القادمة: <span className="font-bold text-[#8b6914]">{nextPrayerName}</span>
            </p>
          )}
        </div>

        {/* اختيار الموقع */}
        {showCityPicker && (
          <div className="mb-4 p-3 rounded-xl bg-[#fdfcf7] border border-[#c9a227]/30">
            <p className="text-[11px] font-bold text-[#8b6914] mb-2 text-center">اختر المحافظة</p>
            <div className="flex flex-wrap justify-center gap-1.5 mb-3 pb-3 border-b border-[#c9a227]/20">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    selectedRegion === r
                      ? "bg-gradient-to-br from-[#daa520] to-[#8b6914] text-white shadow-sm"
                      : "bg-white border border-[#c9a227]/40 text-neutral-700 hover:border-[#c9a227] hover:bg-[#c9a227]/5"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <p className="text-[11px] font-bold text-[#8b6914] mb-2 text-center">
              اختر المنطقة ({selectedRegion})
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 max-h-40 overflow-y-auto px-1">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => handleLocationSelect(loc)}
                  className={`px-2 py-1.5 rounded-md text-[11px] font-medium transition-all truncate ${
                    city === loc.name
                      ? "bg-gradient-to-br from-[#daa520] to-[#8b6914] text-white shadow-sm"
                      : "bg-white border border-[#c9a227]/40 text-neutral-700 hover:border-[#c9a227] hover:bg-[#c9a227]/5"
                  }`}
                  title={loc.name}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* جدول الأوقات */}
        {data && (
          <div className="grid grid-cols-6 gap-1.5">
            {(["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map((key) => {
              const isNext = nextPrayerName === prayerNames[key] && key !== "Sunrise";

              return (
                <div
                  key={key}
                  className={`rounded-lg py-2 px-1 text-center transition-all ${
                    isNext
                      ? "bg-gradient-to-br from-[#daa520] to-[#8b6914] text-white shadow-md"
                      : "bg-[#fdfcf7] border border-[#c9a227]/30 text-[#8b6914]"
                  }`}
                >
                  <p
                    className="text-[11px] font-bold mb-0.5"
                    style={{ fontFamily: "var(--font-amiri)" }}
                  >
                    {prayerNames[key]}
                  </p>
                  <p
                    className={`text-xs font-semibold ${
                      isNext ? "text-white" : "text-neutral-700"
                    }`}
                  >
                    {format12Hour(data.timings[key])}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* التاريخ الهجري */}
        {data && (
          <p className="text-center text-[10px] text-neutral-400 mt-2">
            {data.date.hijri.day} {data.date.hijri.month.ar} {data.date.hijri.year} هـ
          </p>
        )}
      </div>
    </div>
  );
}