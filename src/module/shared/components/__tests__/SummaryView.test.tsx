// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SummaryView } from "../SummaryView";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("@/src/module/demo/core/restore.action", () => ({ restoreDemoAction: vi.fn() }));

afterEach(cleanup);

it("muestra el saludo, la cifra de servicios y los accesos rápidos", () => {
  render(<SummaryView servicesCount={6} uploadsCount={3} uploadsLimit={30} />);
  expect(screen.getByRole("heading", { level: 1, name: "Hola, bienvenido" })).toBeTruthy();
  expect(screen.getByText("Servicios publicados")).toBeTruthy();
  expect(screen.getByText("6")).toBeTruthy();
  expect(screen.getByText("Imágenes subidas")).toBeTruthy();
  expect(screen.getByText("3 / 30")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Agregar un servicio" }).getAttribute("href")).toBe("/admin/services/new");
});

it("ofrece el botón «Restaurar demo»", () => {
  render(<SummaryView servicesCount={0} uploadsCount={0} uploadsLimit={30} />);
  expect(screen.getByRole("heading", { name: "Restaurar la demo" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Restaurar demo" })).toBeTruthy();
});
