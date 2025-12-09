// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ultimated Builder IA",
  description:
    "Outil officiel Ultimated Studio Officiel — transforme une phrase en vrai site prêt à tester, avec design de luxe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="ub-body">
        <div className="ub-shell">
          <header className="ub-header">
            <div className="ub-logo">UB</div>
            <div className="ub-header-right">
              <span className="ub-header-pill">GPT-5.1</span>
              <span className="ub-header-pill">Ultimated Studio Officiel</span>
            </div>
          </header>

          <div className="ub-page">{children}</div>

          <footer className="ub-footer">
            Outil officiel · From the House of Ultimated Studio Officiel
          </footer>
        </div>
      </body>
    </html>
  );
}
