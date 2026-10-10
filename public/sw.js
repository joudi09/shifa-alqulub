// Service Worker - شفاء القلوب
const CACHE_NAME = "shifa-alqulub-v3";
const RUNTIME_CACHE = "shifa-runtime-v3";
const QURAN_CACHE = "shifa-quran-v1";
const IMAGES_CACHE = "shifa-images-v3";

const TOTAL_SURAHS = 114;
const QURAN_BASE = "https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/chapters";

const PRECACHE_URLS = [
  "/",
  "/quran",
  "/adhkar/morning",
  "/adhkar/evening",
  "/duas",
  "/tasbih",
  "/about",
  "/manifest.json",
  "/icon.svg",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

// ============ تثبيت ============
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => console.warn("فشل:", url))
        )
      );
    })
  );
  self.skipWaiting();
});

// ============ تفعيل ============
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![CACHE_NAME, RUNTIME_CACHE, QURAN_CACHE, IMAGES_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ============ تحميل كل السور في الخلفية ============
async function downloadAllSurahs() {
  const cache = await caches.open(QURAN_CACHE);
  
  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    const url = `${QURAN_BASE}/${i}.json`;
    
    // نتحقق إذا محفوظة مسبقاً
    const cached = await cache.match(url);
    if (cached) {
      // نرسل تحديث للصفحة
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "QURAN_PROGRESS", current: i, total: TOTAL_SURAHS });
        });
      });
      continue;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
        
        // نرسل تحديث للصفحة
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "QURAN_PROGRESS", current: i, total: TOTAL_SURAHS });
          });
        });
      }
    } catch (error) {
      console.warn(`فشل تحميل سورة ${i}:`, error);
    }
    
    // ننتظر 150ms بين كل سورة
    await new Promise((r) => setTimeout(r, 150));
  }
  
  // نرسل إن التحميل اكتمل
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "QURAN_COMPLETE" });
    });
  });
}

// ============ استقبال رسائل من الصفحة ============
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "DOWNLOAD_ALL_QURAN") {
    downloadAllSurahs();
  }
  
  if (event.data && event.data.type === "CHECK_QURAN_STATUS") {
    checkQuranStatus();
  }
});

async function checkQuranStatus() {
  const cache = await caches.open(QURAN_CACHE);
  let count = 0;
  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    const cached = await cache.match(`${QURAN_BASE}/${i}.json`);
    if (cached) count++;
  }
  
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "QURAN_STATUS", count, total: TOTAL_SURAHS });
    });
  });
}

// ============ اعتراض الطلبات ============
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // 1. طلبات القرآن: من Cache أولاً
  if (url.hostname === "cdn.jsdelivr.net" && url.pathname.includes("/chapters/")) {
    event.respondWith(
      caches.open(QURAN_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) return cached;
          
          // إذا ما موجودة، نجيبها ونحفظها
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              return new Response(
                JSON.stringify({ error: "غير متاح بدون إنترنت" }),
                { status: 503, headers: { "Content-Type": "application/json" } }
              );
            });
        });
      })
    );
    return;
  }

  // 2. الطلبات الخارجية: نتجاهلها
  if (url.origin !== self.location.origin) return;

  // 3. الصور
  if (request.destination === "image") {
    event.respondWith(
      caches.open(IMAGES_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          return (
            cached ||
            fetch(request).then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            })
          );
        });
      })
    );
    return;
  }

  // 4. الصفحات (Navigation)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return caches.match("/");
          });
        })
    );
    return;
  }

  // 5. باقي الملفات
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") {
          return response;
        }
        const responseClone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    })
  );
});