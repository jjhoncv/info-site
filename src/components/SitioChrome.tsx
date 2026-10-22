import { DemoBar } from "./DemoBar";
import { Footer } from "./Footer";
import { Header } from "./Header";

// Franja, encabezado y pie del sitio público. Lo usan el layout de (sitio) y el 404.
export function SitioChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <DemoBar />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
