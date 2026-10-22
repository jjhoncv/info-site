"use client";

import { useState } from "react";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = Readonly<{
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  searchText: (row: T) => string;
  searchLabel: string;
  pageSize?: number;
}>;

const normalizar = (texto: string) => texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// Lista del admin (docs/maquetas/admin.html): buscador, tabla y paginación. Filtra en el navegador:
// el admin de esta demo maneja pocas filas.
export function DynamicTable<T>({ rows, columns, rowKey, searchText, searchLabel, pageSize = 10 }: Props<T>) {
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const filtradas = rows.filter((fila) => normalizar(searchText(fila)).includes(normalizar(busqueda.trim())));
  const paginas = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const actual = Math.min(pagina, paginas);
  const desde = (actual - 1) * pageSize;
  const visibles = filtradas.slice(desde, desde + pageSize);

  return (
    <div className="overflow-hidden rounded-tarjeta bg-white">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <label className="flex w-full max-w-xs flex-col">
          <span className="sr-only">{searchLabel}</span>
          <input
            type="search"
            value={busqueda}
            placeholder={searchLabel}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            className="w-full rounded-tarjeta border border-linea bg-white px-3 py-2 text-tinta placeholder:text-tinta-suave"
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-left">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`bg-marca-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-tinta-suave ${c.className ?? ""}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((fila) => (
              <tr key={rowKey(fila)} className="border-t border-linea">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>
                    {c.render(fila)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtradas.length === 0 && (
        <p className="px-4 py-8 text-center text-tinta-suave">No hay resultados que coincidan con tu búsqueda.</p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-linea px-4 py-3 text-sm text-tinta-suave">
        <span>
          {filtradas.length === 0
            ? "Sin resultados"
            : `Mostrando ${desde + 1}–${desde + visibles.length} de ${filtradas.length}`}
        </span>
        {paginas > 1 && (
          <nav aria-label="Páginas" className="flex gap-1">
            {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`Página ${n}`}
                aria-current={n === actual ? "page" : undefined}
                onClick={() => setPagina(n)}
                className="min-w-9 rounded-tarjeta px-2 py-1.5 font-semibold text-marca-900 hover:bg-marca-50 aria-[current=page]:bg-marca-900 aria-[current=page]:text-white"
              >
                {n}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
