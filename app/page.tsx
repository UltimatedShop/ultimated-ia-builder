"use client";

import { useState } from "react";
import { GeneratedSitePreview } from "@/components/GeneratedSitePreview";

type Mode = "builder" | "assistant";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<Mode>("builder");
  const [previewConfig, setPreviewConfig] = useState<any | null>(null);

  function handleGenerate() {
    const safePrompt = prompt.trim() || "Site Ultimated généré par l’IA";

    setPreviewConfig({
      title: safePrompt,
      subtitle:
        "Site généré en direct par Ultimated Builder IA (version démo visuelle).",
      theme: "dark-gold",
      sections: [
        {
          type: "features",
          title: "Ce que ton site peut faire",
          items: [
            {
              label: "Style luxe Ultimated",
              description:
                "Fond noir, accents or, look boutique / SaaS haut de gamme.",
              icon: "💎",
            },
            {
              label: "Texte personnalisé",
              description:
                "Le contenu s’adapte automatiquement à ce que tu écris dans le prompt.",
              icon: "⚡️",
            },
            {
              label: "Prêt pour l’IA",
              description:
                "Prochaine étape : brancher GPT-5.1 pour générer toute la structure de la page automatiquement.",
              icon: "🤖",
            },
          ],
        },
        {
          type: "cta",
          title: "Prochaine étape",
          text: "À l’étape suivante, on remplace ce layout fixe par un layout 100% généré par GPT-5.1 selon ta description.",
          buttonLabel: "Continuer le setup IA bientôt",
        },
      ],
    });
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Bandeau haut */}
      <header className="border-b border-yellow-700/40 bg-gradient-to-r from-black via-black to-[#1a1305] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-yellow-500/70">
            Outil perso — Ultimated Studio
          </p>
          <h1 className="text-xl md:text-2xl font-semibold text-yellow-100">
            Ultimated Builder IA
          </h1>
        </div>
        <div className="text-right text-xs md:text-sm text-yellow-500/80">
          <div className="font-mono">GPT-5.1 (API)</div>
          <div className="text-[11px] text-yellow-300/70">
            Mode builder visuel — Étape 1
          </div>
        </div>
      </header>

      {/* Layout principal */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Colonne gauche : prompt + contrôles */}
        <section className="border-r border-yellow-900/40 bg-gradient-to-b from-black via-[#060405] to-black px-6 md:px-8 py-6 flex flex-col">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-500/80">
              Étape 1
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-yellow-100">
              Décris le site que tu veux (Ultimated Builder IA)
            </h2>
            <p className="text-xs md:text-sm text-yellow-200/70 mt-2">
              Exemple&nbsp;:{" "}
              <span className="italic text-yellow-300">
                “Fais un site e-commerce Liquidation Montcalm où je peux
                importer moi-même mes produits.”
              </span>
            </p>
          </div>

          {/* Modes */}
          <div className="mb-3 flex gap-2">
            <button
              onClick={() => setMode("builder")}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                mode === "builder"
                  ? "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                  : "border-yellow-900/60 text-yellow-300/70 hover:border-yellow-600/80"
              }`}
            >
              Mode Builder
            </button>
            <button
              onClick={() => setMode("assistant")}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                mode === "assistant"
                  ? "bg-yellow-500/90 text-black border-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.25)]"
                  : "border-yellow-900/60 text-yellow-300/70 hover:border-yellow-600/80"
              }`}
            >
              Mode Assistant (bientôt)
            </button>
          </div>

          {/* Zone de prompt */}
          <div className="flex-1 flex flex-col mb-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 w-full rounded-xl bg-black/60 border border-yellow-800/60 focus:border-yellow-400/80 focus:ring-2 focus:ring-yellow-500/40 outline-none text-sm md:text-[15px] px-4 py-3 font-medium text-yellow-50 placeholder:text-yellow-600/70 resize-none"
              placeholder="Décris ton site en détail : type de business, style, sections, produits, ambiance, etc..."
            />
            <p className="text-[11px] text-yellow-500/70 mt-1">
              Appuie sur <span className="font-semibold">Entrée</span> ou sur le
              bouton pour générer un preview.
            </p>
          </div>

          {/* Bouton générer */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-yellow-400 text-black font-semibold text-sm shadow-[0_0_25px_rgba(250,204,21,0.45)] hover:bg-yellow-300 transition-transform active:scale-[0.98]"
            >
              ⚡ GÉNÉRER MON SITE (démo)
            </button>
