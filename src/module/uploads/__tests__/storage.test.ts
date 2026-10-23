import { afterEach, beforeEach, expect, it, vi } from "vitest";

const blobs = vi.hoisted(() => {
  const store = { list: vi.fn(), delete: vi.fn() };
  return { store, getStore: vi.fn(() => store) };
});
vi.mock("@netlify/blobs", () => ({ getStore: blobs.getStore }));

import { deleteAllBlobs, readBlob, saveBlob, StoreNoConfigurado } from "../core/storage";

beforeEach(() => {
  vi.stubEnv("UPLOADS_STORE", "uploads");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

it("en local borra la carpeta de imágenes", async () => {
  await saveBlob("a.png", Uint8Array.from([1, 2, 3]), "image/png");
  expect(await readBlob("a.png")).not.toBeNull();
  await deleteAllBlobs();
  expect(await readBlob("a.png")).toBeNull();
});

it("en local no falla si no hay nada subido", async () => {
  await deleteAllBlobs();
  await expect(deleteAllBlobs()).resolves.toBeUndefined();
});

it("en Netlify borra cada blob de todas las páginas del store de UPLOADS_STORE", async () => {
  vi.stubEnv("NETLIFY", "true");
  vi.stubEnv("UPLOADS_STORE", "uploads-prod");
  blobs.store.list.mockReturnValue(
    (async function* () {
      yield { blobs: [{ key: "a.png" }, { key: "b.jpg" }] };
      yield { blobs: [{ key: "c.webp" }] };
    })(),
  );
  await deleteAllBlobs();
  expect(blobs.getStore).toHaveBeenCalledWith({ name: "uploads-prod", consistency: "strong" });
  expect(blobs.store.delete.mock.calls.map((c) => c[0])).toEqual(["a.png", "b.jpg", "c.webp"]);
});

it("en local cada valor de UPLOADS_STORE es un almacén aparte", async () => {
  vi.stubEnv("UPLOADS_STORE", "uploads-prod");
  await saveBlob("a.png", Uint8Array.from([1]), "image/png");
  vi.stubEnv("UPLOADS_STORE", "uploads");
  expect(await readBlob("a.png")).toBeNull();
  await deleteAllBlobs();
  vi.stubEnv("UPLOADS_STORE", "uploads-prod");
  expect(await readBlob("a.png")).not.toBeNull();
  await deleteAllBlobs();
});

it.each([
  ["guardar", () => saveBlob("a.png", Uint8Array.from([1]), "image/png")],
  ["leer", () => readBlob("a.png")],
  ["borrar", () => deleteAllBlobs()],
])("en Netlify sin UPLOADS_STORE no toca ningún almacén al %s", async (_, accion) => {
  vi.stubEnv("NETLIFY", "true");
  vi.stubEnv("UPLOADS_STORE", "");
  await expect(accion()).rejects.toBeInstanceOf(StoreNoConfigurado);
  expect(blobs.getStore).not.toHaveBeenCalled();
});
