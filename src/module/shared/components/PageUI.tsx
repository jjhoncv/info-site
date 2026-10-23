// Cabecera de cada pantalla del admin: título, subtítulo y, a la derecha, la acción principal.
export function PageUI({
  title,
  subtitle,
  action,
  children,
}: Readonly<{ title: string; subtitle?: string; action?: React.ReactNode; children?: React.ReactNode }>) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-marca-900">{title}</h1>
          {subtitle && <p className="mt-1 text-tinta-suave">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}
