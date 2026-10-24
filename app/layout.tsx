import type { Metadata } from "next";
import localFont from "next/font/local";
import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import "./globals.css";

// Títulos con serif (seriedad, trayectoria) y texto sans muy legible (ADR 0008, docs/diseno.md).
// Las fuentes viven en el repo (variables, subconjunto latin, licencia OFL; ADR 0013): el build no las baja de
// Google, así no falla si Google no responde y Claude en la nube puede correr el build y el E2E.
const titulos = localFont({ src: "./fonts/source-serif-4-latin.woff2", weight: "600 700", variable: "--font-titulos" });
const texto = localFont({ src: "./fonts/public-sans-latin.woff2", weight: "400 700", variable: "--font-texto" });

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
