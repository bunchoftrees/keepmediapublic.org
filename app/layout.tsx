import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import GlobalBanner from "./components/GlobalBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Keep Media Public - Support Your Local Public Media Stations",
  description: "Find and donate to your local PBS and NPR stations. Help public media survive the loss of federal funding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <GlobalBanner />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
