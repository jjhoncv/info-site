import Link from "next/link";
import { ButtonLink } from "@/src/components/Button";
import { RestoreDemo } from "@/src/module/demo/components/admin/RestoreDemo";
import { PageUI } from "./PageUI";

const ACCESOS = [
  { href: "/admin/services/new", texto: "Agregar un servicio" },
  { href: "/admin/banners", texto: "Cambiar el banner de portada" },
  { href: "/admin/company", texto: "Actualizar logo y contacto" },
];

// Resumen del admin (docs/maquetas/admin.html, vista #resumen). Hoy cuenta servicios: las demás cifras
// llegan con sus secciones.
export function SummaryView({
  servicesCount,
  uploadsCount,
  uploadsLimit,
}: Readonly<{ servicesCount: number; uploadsCount: number; uploadsLimit: number }>) {
  return (
    <PageUI
      title="Hola, bienvenido"
      subtitle="Así está tu sitio hoy."
      action={<ButtonLink href="/admin/services/new">Nuevo servicio</ButtonLink>}
    >
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-tarjeta bg-white p-5">
          <dt className="order-1 text-sm text-tinta-suave">Servicios publicados</dt>
          <dd className="order-2 font-titulo text-3xl font-bold text-marca-900">{servicesCount}</dd>
        </div>
        <div className="flex flex-col gap-1 rounded-tarjeta bg-white p-5">
          <dt className="order-1 text-sm text-tinta-suave">Imágenes subidas</dt>
          <dd className="order-2 font-titulo text-3xl font-bold text-marca-900">
            {uploadsCount} / {uploadsLimit}
          </dd>
          <dd className="order-3 text-sm text-tinta-suave">Tope de la demo</dd>
        </div>
      </dl>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-tarjeta bg-white p-5">
          <h2 className="text-xl font-bold text-marca-900">Accesos rápidos</h2>
          <ul className="flex flex-col gap-2">
            {ACCESOS.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="block rounded-tarjeta bg-marca-50 px-4 py-3 font-semibold text-marca-900 hover:bg-marca-100">
                  {a.texto}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col items-start gap-3 rounded-tarjeta bg-white p-5">
          <h2 className="text-xl font-bold text-marca-900">Restaurar la demo</h2>
          <p className="text-tinta-suave">
            Vuelve todo el contenido a como estaba al inicio y borra las imágenes subidas. Útil antes de mostrarla a otro
            cliente.
          </p>
          <RestoreDemo />
        </section>
      </div>
    </PageUI>
  );
}
