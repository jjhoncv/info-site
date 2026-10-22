// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import type { Service } from "../../services/types";
import { ServiceCard } from "./ServiceCard";

const servicio = {
  title: "Asesoría personalizada",
  slug: "asesoria-personalizada",
  summary: "Resumen",
  imageUrl: "/demo/servicios/asesoria-personalizada.jpg",
  imageAlt: "Dos asesores revisan una propuesta",
} as Service;

afterEach(cleanup);

it("la tarjeta enlaza al detalle y su foto tiene descripción", () => {
  render(<ServiceCard service={servicio} />);
  expect(screen.getByRole("link", { name: /Asesoría personalizada/ }).getAttribute("href")).toBe(
    "/services/asesoria-personalizada",
  );
  expect(screen.getByRole("img", { name: servicio.imageAlt })).toBeTruthy();
});

it("sin imagen la tarjeta se dibuja igual, sin foto", () => {
  render(<ServiceCard service={{ ...servicio, imageUrl: undefined }} />);
  expect(screen.queryByRole("img")).toBeNull();
  expect(screen.getByRole("heading", { name: "Asesoría personalizada" })).toBeTruthy();
});
