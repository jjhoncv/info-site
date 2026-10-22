import { SitioChrome } from "@/src/components/SitioChrome";

// El pie lista los servicios de la base: las páginas del sitio no se congelan en el build.
export const dynamic = "force-dynamic";

export default function SitioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SitioChrome>{children}</SitioChrome>;
}
