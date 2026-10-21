import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-marca-50 text-tinta-suave">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <div className="text-marca-900">
            <Logo />
          </div>
          <p className="max-w-xs text-sm">Servicios profesionales para empresas que quieren crecer con orden.</p>
        </div>
        <nav aria-label="Pie" className="flex gap-6 text-sm font-medium">
          <Link href="/services" className="hover:text-marca-700">
            Servicios
          </Link>
        </nav>
      </div>
      <p className="border-t border-linea px-4 py-4 text-center text-xs">
        © Info Site · Sitio de demostración con datos inventados
      </p>
    </footer>
  );
}
