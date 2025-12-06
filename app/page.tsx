"use client";

import { useState } from "react";
import { GeneratedSitePreview } from "./components/GeneratedSitePreview";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"builder" | "assistant">("builder");
  const [previewConfig, setPreviewConfig] = useState<any>(null);

  function handleGenerate() {
    const safePrompt = prompt.trim() || "Site Ultimated généré par l’IA";

    const config = {
      title: safePrompt,
      subtitle:
        "Prévisualisation luxe générée par Ultimated Builder IA. Ensuite, GPT-5.1 pourra construire une vraie page complète.",
      sections: [
        {
          type: "features",
          title: "Ce que le site peut inclure",
          items: [
            {
              icon: "💎",
              label: "Style luxe Ultimated",
              description:
                "Fond sombre, or satiné, sections propres pour boutiques, SaaS ou services premium.",
            },
            {
              icon: "⚡️",
              label: "Sections dynamiques",
              description:
                "Hero, arguments, sections produits, appels à l’action, formulaires et plus encore.",
            },
            {
              icon: "🤖",
              label: "Puissance IA",
              description:
                "Prochaine étape : GPT-5.1 génère toute la structure à partir de ton texte.",
            },
          ],
        },
        {
          type: "cta",
          title: "Prochaine étape : tout automatiser",
          text: "Une fois satisfait du rendu, on branchera l’API OpenAI pour que ton client puisse générer ses propres sites Ultimated en 1 prompt.",
          buttonLabel: "Activer le mode IA bientôt",
        },
      ],
    };

    setPreviewConfig(config);
  }

  return (
    <div className="ub-root">
      <div className="ub-shell">
        {/* HEADER */}
        <header className="ub-header">
          <div className="ub-header-left">
            <div className="ub-logo-circle">
              <span>UB</span>
            </div>
            <div>
              <div className="ub-header-text-top">
                Ultimated Studio — Outil perso
              </div>
              <div className="ub-header-title">Ultimated Builder IA</div>
            </div>
          </div>

          <div className="ub-header-right">
            <div className="ub-header-right-mono">GPT-5.1 (API)</div>
            <div>Prototype live · Made in Ultimated</div>
          </div>
        </header>

        {/* MAIN */}
        <main className="ub-main">
          {/* GAUCHE : PROMPT */}
          <section className="ub-left">
            <div>
              <div className="ub-step-label">Étape 1 · Décris ton projet</div>
              <div className="ub-left-title">
                Dis à l’IA quel type de site tu veux construire
              </div>
              <p className="ub-left-subtitle">
                Exemple :{" "}
                <span>
                  “Fais un site e-commerce de liquidation pour camions
                  d’occasion, avec une page d’accueil, une section inventaire et
                  un formulaire de demande de prix.”
                </span>
              </p>
            </div>

            {/* Mode toggle */}
            <div className="ub-mode-toggle">
              <button
                type="button"
                className={`ub-mode-btn ${
                  mode === "builder" ? "active" : ""
                }`}
                onClick={() => setMode("builder")}
              >
                Mode Builder
              </button>
              <button
                type="button"
                className={`ub-mode-btn ${
                  mode === "assistant" ? "active" : ""
                }`}
                onClick={() => setMode("assistant")}
              >
                Mode Assistant (bientôt)
              </button>
            </div>

            {/* Textarea */}
            <div className="ub-textarea-wrapper">
              <textarea
                className="ub-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Écris ici : type de site, ambiance, sections voulues (hero, produits, contact, témoignages...), style (luxe, sombre, minimal, etc.)."
              />
              <div className="ub-textarea-tag">Ultimated · Live prompt</div>
            </div>
            <p className="ub-helper">
              Tu peux écrire un long paragraphe, l’IA résumera et adaptera la
              structure. Ici, on affiche d’abord une prévisualisation luxe.
            </p>

            {/* Boutons */}
            <div className="ub-actions-row">
              <button
                type="button"
                onClick={handleGenerate}
                className="ub-primary-btn"
              >
                <span>⚡</span>
                <span>GÉNÉRER LE SITE (aperçu luxe)</span>
              </button>
              <p className="ub-secondary-note">
                Étape 2 : ce même bouton utilisera vraiment GPT-5.1 pour
                construire la page Ultimated de A à Z.
              </p>
            </div>
          </section>

          {/* DROITE : PREVIEW */}
          <section className="ub-right">
            <GeneratedSitePreview config={previewConfig} />
          </section>
        </main>

        {/* FOOTER */}
        <footer className="ub-footer">
          <span>From the House of Ultimated Studio Officiel</span>
          <span>Ultimated Builder IA — Prototype visuel (Étape 1/3)</span>
        </footer>
      </div>
    </div>
  );
}
