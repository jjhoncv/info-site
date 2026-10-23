// Los ganchos que tocan la base no corren en los escenarios @smoke: el smoke va contra producción, sin base
// local, y un escenario @smoke por definición no depende de datos (#57).
export const SIN_SMOKE = { tags: "not @smoke" } as const;
