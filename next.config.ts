import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El deploy del Guardián construye offline y /_next/image responde 404 en Netlify: las imágenes se sirven
  // tal cual, ya comprimidas (public/demo). Cuando el Guardián lo resuelva, se quita esta línea.
  images: { unoptimized: true },
};

export default nextConfig;
