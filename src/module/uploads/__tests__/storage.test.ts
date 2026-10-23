import { afterEach, expect, it, vi } from "vitest";

const blobs = vi.hoisted(() => {
  const store = { list: vi.fn(), delete: vi.fn() };
  return { store, getStore: vi.fn(() => store) };
});
vi.mock("@netlify/blobs", () => ({ getStore: blobs.getStore }));

import { deleteAllBlobs, readBlob, saveBlob } from "../core/storage";

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

it("en Netlify borra cada blob de todas las páginas del store uploads", async () => {
  vi.stubEnv("NETLIFY", "true");
  blobs.store.list.mockReturnValue(
    (async function* () {
      yield { blobs: [{ key: "a.png" }, { key: "b.jpg" }] };
      yield { blobs: [{ key: "c.webp" }] };
    })(),
  );
  await deleteAllBlobs();
  expect(blobs.getStore).toHaveBeenCalledWith({ name: "uploads", consistency: "strong" });
  expect(blobs.store.delete.mock.calls.map((c) => c[0])).toEqual(["a.png", "b.jpg", "c.webp"]);
});
