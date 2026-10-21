// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { getServicioBySlug } from "../../services/demo";
import { ServiceCard } from "./ServiceCard";

it("la tarjeta enlaza al detalle y su ilustración tiene descripción", () => {
  const servicio = getServicioBySlug("asesoria-contable")!;
  render(<ServiceCard service={servicio} />);
  expect(screen.getByRole("link", { name: /Asesoría contable/ }).getAttribute("href")).toBe("/services/asesoria-contable");
  expect(screen.getByRole("img", { name: /Asesoría contable/ })).toBeTruthy();
});
