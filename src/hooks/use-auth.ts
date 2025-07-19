import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { User } from "@/types/types";

export function useAuth() {
  const { data: session, status } = useSession();

  // Mantieni la sessione attiva quando l'app torna in foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && status === "authenticated") {
        // Forza un refresh della sessione quando l'app torna attiva
        window.dispatchEvent(new Event("focus"));
      }
    };

    const handleFocus = () => {
      if (status === "authenticated") {
        // Mantieni la sessione attiva
        fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        }).catch(() => {
          // Ignore errors, NextAuth gestirà la sessione
        });
      }
    };

    // Ascolta i cambiamenti di visibilità (importante per mobile)
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [status]);

  return {
    user: session?.user as User | undefined,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    session,
  };
}
