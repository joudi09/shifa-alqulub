import { Suspense } from "react";
import SurahContent from "./SurahContent";

export default function SurahPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">
          <p className="text-[#8b6914]">جاري تحميل السورة...</p>
        </div>
      }
    >
      <SurahContent />
    </Suspense>
  );
}