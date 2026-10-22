import type { Metadata } from "next";
import { LogoMark } from "@/src/components/Logo";
import { EMPRESA } from "@/src/components/empresa";
import { LoginForm } from "@/src/module/auth/components/LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión", robots: { index: false } };

// Pantalla dividida (docs/maquetas/admin.html, vista #login): panel de marca a la izquierda, formulario a la derecha.
// En celular el panel queda arriba y más bajo.
export default function LoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="flex flex-col justify-between gap-6 bg-marca-900 px-5 py-7 text-marca-100 md:p-12">
        <div className="flex items-center gap-3">
          <LogoMark claro />
          <div className="flex flex-col leading-tight">
            <b className="font-titulo text-lg text-white">{EMPRESA.nombre}</b>
            <small className="text-xs">Panel de administración</small>
          </div>
        </div>
        <h2 className="max-w-[14ch] text-2xl font-bold text-white md:text-4xl">
          Actualiza tu sitio en minutos, sin depender de nadie.
        </h2>
        <p className="text-sm">Cambia textos, fotos y precios. Lo ves publicado al instante.</p>
      </section>
      <section className="grid place-items-center px-4 py-8">
        <div className="flex w-full max-w-sm flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-marca-900">Iniciar sesión</h1>
            <p className="text-tinta-suave">Usa el usuario de demostración que te dimos.</p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
