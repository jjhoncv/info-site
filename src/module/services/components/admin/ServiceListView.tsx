"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DynamicTable, type Column } from "@/src/module/shared/components/DynamicTable";
import type { Service } from "@/src/types/domain";

// «Hoy» y las fechas, en la zona del dueño y no en UTC (docs/lecciones.md).
const formatoFecha = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeZone: "America/Lima" });

const ACCION = "rounded-tarjeta px-2.5 py-1.5 text-sm font-semibold text-marca-700 hover:bg-marca-50";

export function ServiceListView({ services }: Readonly<{ services: Service[] }>) {
  const router = useRouter();
  const [error, setError] = useState<string>();

  const eliminar = async (servicio: Service) => {
    if (!window.confirm(`¿Eliminar «${servicio.title}»? Dejará de verse en el sitio.`)) return;
    setError(undefined);
    const res = await fetch(`/api/admin/services/${servicio.id}`, { method: "DELETE" });
    if (!res.ok) return setError(`No se pudo eliminar «${servicio.title}». Intenta de nuevo.`);
    router.refresh();
  };

  const columnas: Column<Service>[] = [
    {
      key: "imagen",
      header: "Imagen",
      render: (s) =>
        s.imageUrl ? (
          <Image src={s.imageUrl} alt={s.imageAlt ?? s.title} width={64} height={44} className="h-11 w-16 rounded-tarjeta object-cover" />
        ) : (
          <span className="text-tinta-suave">Sin imagen</span>
        ),
    },
    {
      key: "titulo",
      header: "Título",
      render: (s) => (
        <div className="flex flex-col">
          <span className="font-semibold text-marca-900">{s.title}</span>
          <span className="text-sm text-tinta-suave">/services/{s.slug}</span>
        </div>
      ),
    },
    { key: "actualizado", header: "Actualizado", render: (s) => formatoFecha.format(s.updatedAt) },
    {
      key: "acciones",
      header: "Acciones",
      className: "text-right",
      render: (s) => (
        <div className="flex justify-end gap-1">
          <Link href={`/services/${s.slug}`} aria-label={`Ver ${s.title} en el sitio`} className={ACCION}>
            Ver
          </Link>
          <Link href={`/admin/services/${s.id}`} aria-label={`Editar ${s.title}`} className={ACCION}>
            Editar
          </Link>
          <button type="button" aria-label={`Eliminar ${s.title}`} onClick={() => eliminar(s)} className={`${ACCION} text-error`}>
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p role="alert" className="rounded-tarjeta bg-white px-4 py-3 font-semibold text-error">
          {error}
        </p>
      )}
      <DynamicTable
        rows={services}
        columns={columnas}
        rowKey={(s) => s.id}
        searchText={(s) => `${s.title} ${s.slug}`}
        searchLabel="Buscar por título o dirección"
      />
    </div>
  );
}
