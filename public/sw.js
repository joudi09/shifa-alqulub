// Service Worker - Ibn Jannatak
const CACHE_VERSION = "v10";
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
});

// ============ تحميل كل السور ============
async function downloadAllSurahs() {
  const cache = await caches.open(QURAN_CACHE);
  
  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    const url = `/quran-data/${i}.json`;
    
    try {
      const cached = await cache.match(url);
      if (cached) {
        // نرسل تحديث
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: "QURAN_PROGRESS",
            current: i,
            total: TOTAL_SURAHS,
          });
        });
        continue;
      }

      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }

      // نرسل تحديث
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: "QURAN_PROGRESS",
          current: i,
          total: TOTAL_SURAHS,
        });
      });
    } catch (error) {
      console.warn(`فشل تحميل سورة ${i}:`, error);
    }
    
    // ننتظر 100ms
    await new Promise((r) => setTimeout(r, 100));
  }
  
  // نرسل إن التحميل اكتمل
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({ type: "QURAN_COMPLETE" });
  });
}

// ============ استقبال رسائل ============
self.addEventListener("message", (event) => {
  if (event.data?.type === "DOWNLOAD_ALL_QURAN") {
    downloadAllSurahs();
  }

  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ============ اعتراض الطلبات ============
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // 1. ملفات القرآن: Cache First
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

  // 2. طلبات خارجية: تجاهل
  if (url.origin !== self.location.origin) return;

  // 3. الصور
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

  // 4. الصفحات
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

  // 5. باقي الملفات
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