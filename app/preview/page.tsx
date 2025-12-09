"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PreviewPage() {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("ub-last-site-html");
      setHtml(stored);
    }
  }, []);

  const hasHtml = html && html.trim().length > 0;

  return (
    <div className="ub-preview-full">
      {/* Top bar de l’aperçu */}
      <header className="ub-preview-topbar">
        <div className="ub-preview-topbar-left">
          <span className="ub-preview-badge">Preview</span>
          <span className="ub-preview-title">Aperçu du site généré</span>
        </div>
        <div className="ub-preview-topbar-right">
          <Link href="/" className="ub-preview-back">
            ← Retour au Builder
          </Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="ub-preview-main">
        {!hasHtml && (
          <div className="ub-preview-empty">
            <p>
              Aucun site généré pour le moment. Retourne sur{" "}
              <span className="ub-preview-highlight">Ultimated Builder IA</span>,
              décris ton projet, génère une structure puis clique sur
              &nbsp;
              <strong>“Ouvrir en page séparée”</strong>.
            </p>
          </div>
        )}

        {hasHtml && (
          <div
            className="ub-preview-frame"
            dangerouslySetInnerHTML={{ __html: html as string }}
          />
        )}
      </main>
    </div>
  );
}
