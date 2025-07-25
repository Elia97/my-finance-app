import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SessionKeepAlive } from "@/components/session-keep-alive";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestione Finanziaria Personale",
  description: "Applicazione per la gestione delle finanze personali",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "My Finance App",
    title: "Gestione Finanziaria Personale",
    description: "Applicazione per la gestione delle finanze personali",
  },
  icons: {
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <SessionKeepAlive />
          {children}
        </Providers>
      </body>
    </html>
  );
}
