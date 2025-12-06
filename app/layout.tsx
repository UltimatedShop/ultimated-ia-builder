// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ultimated Builder IA",
  description:
    "Outil Ultimated Studio pour générer des sites complets avec l’IA, en direct comme Base44.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-body text-body min-h-screen">{children}</body>
    </html>
  );
}
