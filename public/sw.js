// Service Worker - Ibn Jannatak
const CACHE_VERSION = "v12";
const CACHE_NAME = `ibn-jannatak-cache-${CACHE_VERSION}`;
const QURAN_CACHE = `ibn-jannatak-quran-${CACHE_VERSION}`;
const TOTAL_SURAHS = 114;

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

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME && name !== QURAN_CACHE) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
  
  // نبدأ تحميل السور تلقائياً
  downloadAllSurahs();
});

// ============ تحميل كل السور ============
async function downloadAllSurahs() {
  const cache = await caches.open(QURAN_CACHE);
  
  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    const url = `/quran-data/${i}.json`;
    
    try {
      const cached = await cache.match(url);
      if (cached) {
        sendProgress(i);
        continue;
      }

      // نحاول 3 مرات
      let success = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            success = true;
            break;
          }
        } catch (err) {
          console.warn(`سورة ${i} - محاولة ${attempt} فشلت`);
          // ننتظر قبل المحاولة الثانية
          await new Promise((r) => setTimeout(r, 500 * attempt));
        }
      }

      if (!success) {
        console.warn(`سورة ${i} - فشلت كل المحاولات`);
      }

      sendProgress(i);
    } catch (error) {
      console.warn(`فشل تحميل سورة ${i}:`, error);
    }
    
    // ننتظر 50ms (أسرع)
    await new Promise((r) => setTimeout(r, 50));
  }
  
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({ type: "QURAN_COMPLETE" });
  });
}

async function sendProgress(current) {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: "QURAN_PROGRESS",
      current,
      total: TOTAL_SURAHS,
    });
  });
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "DOWNLOAD_ALL_QURAN") {
    downloadAllSurahs();
  }
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (url.pathname.startsWith("/quran-data/")) {
    event.respondWith(
      caches.open(QURAN_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) return cached;
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

  if (url.origin !== self.location.origin) return;

  if (request.destination === "image") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
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

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
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

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});