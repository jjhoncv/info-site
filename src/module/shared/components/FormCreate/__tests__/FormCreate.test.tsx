// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

import { ServiceSchema } from "@/src/module/services/core/Service.schema";
import { servicesFields } from "@/src/module/services/components/admin/servicesFields";
import { FormCreate } from "../FormCreate";
import { toFormValues } from "../toPayload";

const fetchMock = vi.fn();
beforeEach(() => vi.stubGlobal("fetch", fetchMock));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const formulario = (props: Partial<React.ComponentProps<typeof FormCreate>> = {}) =>
  render(
    <FormCreate
      api="/api/admin/services"
      fields={servicesFields}
      schema={ServiceSchema}
      redirect="/admin/services"
      initialValues={toFormValues(servicesFields)}
      {...props}
    />,
  );

const escribir = (etiqueta: RegExp, valor: string) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
const guardar = () => fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

it("sin título muestra el mensaje bajo el campo y no llama a la API", async () => {
  formulario();
  guardar();
  expect(await screen.findByText("El título es obligatorio")).toBeTruthy();
  expect(screen.getByLabelText(/^Título \*/).getAttribute("aria-invalid")).toBe("true");
  expect(fetchMock).not.toHaveBeenCalled();
});

it("cada campo tiene su etiqueta y los obligatorios se marcan", () => {
  formulario();
  for (const nombre of [/^Título \*/, /Dirección en el sitio \*/, /Resumen \*/, /Descripción \*/, /Qué incluye/]) {
    expect(screen.getByLabelText(nombre)).toBeTruthy();
  }
});

it("en «crear», la dirección se arma con el título", () => {
  formulario();
  escribir(/^Título \*/, "Asesoría para empresas");
  expect((screen.getByLabelText(/Dirección/) as HTMLInputElement).value).toBe("asesoria-para-empresas");
});

it("el contador cuenta los caracteres", () => {
  formulario();
  escribir(/^Título \*/, "Hola");
  // Dos campos llevan 4 caracteres: el título y la dirección que se armó con él.
  expect(screen.getAllByText("4 / 150")).toHaveLength(2);
});

it("envía lo escrito (con «Qué incluye» como lista) y vuelve a la lista", async () => {
  fetchMock.mockResolvedValue(new Response("{}", { status: 201 }));
  formulario();
  escribir(/^Título \*/, "Servicio nuevo");
  escribir(/Resumen/, "Resumen");
  escribir(/^Descripción \*/, "Descripción");
  escribir(/Qué incluye/, "Uno\nDos");
  guardar();
  await waitFor(() => expect(router.push).toHaveBeenCalledWith("/admin/services"));
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe("/api/admin/services");
  expect(init.method).toBe("POST");
  expect(JSON.parse(init.body)).toMatchObject({ title: "Servicio nuevo", slug: "servicio-nuevo", includes: ["Uno", "Dos"] });
});

it("en «editar» manda PATCH y no cambia la dirección sola", async () => {
  fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
  const valores = { title: "A", slug: "a", summary: "r", description: "d", includes: ["x"] };
  formulario({ api: "/api/admin/services/3", method: "PATCH", initialValues: toFormValues(servicesFields, valores) });
  escribir(/^Título \*/, "Otro título");
  expect((screen.getByLabelText(/Dirección/) as HTMLInputElement).value).toBe("a");
  guardar();
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  expect(fetchMock.mock.calls[0][1].method).toBe("PATCH");
});

it("si la API rechaza, muestra su mensaje y se queda en el formulario", async () => {
  fetchMock.mockResolvedValue(Response.json({ error: "Ya existe un servicio con esa dirección" }, { status: 409 }));
  formulario({ initialValues: toFormValues(servicesFields, { title: "A", slug: "a", summary: "r", description: "d" }) });
  guardar();
  expect((await screen.findByRole("alert")).textContent).toBe("Ya existe un servicio con esa dirección");
  expect(router.push).not.toHaveBeenCalled();
});
