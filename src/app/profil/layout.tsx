import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Profil | Rexel Modern",
  description: "Consultez et gérez vos informations personnelles",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
