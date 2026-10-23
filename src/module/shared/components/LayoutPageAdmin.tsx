import { AdminSidebar } from "./AdminSidebar";

// Marco del admin: barra lateral + contenido. No usa el encabezado ni el pie del sitio (docs/diseno.md → Admin).
export function LayoutPageAdmin({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f4f6f9] lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <AdminSidebar />
      <main className="min-w-0 px-4 py-6 sm:px-8 sm:pb-12">{children}</main>
    </div>
  );
}
