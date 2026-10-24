import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El deploy del Guardián construye offline y /_next/image responde 404 en Netlify: las imágenes se sirven
  // tal cual, ya comprimidas (public/demo). Cuando el Guardián lo resuelva, se quita esta línea.
  images: { unoptimized: true },
  // Solo el nombre de la base del PR (no es secreto): el build del preview lo trae del Guardián y queda fijo,
  // porque staging y los previews comparten las variables de Netlify (ADR 0014). Vacío en staging y producción.
  env: { MYSQL_DATABASE_PREVIEW: process.env.MYSQL_DATABASE_PREVIEW ?? "" },
};

export default nextConfig;
