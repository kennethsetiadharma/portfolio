import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Nav } from "@/components/Nav";
import { site } from "@/content/site";
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

// Absolute base URL for the share image. On Vercel this is the production domain, so it
// follows you automatically when you add a custom domain. Set NEXT_PUBLIC_SITE_URL to override.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description = `${site.intro} ${site.location}.`;

// The favicon, app icon and link-preview images are the files in this folder
// (favicon.ico, icon.png, apple-icon.png, opengraph-image.png, twitter-image.png).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.name,
  description,
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
      </body>
    </html>
  );
}
