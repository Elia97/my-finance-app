"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Ricontrolla la sessione ogni 5 minuti
      refetchOnWindowFocus={true} // Ricontrolla quando la finestra torna in focus
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
