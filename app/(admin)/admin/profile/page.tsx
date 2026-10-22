import type { Metadata } from "next";
import { ProfileView } from "@/src/module/auth/components/ProfileView";

export const metadata: Metadata = { title: "Mi perfil", robots: { index: false } };

// El proxy ya exige sesión en /admin/*.
export default function ProfilePage() {
  return <ProfileView username={process.env.DEMO_USER ?? "demo"} />;
}
