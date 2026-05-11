import type { Metadata } from "next";
import { JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "700"],
  variable: "--font-jetbrains",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "RAG системи — Курсова работа",
  description:
    "Как езиковите модели използват външни източници на знания. Retrieval-Augmented Generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className={`${jetbrains.variable} ${plex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
