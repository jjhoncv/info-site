import { notFound } from "next/navigation";

// Cualquier ruta de /admin que no existe: así el 404 sale con el marco del admin y no con el del sitio.
export default function AdminCatchAll() {
  notFound();
}
