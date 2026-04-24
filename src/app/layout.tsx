import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pipeline-dashboard.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pipeline Dashboard - The Portfolio IS the Product",
  description: "Live readout of the autonomous overnight build pipeline. GitHub commits, Vercel deploys, ship rate, and the receipts behind the AI architect narrative.",
  openGraph: {
    title: "Pipeline Dashboard - The Portfolio IS the Product",
    description: "Live readout of the autonomous overnight build pipeline. Real apps, real commits, real receipts.",
    type: "website",
    images: ["/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pipeline Dashboard - The Portfolio IS the Product",
    description: "Live readout of the autonomous overnight build pipeline. Real apps, real commits, real receipts.",
    images: ["/og"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030712",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
