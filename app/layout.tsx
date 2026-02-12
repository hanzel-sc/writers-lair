import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Writer's Lair — Capture Ideas Before They Fade",
  description:
    "A creative workspace for songwriters. Organize lyrics, voice memos, and audio files — all in one place. Your songwriting companion, anywhere, anytime.",
  keywords: [
    "songwriting",
    "lyrics",
    "voice memos",
    "music",
    "creative workspace",
    "songwriter",
    "writer's lair",
  ],
  icons: {
    icon: "/media/swj-logo.png",
    apple: "/media/swj-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
