"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function SessionKeepAlive() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Mantieni la sessione attiva ogni 10 minuti
    const interval = setInterval(() => {
      fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      }).catch(() => {
        // Ignora errori, NextAuth gestirà la sessione
      });
    }, 10 * 60 * 1000); // 10 minuti

    // Service Worker per gestire la sessione anche quando l'app è in background
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Service worker registration failed, but continue anyway
      });
    }

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return null;
}
