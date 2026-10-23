// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { DynamicTable, type Column } from "../DynamicTable";

type Fila = { id: number; titulo: string };
const columnas: Column<Fila>[] = [{ key: "titulo", header: "Título", render: (f) => f.titulo }];
const filas: Fila[] = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, titulo: `Servicio ${i + 1}` }));

afterEach(cleanup);

const tabla = () => (
  <DynamicTable rows={filas} columns={columnas} rowKey={(f) => f.id} searchText={(f) => f.titulo} searchLabel="Buscar" />
);

it("muestra la primera página y cuántas filas hay", () => {
  render(tabla());
  expect(screen.getAllByRole("row")).toHaveLength(1 + 10);
  expect(screen.getByText("Mostrando 1–10 de 12")).toBeTruthy();
});

it("pagina", () => {
  render(tabla());
  fireEvent.click(screen.getByRole("button", { name: "Página 2" }));
  expect(screen.getByText("Servicio 11")).toBeTruthy();
  expect(screen.queryByText("Servicio 1")).toBeNull();
});

it("filtra con el buscador y vuelve a la primera página", () => {
  render(tabla());
  fireEvent.click(screen.getByRole("button", { name: "Página 2" }));
  fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "servicio 12" } });
  expect(screen.getByText("Servicio 12")).toBeTruthy();
  expect(screen.getAllByRole("row")).toHaveLength(2);
});

it("avisa cuando nada coincide", () => {
  render(tabla());
  fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "zzz" } });
  expect(screen.getByText("No hay resultados que coincidan con tu búsqueda.")).toBeTruthy();
});
