import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import DarkModeScript from "@/components/DarkModeScript";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arsorandi — Corso di preghiera",
  description: "Un corso digitale di preghiera cristiana secondo il metodo di Pietro d'Alcantara e la Lectio Divina.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head />
      <body className={`${lora.variable} ${inter.variable}`}>
        <DarkModeScript />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 px-4 py-8 sm:py-12">
            <div className="max-w-prose mx-auto w-full">
              {children}
            </div>
          </main>
          <footer className="py-8 text-center font-sans text-xs" style={{ color: "var(--text-muted)" }}>
            Arsorandi · corso di preghiera
          </footer>
        </div>
      </body>
    </html>
  );
}
