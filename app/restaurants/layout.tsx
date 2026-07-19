import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "新竹餐廳挑選｜週末風向",
  description: "依地區、料理類型、預算與時段，挑選新竹市區、竹北與竹東的餐廳。",
};

export default function RestaurantsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
