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

// نجيب السورة من الملفات المحلية (public/quran-data/)
export async function getSurah(surahNumber: number): Promise<SurahData> {
  try {
    const res = await fetch(`/quran-data/${surahNumber}.json`);
    if (!res.ok) {
      throw new Error("السورة غير متوفرة");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error("تعذر جلب السورة");
  }
}

export function isSurahCached(_surahNumber: number): boolean {
  // كل السور محلية الآن
  return true;
}

export function getCachedCount(): number {
  return TOTAL_SURAHS;
}