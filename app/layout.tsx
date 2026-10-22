import type { Metadata } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";
import { DemoBar } from "@/src/components/DemoBar";
import { Footer } from "@/src/components/Footer";
import { Header } from "@/src/components/Header";
import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import "./globals.css";

// Títulos con serif (seriedad, trayectoria) y texto sans muy legible (ADR 0008, docs/diseno.md).
const titulos = Source_Serif_4({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-titulos" });
const texto = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-texto" });

export const metadata: Metadata = {
  title: leerNombreDelProyecto(),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${titulos.variable} ${texto.variable}`}>
      <body className="flex min-h-screen flex-col">
        <DemoBar />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
