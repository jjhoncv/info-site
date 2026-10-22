import type { Metadata } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";
import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import "./globals.css";

// Títulos con serif (seriedad, trayectoria) y texto sans muy legible (ADR 0008, docs/diseno.md).
const titulos = Source_Serif_4({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-titulos" });
const texto = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-texto" });

export const metadata: Metadata = {
  title: leerNombreDelProyecto(),
};

// Solo fuentes y estilos: el encabezado y el pie son del sitio (app/(sitio)/layout.tsx); el admin tiene el suyo.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${titulos.variable} ${texto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
