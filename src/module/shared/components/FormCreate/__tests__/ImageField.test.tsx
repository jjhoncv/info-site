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

const campo = { key: "imageUrl", label: "Imagen del servicio", type: "image" as const, section: "Imagen" };
const elegir = (archivo: File) =>
  fireEvent.change(screen.getByLabelText(/Imagen del servicio/), { target: { files: [archivo] } });
const respuesta = (status: number, cuerpo: object) => new Response(JSON.stringify(cuerpo), { status });

it("sube el archivo elegido y entrega la URL al formulario", async () => {
  const onChange = vi.fn();
  fetchMock.mockResolvedValue(respuesta(201, { success: true, data: { url: "/media/a.png" } }));
  render(<ImageField field={campo} value="" onChange={onChange} />);
  elegir(new File([new Uint8Array([1])], "a.png", { type: "image/png" }));
  await waitFor(() => expect(onChange).toHaveBeenCalledWith("/media/a.png"));
  expect(fetchMock.mock.calls[0][0]).toBe("/api/admin/uploads");
  expect(fetchMock.mock.calls[0][1].body).toBeInstanceOf(FormData);
});

it("muestra el motivo que da el servidor y no cambia la imagen", async () => {
  const onChange = vi.fn();
  fetchMock.mockResolvedValue(respuesta(400, { success: false, error: "No se aceptó el archivo: solo se admiten imágenes JPG, PNG o WebP." }));
  render(<ImageField field={campo} value="" onChange={onChange} />);
  elegir(new File(["hola"], "nota.txt", { type: "text/plain" }));
  expect((await screen.findByRole("alert")).textContent).toBe("No se aceptó el archivo: solo se admiten imágenes JPG, PNG o WebP.");
  expect(onChange).not.toHaveBeenCalled();
});

it("si falla la red, avisa con un mensaje genérico", async () => {
  fetchMock.mockRejectedValue(new Error("offline"));
  render(<ImageField field={campo} value="" onChange={vi.fn()} />);
  elegir(new File([new Uint8Array([1])], "a.png"));
  expect((await screen.findByRole("alert")).textContent).toBe("No se pudo subir la imagen; intenta de nuevo");
});

it("dibuja la vista previa de la imagen actual", () => {
  render(<ImageField field={campo} value="/media/a.png" onChange={vi.fn()} />);
  expect(screen.getByRole("img").getAttribute("src")).toBe("/media/a.png");
});
