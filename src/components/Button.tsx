import Link from "next/link";

type Variante = "primario" | "secundario";

const BASE =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600";

const VARIANTES: Record<Variante, string> = {
  primario: "bg-marca-600 text-white hover:bg-marca-700",
  secundario: "border border-marca-600 text-marca-700 hover:bg-marca-50",
};

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
