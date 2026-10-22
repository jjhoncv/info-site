import Link from "next/link";
import { getServicios } from "@/src/module/services/services/demo";
import { EMPRESA } from "./empresa";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer id="contacto" className="bg-marca-900 text-marca-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo claro />
          <p className="max-w-sm text-sm leading-relaxed">{EMPRESA.lema}</p>
        </div>
        <nav aria-label="Pie">
          <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-white">Servicios</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {getServicios().map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-white">Contacto</h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li>{EMPRESA.telefono}</li>
            <li>{EMPRESA.correo}</li>
            <li>{EMPRESA.direccion}</li>
            <li>{EMPRESA.horario}</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-5 text-center text-xs">
        © {EMPRESA.nombre} · Sitio de demostración de Info Site con datos de ejemplo
      </p>
    </footer>
  );
}
