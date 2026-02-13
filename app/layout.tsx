import type { Metadata } from "next";
//import { Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Hahmlet } from "next/font/google";

const hahmlet = Hahmlet({
  variable: "--font-hahmlet",
  subsets: ["latin"],
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
    icon: "/media/swj-logo-2.png",
    apple: "/media/swj-logo-2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${hahmlet.variable} antialiased`}>{children}</body>
    </html>
  );
}
