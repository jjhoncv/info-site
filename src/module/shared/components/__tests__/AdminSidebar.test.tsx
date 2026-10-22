// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

let ruta = "/admin/services";
vi.mock("next/navigation", () => ({ usePathname: () => ruta }));
vi.mock("@/src/module/auth/core/logout.action", () => ({ logout: vi.fn() }));

import { AdminSidebar } from "../AdminSidebar";

afterEach(() => {
  cleanup();
  ruta = "/admin/services";
});

it("marca la sección actual y trae Ver el sitio y Salir", () => {
  render(<AdminSidebar />);
  expect(screen.getByRole("link", { name: "Servicios" }).getAttribute("aria-current")).toBe("page");
  expect(screen.getByRole("link", { name: "Resumen" }).getAttribute("aria-current")).toBeNull();
  expect(screen.getByRole("link", { name: /Ver el sitio/ }).getAttribute("href")).toBe("/");
  expect(screen.getByRole("button", { name: /Salir/ })).toBeTruthy();
});

it("Resumen es la sección actual solo en /admin", () => {
  ruta = "/admin";
  render(<AdminSidebar />);
  expect(screen.getByRole("link", { name: "Resumen" }).getAttribute("aria-current")).toBe("page");
  expect(screen.getByRole("link", { name: "Servicios" }).getAttribute("aria-current")).toBeNull();
});

it("el botón Menú abre la barra en el celular", () => {
  render(<AdminSidebar />);
  const boton = screen.getByRole("button", { name: "Menú" });
  expect(boton.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(boton);
  expect(boton.getAttribute("aria-expanded")).toBe("true");
});
