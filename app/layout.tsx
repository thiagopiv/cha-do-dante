import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Chá do Dante 🧸",
  description: "Você é nosso convidado especial para o Chá de Bebê do Dante!",
  icons: {
    icon: "https://cha-do-dante.vercel.app/capa-cha.jpg",
    apple: "https://cha-do-dante.vercel.app/capa-cha.jpg",
  },
  openGraph: {
    title: "Chá do Dante 🧸",
    description: "Você é nosso convidado especial para o Chá de Bebê do Dante!",
    url: "https://cha-do-dante.vercel.app",
    siteName: "Chá do Dante",
    images: [
      {
        url: "https://cha-do-dante.vercel.app/capa-cha.jpg",
        width: 1200,
        height: 630,
        alt: "Chá de Bebê do Dante",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chá do Dante 🧸",
    description: "Você é nosso convidado especial para o Chá de Bebê do Dante!",
    images: ["https://cha-do-dante.vercel.app/capa-cha.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}