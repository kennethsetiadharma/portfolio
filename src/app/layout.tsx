import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackToTop } from "@/components/BackToTop";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Nav } from "@/components/Nav";
import { site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.name,
  description: site.intro,
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
          <BackToTop />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
