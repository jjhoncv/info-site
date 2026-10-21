import { ButtonLink } from "@/src/components/Button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-5 px-4 py-24 sm:px-6">
      <p className="text-6xl font-bold text-marca-100" aria-hidden="true">
        404
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-marca-900">No encontramos esta página</h1>
      <p className="text-lg text-tinta-suave">Puede que el enlace esté mal escrito o que el servicio ya no exista.</p>
      <ButtonLink href="/services">Ver servicios</ButtonLink>
    </main>
  );
}
