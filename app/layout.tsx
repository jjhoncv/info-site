import type { Metadata } from "next";
import { Footer } from "@/src/components/Footer";
import { Header } from "@/src/components/Header";
import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import "./globals.css";

export const metadata: Metadata = {
  title: leerNombreDelProyecto(),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
