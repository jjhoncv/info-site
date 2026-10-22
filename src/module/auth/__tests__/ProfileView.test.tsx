// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ProfileView } from "../components/ProfileView";

it("muestra el usuario y explica que la clave no se cambia", () => {
  render(<ProfileView username="demo" />);
  expect(screen.getByRole("heading", { level: 1, name: "Mi perfil" })).toBeTruthy();
  expect(screen.getByLabelText("Usuario")).toHaveProperty("value", "demo");
  expect(screen.getByText(/su clave no se puede cambiar/)).toBeTruthy();
});

it("no ofrece ningún campo ni botón para cambiar la clave", () => {
  render(<ProfileView username="demo" />);
  expect(screen.queryByLabelText(/clave/i)).toBeNull();
  expect(screen.queryByRole("button", { name: /clave|guardar|cambiar/i })).toBeNull();
});
