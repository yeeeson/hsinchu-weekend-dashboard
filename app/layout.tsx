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

const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://hsinchu-weekend-wind.q102111080.chatgpt.site";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = `${siteOrigin}${basePath}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "週末風向｜新竹去哪玩",
  description: "依預算、交通、天氣與時間，挑一條適合你的新竹週末路線。",
  openGraph: {
    title: "沿著風，選一條路。",
    description: "10 條新竹週末路線，含行程、交通與每人預算。",
    type: "website",
    locale: "zh_TW",
    url: siteUrl,
    images: [{ url: `${siteUrl}/og.png`, width: 1536, height: 1024, alt: "週末風向－新竹週末路線指南" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "週末風向｜新竹去哪玩",
    description: "依預算、交通與時間，挑一條新竹週末路線。",
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
