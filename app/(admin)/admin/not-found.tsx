import { ButtonLink } from "@/src/components/Button";
import { PageUI } from "@/src/module/shared/components/PageUI";

// 404 del admin, dentro del marco del admin (el del sitio no aplica aquí).
export default function AdminNotFound() {
  return (
    <PageUI title="No encontramos esta página" subtitle="Puede que el enlace esté mal escrito o que la sección aún no exista.">
      <div>
        <ButtonLink href="/admin">Ir al resumen</ButtonLink>
      </div>
    </PageUI>
  );
}
