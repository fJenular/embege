import type { Metadata } from "next";
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
  title: "EMBEGE - Eat More. Be Good Everyday",
  description: "Platform pemesanan katering - Good food. Good mood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <body className="min-h-screen flex bg-[#f4f8fc] text-slate-900 font-sans">
        <main className="flex-1 flex flex-col overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
