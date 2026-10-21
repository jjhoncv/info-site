// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ButtonLink } from "./Button";

it("el botón es un enlace con su texto", () => {
  render(<ButtonLink href="/services">Ver servicios</ButtonLink>);
  expect(screen.getByRole("link", { name: "Ver servicios" }).getAttribute("href")).toBe("/services");
});
