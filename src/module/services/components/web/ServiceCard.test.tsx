// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { getServicioBySlug } from "../../services/demo";
import { ServiceCard } from "./ServiceCard";

it("la tarjeta enlaza al detalle y su foto tiene descripción", () => {
  const servicio = getServicioBySlug("asesoria-personalizada")!;
  render(<ServiceCard service={servicio} />);
  expect(screen.getByRole("link", { name: /Asesoría personalizada/ }).getAttribute("href")).toBe(
    "/services/asesoria-personalizada",
  );
  expect(screen.getByRole("img", { name: servicio.imageAlt })).toBeTruthy();
});
