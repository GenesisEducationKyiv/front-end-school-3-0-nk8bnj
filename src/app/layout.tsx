import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { DynamicHeader } from "@/components/ClientComponents";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Track Manager",
  description: "Test task for Genesis Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <div className="max-w-7xl mx-auto py-8 px-4">
            <Suspense fallback={<div>Loading...</div>}>
              <DynamicHeader />
            </Suspense>
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
