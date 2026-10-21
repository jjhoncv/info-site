// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Footer } from "./Footer";
import { Header } from "./Header";

it("el encabezado tiene navegación con Servicios", () => {
  render(<Header />);
  expect(screen.getByRole("navigation", { name: "Principal" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Servicios" }).getAttribute("href")).toBe("/services");
});

it("el pie tiene el nombre del sitio", () => {
  render(<Footer />);
  expect(screen.getByRole("contentinfo").textContent).toContain("Info Site");
});
