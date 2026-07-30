// Fichier : src/app/layout.tsx

import type { Metadata, Viewport } from "next";
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
  title: "TEEZI Cam - Analyseur de Swing de Golf",
  description: "Filmez en permanence avec un délai, analysez et sauvegardez vos swings de golf instantanément.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TEEZI Cam",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'dark',
  viewportFit: "cover",
};

// Dans src/app/layout.tsx (à la racine)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      {/* On ajoute overflow-hidden, fixed et inset-0 pour tuer le scroll du navigateur */}
      <body className="fixed inset-0 w-screen h-[100dvh] overflow-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}