import type { Metadata, Viewport } from "next";
import { Vazirmatn, Baloo_2 } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ماجراجویی الفبا | بازی شاد ساره",
  description:
    "بازی آموزشی الفبای انگلیسی برای ساره — یاد بگیر، بنویس و حدس بزن!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#e6e0f8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-fa">{children}</body>
    </html>
  );
}
