import Link from "next/link";
import { ButtonLink } from "./Button";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="border-b border-linea bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" aria-label="Tu Empresa, inicio">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-6 text-sm font-semibold text-tinta">
          <Link href="/services" className="hover:text-marca-700">
            Servicios
          </Link>
          <Link href="#contacto" className="hidden hover:text-marca-700 sm:inline">
            Contacto
          </Link>
          <ButtonLink href="#contacto">Solicitar cotización</ButtonLink>
        </nav>
      </div>
    </header>
  );
}
