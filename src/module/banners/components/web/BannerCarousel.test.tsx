// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { Banner } from "../../services/types";
import { BannerCarousel } from "./BannerCarousel";
import { INTERVALO_MS } from "./useBannerCarousel";

const banner = (id: number, title: string): Banner => ({
  id,
  title,
  subtitle: `Frase ${id}`,
  imageUrl: `/demo/b${id}.jpg`,
  imageAlt: `Foto ${id}`,
  position: id,
  visible: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});
const banners = [banner(1, "Tu empresa, en buenas manos"), banner(2, "Planes para empresas"), banner(3, "Otro")];

// jsdom no trae matchMedia: se simula si el sistema pide menos movimiento.
const menosMovimiento = (reduce: boolean) =>
  vi.stubGlobal("matchMedia", () => ({ matches: reduce, addEventListener: vi.fn(), removeEventListener: vi.fn() }));

beforeEach(() => {
  vi.useFakeTimers();
  menosMovimiento(false);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const avanzar = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
const titulosVisibles = () => screen.getAllByRole("heading", { hidden: false }).map((h) => h.textContent);

it("muestra el primer banner con su título, frase y foto con descripción", () => {
  render(<BannerCarousel banners={banners} />);
  expect(screen.getByRole("heading", { level: 1, name: "Tu empresa, en buenas manos" })).toBeTruthy();
  expect(screen.getByText("Frase 1")).toBeTruthy();
  expect(screen.getByRole("img", { name: "Foto 1" })).toBeTruthy();
  expect(titulosVisibles()).toEqual(["Tu empresa, en buenas manos"]);
});

it("la foto del primer banner carga con prioridad y las otras no", () => {
  const { container } = render(<BannerCarousel banners={banners} />);
  const fotos = container.querySelectorAll("img");
  // `priority` de next/image: la primera carga de inmediato; las demás, en diferido.
  expect(fotos[0].getAttribute("loading")).toBeNull();
  expect(fotos[1].getAttribute("loading")).toBe("lazy");
  expect(fotos[2].getAttribute("loading")).toBe("lazy");
});

it("«Siguiente» y «Anterior» recorren los banners en su orden y dan la vuelta", () => {
  render(<BannerCarousel banners={banners} />);
  fireEvent.click(screen.getByRole("button", { name: "Banner siguiente" }));
  expect(titulosVisibles()).toEqual(["Planes para empresas"]);
  fireEvent.click(screen.getByRole("button", { name: "Banner anterior" }));
  fireEvent.click(screen.getByRole("button", { name: "Banner anterior" }));
  expect(titulosVisibles()).toEqual(["Otro"]);
  expect(screen.getByText("3 / 3")).toBeTruthy();
});

it("las barras con etiqueta llevan al banner elegido", () => {
  render(<BannerCarousel banners={banners} />);
  fireEvent.click(screen.getByRole("button", { name: "Ver banner 3: Otro" }));
  expect(titulosVisibles()).toEqual(["Otro"]);
});

it("cambia solo cada 6 segundos, no antes", () => {
  render(<BannerCarousel banners={banners} />);
  avanzar(INTERVALO_MS - 1);
  expect(titulosVisibles()).toEqual(["Tu empresa, en buenas manos"]);
  avanzar(1);
  expect(titulosVisibles()).toEqual(["Planes para empresas"]);
});

it("se pausa con el mouse encima y sigue al sacarlo", () => {
  render(<BannerCarousel banners={banners} />);
  const carrusel = screen.getByTestId("carrusel-banners");
  fireEvent.mouseEnter(carrusel);
  avanzar(INTERVALO_MS * 3);
  expect(titulosVisibles()).toEqual(["Tu empresa, en buenas manos"]);
  fireEvent.mouseLeave(carrusel);
  avanzar(INTERVALO_MS);
  expect(titulosVisibles()).toEqual(["Planes para empresas"]);
});

it("se pausa al enfocar un botón y sigue al salir del foco", () => {
  render(<BannerCarousel banners={banners} />);
  const siguiente = screen.getByRole("button", { name: "Banner siguiente" });
  fireEvent.focus(siguiente);
  avanzar(INTERVALO_MS * 2);
  expect(titulosVisibles()).toEqual(["Tu empresa, en buenas manos"]);
  fireEvent.blur(siguiente);
  avanzar(INTERVALO_MS);
  expect(titulosVisibles()).toEqual(["Planes para empresas"]);
});

it("«Pausar» detiene el cambio y «Reanudar» lo devuelve", () => {
  render(<BannerCarousel banners={banners} />);
  fireEvent.click(screen.getByRole("button", { name: "Pausar los banners" }));
  avanzar(INTERVALO_MS * 2);
  expect(titulosVisibles()).toEqual(["Tu empresa, en buenas manos"]);
  fireEvent.click(screen.getByRole("button", { name: "Reanudar los banners" }));
  avanzar(INTERVALO_MS);
  expect(titulosVisibles()).toEqual(["Planes para empresas"]);
});

it("no se mueve si el sistema pide menos movimiento, pero se maneja a mano", () => {
  menosMovimiento(true);
  render(<BannerCarousel banners={banners} />);
  avanzar(INTERVALO_MS * 3);
  expect(titulosVisibles()).toEqual(["Tu empresa, en buenas manos"]);
  expect(screen.queryByRole("button", { name: /Pausar|Reanudar/ })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Banner siguiente" }));
  expect(titulosVisibles()).toEqual(["Planes para empresas"]);
});

it("con un solo banner no hay controles ni cambio", () => {
  render(<BannerCarousel banners={banners.slice(0, 1)} />);
  expect(screen.queryByRole("button")).toBeNull();
  avanzar(INTERVALO_MS * 2);
  expect(titulosVisibles()).toEqual(["Tu empresa, en buenas manos"]);
});

it("sin banners no dibuja el carrusel", () => {
  const { container } = render(<BannerCarousel banners={[]} />);
  expect(container.innerHTML).toBe("");
});
