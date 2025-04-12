import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const WHATSAPP_NUMBER = "6281399998092"; // Remove dashes and add country code without +
const DISPLAY_NUMBER = "+62 813-9999-8092"; // Formatted for display

// For WhatsApp links
const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}`;

export const metadata: Metadata = {
  title: "Kara Akademi",
  description: "Kara Akademi Indonesia provides world-class education in hospitality management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
