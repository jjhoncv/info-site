// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ImageField } from "../fields/ImageField";

const fetchMock = vi.fn();
beforeEach(() => vi.stubGlobal("fetch", fetchMock));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const campo = { key: "imageUrl", label: "Imagen", type: "image" as const, section: "Imagen" };
const elegir = (file: File) => fireEvent.change(screen.getByLabelText("Imagen"), { target: { files: [file] } });

it("muestra el motivo que da el servidor y no guarda la imagen", async () => {
  const onValue = vi.fn();
  fetchMock.mockResolvedValue(Response.json({ success: false, error: "La imagen pesa más de 2 MB; sube una más liviana" }, { status: 400 }));
  render(<ImageField field={campo} value="" onValue={onValue} />);
  elegir(new File(["x"], "grande.png", { type: "image/png" }));
  expect((await screen.findByRole("alert")).textContent).toBe("La imagen pesa más de 2 MB; sube una más liviana");
  expect(onValue).not.toHaveBeenCalled();
});

it("con una imagen aceptada entrega su ruta", async () => {
  const onValue = vi.fn();
  fetchMock.mockResolvedValue(Response.json({ success: true, data: { url: "/media/abc.png" } }, { status: 201 }));
  render(<ImageField field={campo} value="" onValue={onValue} />);
  elegir(new File(["x"], "a.png", { type: "image/png" }));
  await waitFor(() => expect(onValue).toHaveBeenCalledWith("/media/abc.png"));
  expect(screen.queryByRole("alert")).toBeNull();
});

it("si la red falla avisa sin romper", async () => {
  fetchMock.mockRejectedValue(new Error("sin red"));
  render(<ImageField field={campo} value="" onValue={vi.fn()} />);
  elegir(new File(["x"], "a.png", { type: "image/png" }));
  expect((await screen.findByRole("alert")).textContent).toMatch(/No se pudo subir/);
});

it("con una imagen actual muestra la vista previa", () => {
  render(<ImageField field={campo} value="/demo/servicios/x.jpg" onValue={vi.fn()} />);
  expect(screen.getByRole("img", { name: "Vista previa de la imagen" }).getAttribute("src")).toBe("/demo/servicios/x.jpg");
});
