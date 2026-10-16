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

export async function getSurah(surahNumber: number): Promise<SurahData> {
  const res = await fetch(`/quran-data/${surahNumber}.json`);
  if (!res.ok) {
    throw new Error("السورة غير متوفرة");
  }
  return res.json();
}

export function isSurahCached(_surahNumber: number): boolean {
  return true;
}

export function getCachedCount(): number {
  return TOTAL_SURAHS;
}