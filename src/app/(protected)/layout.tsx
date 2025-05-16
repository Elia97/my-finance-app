import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // Se non autenticato, vai al login
  }
  return (
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
            <div className="w-full px-4 py-8 md:px-8 md:py-12">{children}</div>
            <div className="absolute top-2 right-2">
              <ThemeToggle />
            </div>
          </SidebarInset>
        </div>
        <Toaster position="bottom-right" />
      </SidebarProvider>
    </ThemeProvider>
  );
}
