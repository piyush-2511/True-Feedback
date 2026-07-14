import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";

import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"

import './globals.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "TrueFeedback — Anonymous feedback, no names attached",
  description: "Share your link. Get honest, unfiltered feedback with zero traceback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <AuthProvider>
        <body className="min-h-full flex flex-col bg-[#0D0E13] text-[#F5EFE6]">
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}