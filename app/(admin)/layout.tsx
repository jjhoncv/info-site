// El admin es otra «aplicación»: sin franja, encabezado ni pie del sitio (docs/diseno.md → Admin).
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen">{children}</div>;
}
