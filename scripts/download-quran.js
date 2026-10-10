const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE_URL = "https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/chapters";
const OUTPUT_DIR = path.join(__dirname, "..", "public", "quran-data");

// ننشئ المجلد
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function downloadSurah(num) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/${num}.json`;
    const filePath = path.join(OUTPUT_DIR, `${num}.json`);

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download surah ${num}: ${res.statusCode}`));
          return;
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          fs.writeFileSync(filePath, data);
          console.log(`✅ سورة ${num} - تم التحميل`);
          resolve();
        });
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("📥 بدء تحميل السور...\n");
  
  for (let i = 1; i <= 114; i++) {
    try {
      await downloadSurah(i);
      // ننتظر شوي
      await new Promise((r) => setTimeout(r, 100));
    } catch (error) {
      console.error(`❌ فشل تحميل سورة ${i}:`, error.message);
    }
  }
  
  console.log("\n✅ تم تحميل كل السور!");
}

main();