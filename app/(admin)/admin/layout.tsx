import { LayoutPageAdmin } from "@/src/module/shared/components/LayoutPageAdmin";

export default function AdminAppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LayoutPageAdmin>{children}</LayoutPageAdmin>;
}
