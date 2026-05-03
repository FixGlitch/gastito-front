import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gastito · Tu finanzas simples",
  description: "Dashboard de gestión financiera personal adaptado a Argentina",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
