import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Nav } from "@/components/Nav";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Not used on the page yet, so don't preload it (it would compete with Geist
// Sans for bandwidth). It still loads on demand if something uses `font-mono`.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const description = `${site.intro} ${site.location}.`;

// The favicon, app icon and link-preview images are the files in this folder
// (favicon.ico, icon.png, apple-icon.png, opengraph-image.png, twitter-image.png).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.name,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <Nav />
          {children}
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
