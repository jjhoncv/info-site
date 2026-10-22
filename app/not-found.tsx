import { ButtonLink } from "@/src/components/Button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-5 px-4 py-24 sm:px-6">
      <p className="font-titulo text-7xl font-bold text-marca-100" aria-hidden="true">
        404
      </p>
      <h1 className="text-4xl font-bold text-marca-900">No encontramos esta página</h1>
      <p className="text-lg text-tinta-suave">Puede que el enlace esté mal escrito o que la página ya no exista.</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/services">Ver servicios</ButtonLink>
        <ButtonLink href="/" variant="secundario">
          Ir al inicio
        </ButtonLink>
      </div>
    </main>
  );
}
