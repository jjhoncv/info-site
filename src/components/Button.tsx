import Link from "next/link";

type Variante = "primario" | "secundario" | "claro";

// Sin bordes: el peso lo da el color. El acento cálido se reserva para la acción principal (cotizar).
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-tarjeta px-5 py-3 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-600";

const VARIANTES: Record<Variante, string> = {
  primario: "bg-acento-600 text-white hover:bg-acento-700",
  secundario: "bg-marca-50 text-marca-900 hover:bg-marca-100",
  claro: "bg-white/10 text-white hover:bg-white/20",
};

export function Button({
  variant = "primario",
  children,
  ...props
}: Readonly<{ variant?: Variante; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={`${BASE} ${VARIANTES[variant]} disabled:opacity-60`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primario",
  children,
}: Readonly<{ href: string; variant?: Variante; children: React.ReactNode }>) {
  return (
    <Link href={href} className={`${BASE} ${VARIANTES[variant]}`}>
      {children}
    </Link>
  );
}
