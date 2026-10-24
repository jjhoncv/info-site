// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Footer } from "./Footer";
import { Header } from "./Header";

vi.mock("@/src/module/services/core", () => ({
  serviceModel: { getServices: async () => [{ slug: "capacitacion", title: "Capacitación" }] },
}));

it("el encabezado tiene navegación con Servicios y la acción de cotizar", () => {
  render(<Header />);
  expect(screen.getByRole("navigation", { name: "Principal" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Servicios" }).getAttribute("href")).toBe("/services");
  expect(screen.getByRole("link", { name: "Solicitar cotización" })).toBeTruthy();
});

it("el encabezado enlaza a Proyectos", () => {
  render(<Header />);
  expect(screen.getByRole("link", { name: "Proyectos" }).getAttribute("href")).toBe("/projects");
});

it("el pie tiene el nombre de la empresa, los servicios, el contacto y la marca de demostración", async () => {
  render(await Footer());
  const pie = screen.getByRole("contentinfo").textContent ?? "";
  expect(pie).toContain("Capacitación");
  expect(pie).toContain("Tu Empresa");
  expect(pie).toContain("+51 999 888 777");
  expect(pie).toContain("Sitio de demostración");
});
