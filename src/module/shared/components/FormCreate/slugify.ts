// «Asesoría para empresas» → «asesoria-para-empresas» (minúsculas, sin tildes, guiones).
export const slugify = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
