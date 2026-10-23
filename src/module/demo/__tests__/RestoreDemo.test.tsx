// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({ action: vi.fn(), refresh: vi.fn() }));
vi.mock("../core/restore.action", () => ({ restoreDemoAction: m.action }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: m.refresh }) }));

import { RestoreDemo } from "../components/admin/RestoreDemo";

beforeEach(() => vi.resetAllMocks());
afterEach(cleanup);

it("pide confirmación antes de restaurar y no hace nada si se cancela", () => {
  render(<RestoreDemo />);
  expect(screen.queryByRole("dialog")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Restaurar demo" }));
  expect(screen.getByRole("dialog", { name: "¿Restaurar la demo?" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(m.action).not.toHaveBeenCalled();
});

it("al confirmar restaura, cierra y refresca el resumen", async () => {
  m.action.mockResolvedValue({ ok: true });
  render(<RestoreDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Restaurar demo" }));
  fireEvent.click(screen.getByRole("button", { name: "Sí, restaurar" }));
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("La demo volvió a su contenido original"));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(m.refresh).toHaveBeenCalled();
});

it("si falla, muestra el motivo y deja reintentar", async () => {
  m.action.mockResolvedValue({ ok: false, error: "No se pudo restaurar la demo. Intenta de nuevo." });
  render(<RestoreDemo />);
  fireEvent.click(screen.getByRole("button", { name: "Restaurar demo" }));
  fireEvent.click(screen.getByRole("button", { name: "Sí, restaurar" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("No se pudo restaurar la demo. Intenta de nuevo."));
  expect(m.refresh).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Restaurar demo" })).toBeTruthy();
});
