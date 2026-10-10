const BASE_URL = "https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/chapters";
const CACHE_PREFIX = "qs_";
const CACHE_VERSION = "v1";
const TOTAL_SURAHS = 114;

// ذاكرة مؤقتة في الجلسة (لمن localStorage يفشل)
const memoryCache = new Map<number, SurahData>();

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

export async function fetchSurah(surahNumber: number): Promise<SurahData> {
  const res = await fetch(`${BASE_URL}/${surahNumber}.json`);
  if (!res.ok) throw new Error("تعذر جلب السورة");
  const data = await res.json();
  return data;
}

export function cacheSurah(surah: SurahData): void {
  // نحفظ في الذاكرة دايماً
  memoryCache.set(surah.id, surah);

  // نحاول نحفظ في localStorage
  try {
    const key = `${CACHE_PREFIX}${CACHE_VERSION}_${surah.id}`;
    localStorage.setItem(key, JSON.stringify(surah));
  } catch (error) {
    console.warn("localStorage ممتلئ، نستخدم الذاكرة فقط");
  }
}

export function getCachedSurah(surahNumber: number): SurahData | null {
  // أول شي من الذاكرة
  if (memoryCache.has(surahNumber)) {
    return memoryCache.get(surahNumber)!;
  }

  // بعدها من localStorage
  try {
    const key = `${CACHE_PREFIX}${CACHE_VERSION}_${surahNumber}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached) as SurahData;
      memoryCache.set(surahNumber, parsed);
      return parsed;
    }
  } catch (error) {
    console.warn("فشل قراءة السورة");
  }
  return null;
}

export async function getSurah(surahNumber: number): Promise<SurahData> {
  const cached = getCachedSurah(surahNumber);
  if (cached) return cached;

  try {
    const surah = await fetchSurah(surahNumber);
    cacheSurah(surah);
    return surah;
  } catch (error) {
    throw new Error("تعذر جلب السورة — يرجى الاتصال بالإنترنت أول مرة");
  }
}

export function isSurahCached(surahNumber: number): boolean {
  if (memoryCache.has(surahNumber)) return true;
  try {
    const key = `${CACHE_PREFIX}${CACHE_VERSION}_${surahNumber}`;
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export function getCachedCount(): number {
  let count = 0;
  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    if (isSurahCached(i)) count++;
  }
  return count;
}

export async function downloadAllSurahs(
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const popular = [1, 18, 36, 55, 67, 56, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const remaining: number[] = [];
  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    if (!popular.includes(i)) remaining.push(i);
  }

  const allSurahs = [...popular, ...remaining];
  let downloaded = 0;

  for (const num of allSurahs) {
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
      await new Promise((r) => setTimeout(r, 200));
    } catch (error) {
      console.warn(`فشل تحميل سورة ${num}:`, error);
    }
  }
}