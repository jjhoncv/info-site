// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import type { ProjectImage } from "../../services/types";
import { ProjectGallery } from "./ProjectGallery";

const foto = (n: number): ProjectImage => ({ id: n, projectId: 1, imageUrl: `/demo/${n}.jpg`, imageAlt: `Foto número ${n}`, position: n });
const fotos = [1, 2, 3, 4].map(foto);

it("muestra la portada grande, su descripción y una miniatura por foto en orden", () => {
  render(<ProjectGallery images={fotos} />);
  expect(screen.getByText("1 / 4")).toBeTruthy();
  expect(screen.getByRole("img", { name: "Foto número 1" })).toBeTruthy();
  const miniaturas = screen.getAllByRole("button");
  expect(miniaturas.map((b) => b.getAttribute("aria-label"))).toEqual([
    "Ver foto 1: Foto número 1",
    "Ver foto 2: Foto número 2",
    "Ver foto 3: Foto número 3",
    "Ver foto 4: Foto número 4",
  ]);
  expect(miniaturas[0].getAttribute("aria-current")).toBe("true");
});

it("al pulsar una miniatura cambia la foto grande y su descripción", () => {
  render(<ProjectGallery images={fotos} />);
  fireEvent.click(screen.getByRole("button", { name: /Ver foto 3/ }));
  expect(screen.getByText("3 / 4")).toBeTruthy();
  expect(screen.getByRole("img", { name: "Foto número 3" })).toBeTruthy();
  expect(screen.getByText("Foto número 3", { selector: "figcaption" })).toBeTruthy();
});

it("las flechas del teclado recorren la galería y dan la vuelta", () => {
  render(<ProjectGallery images={fotos} />);
  const lista = screen.getByRole("list", { name: "Fotos del proyecto" });
  fireEvent.keyDown(lista, { key: "ArrowLeft" });
  expect(screen.getByText("4 / 4")).toBeTruthy();
  fireEvent.keyDown(lista, { key: "ArrowRight" });
  expect(screen.getByText("1 / 4")).toBeTruthy();
  fireEvent.keyDown(lista, { key: "ArrowRight" });
  expect(screen.getByText("2 / 4")).toBeTruthy();
});

it("sin fotos no dibuja nada", () => {
  const { container } = render(<ProjectGallery images={[]} />);
  expect(container.textContent).toBe("");
});
