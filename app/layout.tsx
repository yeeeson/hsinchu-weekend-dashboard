import type { Metadata } from "next";
import { headers } from "next/headers";
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

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "週末風向｜新竹去哪玩",
    description: "依預算、交通、天氣與時間，挑一條適合你的新竹週末路線。",
    openGraph: {
      title: "沿著風，選一條路。",
      description: "6 條新竹週末路線，含行程、交通與每人預算。",
      type: "website",
      locale: "zh_TW",
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "週末風向－新竹週末路線指南" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "週末風向｜新竹去哪玩",
      description: "依預算、交通與時間，挑一條新竹週末路線。",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
