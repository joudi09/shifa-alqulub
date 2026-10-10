const BASE_URL = "https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/chapters";
const CACHE_PREFIX = "quran_surah_";
const CACHE_VERSION = "v1";
const TOTAL_SURAHS = 114;

export type Ayah = {
  id: number;
  text: string;
  transliteration: string;
};

export type SurahData = {
  id: number;
  name: string;
  transliteration: string;
  type: string;
  total_verses: number;
  verses: Ayah[];
};

// نجيب السورة من الرابط
export async function fetchSurah(surahNumber: number): Promise<SurahData> {
  const res = await fetch(`${BASE_URL}/${surahNumber}.json`);
  if (!res.ok) throw new Error("تعذر جلب السورة");
  const data = await res.json();
  return data;
}

// نحفظ السورة في localStorage
export function cacheSurah(surah: SurahData): void {
  try {
    const key = `${CACHE_PREFIX}${CACHE_VERSION}_${surah.id}`;
    localStorage.setItem(key, JSON.stringify(surah));
  } catch (error) {
    console.warn("فشل تخزين السورة:", error);
  }
}

// نجيب السورة من الذاكرة المحلية
export function getCachedSurah(surahNumber: number): SurahData | null {
  try {
    const key = `${CACHE_PREFIX}${CACHE_VERSION}_${surahNumber}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached) as SurahData;
    }
  } catch (error) {
    console.warn("فشل قراءة السورة من الذاكرة:", error);
  }
  return null;
}

// نجيب السورة: أول من الذاكرة، إذا مو موجودة نجيبها من النت
export async function getSurah(surahNumber: number): Promise<SurahData> {
  const cached = getCachedSurah(surahNumber);
  if (cached) {
    return cached;
  }

  try {
    const surah = await fetchSurah(surahNumber);
    cacheSurah(surah);
    return surah;
  } catch (error) {
    throw new Error("تعذر جلب السورة — يرجى الاتصال بالإنترنت أول مرة");
  }
}

// نتحقق إذا السورة محفوظة
export function isSurahCached(surahNumber: number): boolean {
  const key = `${CACHE_PREFIX}${CACHE_VERSION}_${surahNumber}`;
  return localStorage.getItem(key) !== null;
}

// عدد السور المحفوظة
export function getCachedCount(): number {
  let count = 0;
  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    if (isSurahCached(i)) count++;
  }
  return count;
}

// ⭐ تحميل كل السور تدريجياً في الخلفية
export async function downloadAllSurahs(
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  // نبدأ بالسور الشائعة أولاً
  const popular = [1, 18, 36, 55, 67, 56, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const remaining = [];
  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    if (!popular.includes(i)) remaining.push(i);
  }

  const allSurahs = [...popular, ...remaining];
  let downloaded = 0;

  for (const num of allSurahs) {
    // إذا محفوظة مسبقاً، نتجاوزها
    if (isSurahCached(num)) {
      downloaded++;
      if (onProgress) onProgress(downloaded, TOTAL_SURAHS);
      continue;
    }

    try {
      const surah = await fetchSurah(num);
      cacheSurah(surah);
      downloaded++;

      if (onProgress) onProgress(downloaded, TOTAL_SURAHS);

      // ننتظر 200 ملي ثانية بين كل سورة عشان ما نزحم النت
      await new Promise((r) => setTimeout(r, 200));
    } catch (error) {
      console.warn(`فشل تحميل سورة ${num}:`, error);
      // نستمر في تحميل الباقي حتى لو فشل واحد
    }
  }
}