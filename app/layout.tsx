import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FormGuardProvider } from "@/components/shared/form-guard";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Project Sticky Notes",
    template: "%s | Project Sticky Notes",
  },
  description:
    "A lightweight thought-capture system for developers.",
  applicationName: "Project Sticky Notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        geist.variable,
        geistMono.variable,
        "font-sans",
      )}
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col overflow-hidden">
        <FormGuardProvider>{children}</FormGuardProvider>
        <Toaster />
      </body>
    </html>
  );
}
