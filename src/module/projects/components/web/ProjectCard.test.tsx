// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import type { ProjectWithImages } from "../../services/types";
import { ProjectCard } from "./ProjectCard";

const proyecto = {
  id: 1,
  title: "Proyecto Grupo Andino",
  slug: "proyecto-grupo-andino",
  summary: "Atención en 12 locales.",
  images: [
    { id: 1, projectId: 1, imageUrl: "/demo/a.jpg", imageAlt: "Portada", position: 1 },
    { id: 2, projectId: 1, imageUrl: "/demo/b.jpg", imageAlt: "Segunda", position: 2 },
  ],
} as ProjectWithImages;

it("la tarjeta lleva al detalle y usa la primera foto como portada", () => {
  render(<ProjectCard project={proyecto} />);
  expect(screen.getByRole("heading", { name: "Proyecto Grupo Andino" })).toBeTruthy();
  expect(screen.getByRole("link").getAttribute("href")).toBe("/projects/proyecto-grupo-andino");
  expect(screen.getByRole("img", { name: "Portada" })).toBeTruthy();
  expect(screen.getByText("2 fotos")).toBeTruthy();
});

it("con una sola foto dice «1 foto»", () => {
  render(<ProjectCard project={{ ...proyecto, images: proyecto.images.slice(0, 1) }} />);
  expect(screen.getByText("1 foto")).toBeTruthy();
});

it("sin fotos no se rompe", () => {
  render(<ProjectCard project={{ ...proyecto, images: [] }} />);
  expect(screen.queryByRole("img")).toBeNull();
});
