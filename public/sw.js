// Service Worker per mantenere la sessione attiva

self.addEventListener("install", () => {
  console.log("Service Worker installing");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating");
  event.waitUntil(self.clients.claim());
});

// Intercetta le richieste per mantenere la sessione
self.addEventListener("fetch", (event) => {
  // Solo per le richieste di sessione
  if (event.request.url.includes("/api/auth/session")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clona la risposta per evitare problemi di stream
          return response.clone();
        })
        .catch(() => {
          // Se la richiesta fallisce, restituisci una risposta vuota
          return new Response(JSON.stringify({ user: null }), {
            headers: { "Content-Type": "application/json" },
          });
        })
    );
  }
});

// Gestisci i messaggi dal client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "KEEP_SESSION_ALIVE") {
    // Mantieni la sessione attiva
    fetch("/api/auth/session", {
      credentials: "include",
    }).catch(() => {
      // Ignora errori
    });
  }
});
