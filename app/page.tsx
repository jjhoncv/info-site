import { ButtonLink } from "@/src/components/Button";
import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-marca-900 sm:text-5xl">{leerNombreDelProyecto()}</h1>
      <p className="mt-4 max-w-xl text-lg text-tinta-suave">Servicios profesionales para empresas que quieren crecer con orden.</p>
      <div className="mt-8">
        <ButtonLink href="/services">Ver servicios</ButtonLink>
      </div>
    </main>
  );
}
