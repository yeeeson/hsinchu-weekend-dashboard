import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "新竹餐廳挑選｜週末風向",
  description: "依地區、料理類型、價位與時段，挑選新竹市區、竹北、竹東、關埔與科學園區周邊餐廳。",
};

export default function RestaurantsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
