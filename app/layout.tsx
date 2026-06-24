import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "林强伟｜AI 产品经理",
  description: "林强伟的 AI 产品经理在线作品集、项目经历与 AI 数字分身",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
