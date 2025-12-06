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
        "Site généré en direct par Ultimated Builder IA. Prochaine étape : génération complète avec GPT-5.1.",
      sections: [
        {
          type: "features",
          title: "Ce que ton site peut inclure",
          items: [
            {
              icon: "💎",
              label: "Style luxe Ultimated",
              description:
                "Fond noir profond, or satiné, sections propres façon boutique / SaaS haut de gamme.",
            },
            {
              icon: "⚡️",
              label: "Sections dynamiques",
              description:
                "Hero, arguments, appels à l’action, tout construit à partir de ta description.",
            },
            {
              icon: "🤖",
              label: "Puissance IA",
              description:
                "Ensuite : GPT-5.1 génère automatiquement la structure complète du site.",
            },
          ],
        },
        {
          type: "cta",
          title: "Prochaine étape",
          text: "On branchera ton API OpenAI pour transformer cette démo en vrai builder IA clé en main.",
          buttonLabel: "Activer le mode IA bientôt",
        },
      ],
    };

    setPreviewConfig(config);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Halo de lumière au centre (fond luxe) */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 right-[-10%] h-80 w-80 rounded-full blur-3xl bg-yellow-500/10" />
        <div className="absolute bottom-[-30%] left-[-10%] h-96 w-96 rounded-full blur-3xl bg-yellow-700/10" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-yellow-800/40 bg-gradient-to-r from-black/90 via-[#050304]/95 to-black/90 px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full border border-yellow-500/70 bg-black flex items-center justify-center shadow-[0_0_18px_rgba(250,204,21,0.35)]">
            <span className="text-sm font-semibold text-yellow-300">UB</span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-yellow-500/75">
              Ultimated Studio — Outil perso
            </p>
            <h1 className="text-xl md:text-2xl font-semibold text-yellow-50">
              Ultimated Builder IA
            </h1>
          </div>
        </div>

        <div className="text-right text-[11px] md:text-xs text-yellow-400/80">
          <div className="font-mono">GPT-5.1 (API)</div>
          <div className="text-[10px] text-yellow-500/70">
            Prototype live · Made in Ultimated
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <div className="relative z-10 flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] gap-0">
        {/* COLONNE GAUCHE — BUILDER */}
        <section className="border-r border-yellow-900/40 bg-gradient-to-b from-black via-[#050304] to-black/95 px-6 md:px-10 py-6 md:py-8 flex flex-col">
          {/* Intro */}
          <div className="mb-5 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-500/80">
              Étape 1 · Décris ton projet
            </p>
            <h2 className="text-lg md:text-2xl font-semibold text-yellow-50">
              Dis à l’IA quel type de site tu veux construire
            </h2>
            <p className="text-xs md:text-sm text-yellow-200/75 max-w-xl">
              Exemple :{" "}
              <span className="italic text-yellow-300">
                “Fais un site e-commerce de liquidation pour camions
                d’occasion, avec une page d’accueil, une section inventaire et
                un formulaire de demande de prix.”
              </span>
            </p>
          </div>

          {/* Switch de mode */}
          <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-yellow-800/70 bg-black/70 px-1.5 py-1 text-[11px]">
            <button
              onClick={() => setMode("builder")}
              className={`px-3 py-1 rounded-full transition-all ${
                mode === "builder"
                  ? "bg-yellow-400 text-black font-semibold shadow-[0_0_18px_rgba(250,204,21,0.45)]"
                  : "text-yellow-300/75 hover:text-yellow-200"
              }`}
            >
              Mode Builder
            </button>
            <button
              onClick={() => setMode("assistant")}
              className={`px-3 py-1 rounded-full transition-all ${
                mode === "assistant"
                  ? "bg-yellow-400 text-black font-semibold shadow-[0_0_18px_rgba(250,204,21,0.45)]"
                  : "text-yellow-300/75 hover:text-yellow-200"
              }`}
            >
              Mode Assistant (bientôt)
            </button>
          </div>

          {/* Zone de texte */}
          <div className="flex-1 flex flex-col mb-4">
            <div className="relative flex-1">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 w-full rounded-2xl bg-black/70 border border-yellow-900/70 focus:border-yellow-400/90 focus:ring-2 focus:ring-yellow-500/40 outline-none text-sm md:text-[15px] px-4 md:px-5 py-3 md:py-4 font-medium text-yellow-50 placeholder:text-yellow-700/80 resize-none shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
                placeholder="Écris ici : type de site, ambiance, sections voulues (hero, produits, contact, témoignages...), style (luxe, sombre, minimal, etc.)."
              />
              <div className="pointer-events-none absolute right-4 bottom-3 text-[10px] text-yellow-500/65 font-mono">
                Ultimated · Live prompt
              </div>
            </div>

            <p className="text-[11px] text-yellow-500/75 mt-1.5">
              Tu peux écrire un long paragraphe, l’IA résume et adapte le
              design. Le bouton ci-dessous affiche une prévisualisation luxe.
            </p>
          </div>

          {/* Bouton générer */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-2xl px-4 md:px-5 py-2.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-black font-semibold text-sm shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110 transition-transform active:scale-[0.97]"
            >
              ⚡ GÉNÉRER LE SITE (aperçu luxe)
            </button>
            <p className="text-[11px] text-yellow-400/80 max-w-xs md:text-right">
              Étape 2 : ce même bouton appellera GPT-5.1 pour générer un véritable
              site Ultimated clé en main.
            </p>
          </div>
        </section>

        {/* COLONNE DROITE — PREVIEW */}
        <section className="bg-gradient-to-b from-[#050304] via-black to-[#020101] px-4 md:px-6 xl:px-8 py-6 md:py-8">
          <div className="h-full w-full">
            <GeneratedSitePreview config={previewConfig} />
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-yellow-900/40 bg-black/95 px-6 md:px-10 py-3 text-[11px] md:text-xs text-yellow-500/80 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
        <span>From the House of Ultimated Studio Officiel</span>
        <span>Ultimated Builder IA — Prototype visuel (Étape 1/3)</span>
      </footer>
    </main>
  );
}
