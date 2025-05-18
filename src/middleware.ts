// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      // Se esiste il token significa che l'utente è autenticato
      return !!token;
    },
  },
  pages: {
    signIn: "/login", // percorso custom della pagina di login
  },
});

// Configura quali route protegge il middleware
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
