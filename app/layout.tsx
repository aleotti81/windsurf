import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { site } from "@/data/site";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.url),
  title: site.seo.title,
  description: site.seo.description,
  openGraph: {
    type: "website",
    title: site.seo.title,
    description: site.seo.description,
    url: site.seo.url,
    siteName: site.brand,
    locale: site.seo.locale,
    images: [{ url: site.seo.ogImage, width: 1600, height: 900 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [site.seo.ogImage],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
