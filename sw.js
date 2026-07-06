/* ============================================================
   Aprueba RD — Service Worker
   Cachea el "app shell" para que la app funcione OFFLINE.
   Estrategia: cache-first para los estáticos de la app.
   Al cambiar archivos, sube el número de versión del cache
   (CACHE) para forzar la actualización.
   ============================================================ */

const CACHE = "apruebard-v1";

/* Recursos mínimos para que la app arranque sin conexión. */
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icon.svg"
];

/* Instalación: precachea el app shell. */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

/* Activación: elimina versiones viejas del cache. */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c)))
    ).then(() => self.clients.claim())
  );
});

/* Fetch: cache-first. Solo peticiones GET del mismo origen.
   Las fuentes de Google (otro origen) pasan directo a la red. */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // deja pasar Google Fonts, etc.

  event.respondWith(
    caches.match(req).then((cacheada) => {
      if (cacheada) return cacheada;
      return fetch(req)
        .then((resp) => {
          // Guarda una copia de las respuestas válidas para la próxima vez.
          if (resp && resp.status === 200 && resp.type === "basic") {
            const copia = resp.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copia));
          }
          return resp;
        })
        .catch(() => {
          // Sin red y sin cache: si es una navegación, devuelve el index.
          if (req.mode === "navigate") return caches.match("./index.html");
          return new Response("", { status: 504, statusText: "Sin conexión" });
        });
    })
  );
});
