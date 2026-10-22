// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Footer } from "./Footer";
import { Header } from "./Header";

it("el encabezado tiene navegación con Servicios y la acción de cotizar", () => {
  render(<Header />);
  expect(screen.getByRole("navigation", { name: "Principal" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Servicios" }).getAttribute("href")).toBe("/services");
  expect(screen.getByRole("link", { name: "Solicitar cotización" })).toBeTruthy();
});

it("el pie tiene el nombre de la empresa, el contacto y la marca de demostración", () => {
  render(<Footer />);
  const pie = screen.getByRole("contentinfo").textContent ?? "";
  expect(pie).toContain("Tu Empresa");
  expect(pie).toContain("+51 999 888 777");
  expect(pie).toContain("Sitio de demostración");
});
