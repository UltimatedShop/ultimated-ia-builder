// app/page.tsx
"use client";

import { useState } from "react";

type Mode = "builder" | "assistant";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("builder");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setHtml("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Erreur API:", data);
        throw new Error("api_error");
      }

      const data = await res.json();
      setHtml(data.html || "");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Aucune réponse (vérifie la clé API ou le billing OpenAI)."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-10 px-4 lg:px-10 bg-gradient-radial">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] text-goldSoft uppercase">
              Outil perso · Ultimated Studio
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-gold">
              Ultimated Builder IA
            </h1>
            <p className="text-sm text-muted mt-1 max-w-xl">
              Décris le type de site que tu veux et l’IA te renvoie un{" "}
              <span className="text-gold">site complet généré en direct</span>{" "}
              dans la preview à droite.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-goldSoft">
              GPT-5.1 (API)
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-live" />
          </div>
        </header>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
          {/* Left: prompt */}
          <section className="panel">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-gold">
                  Décris ton site (comme sur Base44, mais version Ultimated)
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Exemple : “Fais-moi un site e-commerce Liquidation Montcalm
                  où je peux importer moi-même mes produits.”
                </p>
              </div>
            </div>

            <div className="relative">
              <textarea
                className="textarea"
                placeholder="Décris ton site ici…"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={6}
              />
              <p className="helper-text">
                Appuie sur <span className="key">Entrée</span> pour générer
                (ou utilise le bouton).
              </p>
            </div>

            {/* Mode toggle (Builder / Assistant) */}
            <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPrompt("Plateforme e-commerce de luxe pour vêtements haut de gamme.")}
                  className="chip"
                >
                  Boutique de luxe
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      "Dashboard crypto avec graphiques, prix en temps réel et section actualités."
                    )
                  }
                  className="chip"
                >
                  Dashboard crypto
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      "Landing page SaaS pour vendre un logiciel de gestion d’entreprise."
                    )
                  }
                  className="chip"
                >
                  Landing SaaS
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={
                    mode === "builder"
                      ? "mode-pill mode-pill-active"
                      : "mode-pill"
                  }
                  onClick={() => setMode("builder")}
                >
                  Mode Builder
                </span>
                <span
                  className={
                    mode === "assistant"
                      ? "mode-pill mode-pill-active"
                      : "mode-pill"
                  }
                  onClick={() => setMode("assistant")}
                >
                  Mode Assistant
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="btn-primary mt-6 w-full md:w-auto"
            >
              {loading ? "Génération en cours…" : "GÉNÉRER MON SITE"}
            </button>

            {errorMsg && (
              <p className="text-xs text-red-400 mt-3">{errorMsg}</p>
            )}
          </section>

          {/* Right: preview */}
          <section className="panel relative">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-gold">
                  Preview du site généré
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Après génération, le site complet s’affiche ici, directement
                  dans l’app.
                </p>
              </div>
              <span className="text-[0.65rem] uppercase tracking-[0.22em] text-goldSoft border border-goldSoft/40 rounded-full px-3 py-1">
                Live render
              </span>
            </div>

            <div className="preview-frame">
              {!html && !errorMsg && (
                <div className="h-full flex items-center justify-center text-xs text-muted text-center px-6">
                  Tape ce que tu veux comme site à gauche, clique sur
                  <span className="text-gold ml-1 mr-1">“GÉNÉRER MON SITE”</span>
                  et la version IA s’affichera ici en direct.
                </div>
              )}

              {html && (
                <div
                  className="h-full w-full overflow-auto bg-black/60 rounded-xl border border-neutral-800"
                  // ⚠️ On sait ce qu’on fait : contenu généré par l’IA
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>
          </section>
        </div>

        {/* Footer simple */}
        <footer className="mt-10 text-[0.65rem] text-muted text-center">
          From the House of{" "}
          <span className="text-gold">Ultimated Studio Officiel</span>.
        </footer>
      </div>
    </main>
  );
}
