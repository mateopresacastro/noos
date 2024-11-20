import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Player from "@/components/player/player";
import Providers from "@/app/providers";
import { AxiomWebVitals } from "next-axiom";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config";

export const tailwind = resolveConfig(tailwindConfig);

export const metadata: Metadata = {
  title: "noos",
  description: "The marketplace for samplemakers",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AxiomWebVitals />
      <Providers>
        <body className="bg-neutral-950 text-neutral-50 dark">
          <div
            className={`${inter.className} antialiased max-w-7xl px-6 mx-auto`}
          >
            <Header />
            {children}
          </div>
          <Player />
        </body>
      </Providers>
    </html>
  );
}
