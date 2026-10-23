"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/src/components/Logo";
import { EMPRESA } from "@/src/components/empresa";
import { logout } from "@/src/module/auth/core/logout.action";

type Enlace = { href: string; texto: string };

// Menú de la maqueta (docs/maquetas/admin.html). Las secciones que aún no existen caen en el 404 del admin.
const GRUPOS: { titulo?: string; enlaces: Enlace[] }[] = [
  { enlaces: [{ href: "/admin", texto: "Resumen" }] },
  {
    titulo: "Contenido",
    enlaces: [
      { href: "/admin/banners", texto: "Banners de portada" },
      { href: "/admin/services", texto: "Servicios" },
      { href: "/admin/projects", texto: "Proyectos" },
    ],
  },
  {
    titulo: "Configuración",
    enlaces: [
      { href: "/admin/company", texto: "Datos de la empresa" },
      { href: "/admin/profile", texto: "Mi perfil" },
    ],
  },
];

const ENLACE = "flex items-center rounded-tarjeta px-2.5 py-2.5 font-medium text-marca-100 hover:bg-white/10 hover:text-white";

// Resumen es /admin exacto; el resto, su ruta y lo que cuelga de ella.
const esActual = (ruta: string, href: string) => (href === "/admin" ? ruta === href : ruta.startsWith(href));

export function AdminSidebar() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-2 lg:hidden">
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls="menu-admin"
          onClick={() => setAbierto(!abierto)}
          className="rounded-tarjeta bg-marca-50 px-4 py-2 font-semibold text-marca-900 hover:bg-marca-100"
        >
          Menú
        </button>
        <span className="font-titulo font-bold text-marca-900">{EMPRESA.nombre}</span>
      </div>
      <aside
        id="menu-admin"
        className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col gap-5 overflow-y-auto bg-marca-900 px-3.5 py-5 transition-transform motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          abierto ? "shadow-[0_0_0_100vmax_rgb(14_42_71/0.4)]" : "max-lg:invisible max-lg:-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-1">
          <LogoMark claro />
          <div className="flex flex-col leading-tight">
            <b className="font-titulo text-lg text-white">{EMPRESA.nombre}</b>
            <small className="text-xs text-marca-100">Administración</small>
          </div>
        </div>
        <nav aria-label="Secciones" className="flex flex-col gap-0.5">
          {GRUPOS.map((grupo) => (
            <div key={grupo.titulo ?? "inicio"} className="flex flex-col gap-0.5">
              {grupo.titulo && (
                <span className="px-2.5 pt-3 pb-1.5 text-[0.7rem] font-semibold uppercase tracking-widest text-marca-100">
                  {grupo.titulo}
                </span>
              )}
              {grupo.enlaces.map((e) => (
                <Link
                  key={e.href}
                  href={e.href}
                  onClick={() => setAbierto(false)}
                  aria-current={esActual(ruta, e.href) ? "page" : undefined}
                  className={`${ENLACE} aria-[current=page]:bg-white/10 aria-[current=page]:text-white aria-[current=page]:shadow-[inset_3px_0_0_var(--color-acento-600)]`}
                >
                  {e.texto}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-3.5 text-sm">
          <Link href="/" className={ENLACE}>
            Ver el sitio
          </Link>
          <form action={logout}>
            <button type="submit" className={`${ENLACE} w-full text-left`}>
              Salir
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
