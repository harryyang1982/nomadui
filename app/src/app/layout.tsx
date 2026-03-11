import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KoNomad - 대한민국 디지털 노마드 도시 가이드",
  description:
    "디지털 노마드를 위한 한국 도시 가이드 & 리뷰 커뮤니티. 50개 이상 도시의 생활비, 인터넷 속도, 안전도를 비교하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased`}>{children}</body>
    </html>
  );
}
