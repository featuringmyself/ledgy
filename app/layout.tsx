import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from "@/components/toast-provider";
import { FloatingActionButton } from "@/components/floating-action-button";
import { QuickActions } from "@/components/quick-actions";
import { CommandPalette } from "@/components/command-palette";
import { OfflineIndicator } from "@/components/offline-indicator";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accounting SaaS for Freelancers & Agencies | Easy Invoicing & Reports",
  description: "Manage invoices, track expenses, and simplify accounting with our SaaS built for freelancers and agencies. Get tax-ready reports, save time, and focus on growing your business.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ToastProvider>
            <KeyboardShortcuts />
            <CommandPalette />
            <OfflineIndicator />
            <div className="min-h-screen flex flex-col lg:flex-row">
              <Sidebar />
              <main className="flex-1 min-w-0 w-full">
                {children}
              </main>
              <FloatingActionButton />
              <QuickActions />
            </div>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
