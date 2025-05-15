import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinTrack - Gestione Finanziaria Personale",
  description: "Applicazione per la gestione delle finanze personali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <Sidebar />
              <SidebarInset className="flex-1 w-full relative">
                <div className="absolute top-2 left-2 z-10">
                  <SidebarTrigger />
                </div>
                <div className="w-full px-4 py-8 md:px-8 md:py-12">
                  {children}
                </div>
                <div className="absolute top-2 right-2">
                  <ThemeToggle />
                </div>
              </SidebarInset>
            </div>
            <Toaster position="bottom-right" />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
