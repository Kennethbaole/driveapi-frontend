import type { Metadata } from "next";
import QueryProvider from '@/providers/query-provider'
import Navbar from '@/components/navbar'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DriveAPI — Premium Car Rentals",
  description: "Browse premium vehicles, book instantly, and hit the road.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <Navbar />
          <main className="pt-28 pb-16 relative z-10">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}