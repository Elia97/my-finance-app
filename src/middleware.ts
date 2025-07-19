// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      // Se esiste il token significa che l'utente è autenticato
      if (token) return true;

      // Permetti l'accesso alle API di auth anche senza token
      if (req.nextUrl.pathname.startsWith("/api/auth")) return true;

      return false;
    },
  },
  pages: {
    signIn: "/login", // percorso custom della pagina di login
  },
});

// Configura quali route protegge il middleware
export const config = {
  matcher: [
    /*
     * Proteggi tutte le rotte eccetto:
     * - api/auth (NextAuth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login page
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
