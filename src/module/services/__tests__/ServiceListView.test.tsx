// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { Service } from "@/src/types/domain";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

import { ServiceListView } from "../components/admin/ServiceListView";

const servicio = (id: number, title: string): Service => ({
  id,
  title,
  slug: title.toLowerCase(),
  summary: "r",
  description: "d",
  includes: [],
  imageUrl: "/demo/portada.jpg",
  imageAlt: `Foto de ${title}`,
  position: id,
  createdAt: new Date("2026-10-01T12:00:00Z"),
  updatedAt: new Date("2026-10-02T12:00:00Z"),
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("lista los servicios con su dirección y un enlace para verlos en el sitio", () => {
  render(<ServiceListView services={[servicio(1, "Alfa"), servicio(2, "Beta")]} />);
  expect(screen.getByText("Alfa")).toBeTruthy();
  expect(screen.getByText("/services/beta")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Ver Alfa en el sitio" }).getAttribute("href")).toBe("/services/alfa");
  expect(screen.getByRole("link", { name: "Editar Alfa" }).getAttribute("href")).toBe("/admin/services/1");
});

it("no borra si el usuario no confirma", () => {
  const fetchMock = vi.spyOn(globalThis, "fetch");
  vi.spyOn(window, "confirm").mockReturnValue(false);
  render(<ServiceListView services={[servicio(1, "Alfa")]} />);
  fireEvent.click(screen.getByRole("button", { name: "Eliminar Alfa" }));
  expect(fetchMock).not.toHaveBeenCalled();
});

it("borra con DELETE al confirmar y refresca la lista", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ success: true }));
  vi.spyOn(window, "confirm").mockReturnValue(true);
  render(<ServiceListView services={[servicio(7, "Alfa")]} />);
  fireEvent.click(screen.getByRole("button", { name: "Eliminar Alfa" }));
  await waitFor(() => expect(refresh).toHaveBeenCalled());
  expect(fetchMock).toHaveBeenCalledWith("/api/admin/services/7", { method: "DELETE" });
});

it("avisa si el servidor no pudo borrar", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ success: false, error: "Falló" }, { status: 500 }));
  vi.spyOn(window, "confirm").mockReturnValue(true);
  render(<ServiceListView services={[servicio(7, "Alfa")]} />);
  fireEvent.click(screen.getByRole("button", { name: "Eliminar Alfa" }));
  expect((await screen.findByRole("alert")).textContent).toContain("No se pudo eliminar");
});
