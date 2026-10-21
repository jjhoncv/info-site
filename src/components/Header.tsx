import Link from "next/link";
import { ButtonLink } from "./Button";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="border-b border-linea bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" aria-label="Info Site, inicio" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-6 text-sm font-medium text-tinta-suave">
          <Link href="/services" className="hover:text-marca-700">
            Servicios
          </Link>
          <ButtonLink href="/services">Cotizar</ButtonLink>
        </nav>
      </div>
    </header>
  );
}
