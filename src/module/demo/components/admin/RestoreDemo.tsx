"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/src/components/Button";
import { restoreDemoAction } from "../../core/restore.action";

type Estado = { fase: "cerrado" | "confirmando" | "restaurando" } | { fase: "listo" } | { fase: "error"; mensaje: string };

// Tarjeta «Restaurar la demo» del resumen y su confirmación (docs/maquetas/admin.html → #resumen).
export function RestoreDemo() {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>({ fase: "cerrado" });

  const restaurar = async () => {
    setEstado({ fase: "restaurando" });
    const r = await restoreDemoAction();
    if (!r.ok) return setEstado({ fase: "error", mensaje: r.error });
    setEstado({ fase: "listo" });
    router.refresh();
  };

  const abierto = estado.fase === "confirmando" || estado.fase === "restaurando";
  return (
    <>
      <Button variant="secundario" onClick={() => setEstado({ fase: "confirmando" })}>
        Restaurar demo
      </Button>
      {estado.fase === "listo" && <p role="status" className="font-semibold text-marca-900">La demo volvió a su contenido original</p>}
      {estado.fase === "error" && (
        <p role="alert" className="font-semibold text-error">
          {estado.mensaje}
        </p>
      )}
      {abierto && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="restaurar-titulo" className="flex max-w-md flex-col gap-3 rounded-tarjeta bg-white p-6">
            <h2 id="restaurar-titulo" className="text-xl font-bold text-marca-900">
              ¿Restaurar la demo?
            </h2>
            <p className="text-tinta-suave">
              Todo el contenido vuelve a como estaba al inicio y se borran las imágenes subidas. No se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secundario" autoFocus disabled={estado.fase === "restaurando"} onClick={() => setEstado({ fase: "cerrado" })}>
                Cancelar
              </Button>
              <Button disabled={estado.fase === "restaurando"} onClick={restaurar}>
                {estado.fase === "restaurando" ? "Restaurando…" : "Sí, restaurar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
