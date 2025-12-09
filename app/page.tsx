"use client";

import { useState, useCallback, KeyboardEvent, FormEvent } from "react";

type GenerationState = "idle" | "loading" | "done" | "error";

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [siteHtml, setSiteHtml] = useState("");
  const [state, setState] = useState<GenerationState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(
    async (e?: FormEvent) => {
      if (e) e.preventDefault();
      if (!prompt.trim() || state === "loading") return;

      try {
        setState("loading");
        setError(null);

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erreur pendant la génération.");
        }

        const data = await res.json();
        // On s’attend à recevoir { html: "<!DOCTYPE html>..." }
        setSiteHtml(data.html || "");
        setState("done");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Une erreur est survenue.");
        setState("error");
      }
    },
    [prompt, state]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handlePublish = () => {
    if (!siteHtml) return;
    // Version simple : ouvre un onglet de preview avec le site généré
    const blob = new Blob([siteHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main
      className="min-h-screen w-full text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, #3b2a11 0, #050308 55%, #000000 100%)",
      }}
    >
      {/* Bandeau haut */}
      <header className="w-full flex justify-between items-center px-6 md:px-10 py-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#cfa65b]/40">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#cfa65b] to-[#a37727] text-black font-bold text-xs">
              UB
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#f5e2b1]">
              Ultimated Builder IA
            </span>
          </div>
          <span className="hidden md:inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.22em]">
            GPT-5.1
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs opacity-70">
          <span className="h-[1px] w-10 bg-white/30" />
          <span>From the House of Ultimated Studio Officiel</span>
        </div>
      </header>

      {/* Contenu principal */}
      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr,1.2fr] gap-8 md:gap-10 items-stretch">
          {/* Colonne gauche : prompt */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#cfa65b]/40 bg-black/60 text-[11px] uppercase tracking-[0.26em] text-[#f0e0b3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f6d27d]" />
              Outil officiel · Ultimated Studio Officiel · IA créative
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-[2.6rem] leading-tight font-semibold">
                What would you build today,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d48a] via-[#f1c76c] to-[#c28a34]">
                  version Ultimated?
                </span>
              </h1>
              <p className="text-sm md:text-base text-white/80 max-w-xl">
                Décris ton idée de site, d’app ou de boutique. Ultimated Builder
                IA construit pour toi un vrai site prêt à tester : sections,
                textes et structure complète.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div
                className="
                  relative rounded-3xl border border-[#cfa65b]/40
                  bg-gradient-to-br from-black/80 via-black/75 to-[#1c1307]/90
                  shadow-[0_18px_60px_rgba(0,0,0,.75)]
                  overflow-hidden
                "
              >
                <div className="p-[1px] bg-gradient-to-br from-[#f5d48a]/40 via-transparent to-[#8a6020]/60">
                  <div className="rounded-[1.45rem] bg-black/80">
                    <div className="flex">
                      <div className="flex-1 p-5 md:p-6">
                        <label
                          htmlFor="prompt"
                          className="block text-xs uppercase tracking-[0.18em] text-[#f4dfb0]/80 mb-2"
                        >
                          Décris ton projet
                        </label>
                        <textarea
                          id="prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          onKeyDown={handleKeyDown}
                          rows={3}
                          placeholder={`Exemple : "Une landing page luxe pour une marque de vêtements streetwear, avec section héros, liste de produits coup de cœur et formulaire de contact simple."`}
                          className="w-full resize-none bg-transparent text-sm md:text-base outline-none border-none placeholder:text-white/40"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={state === "loading"}
                        className="
                          hidden md:flex items-center justify-center 
                          w-20 bg-gradient-to-b from-[#f6d88c] to-[#b17323]
                          text-black text-xl
                          hover:from-[#ffe4a8] hover:to-[#c78329]
                          disabled:opacity-60 disabled:cursor-not-allowed
                          transition-all duration-200
                        "
                      >
                        {state === "loading" ? (
                          <span className="animate-spin text-sm">⏳</span>
                        ) : (
                          "→"
                        )}
                      </button>
                    </div>

                    {/* Bouton mobile */}
                    <div className="md:hidden border-t border-white/5 flex justify-end px-4 py-3">
                      <button
                        type="submit"
                        disabled={state === "loading"}
                        className="
                          inline-flex items-center justify-center gap-2
                          px-5 py-2.5 rounded-full
                          bg-gradient-to-r from-[#f6d88c] to-[#b17323]
                          text-xs font-semibold text-black
                          disabled:opacity-60 disabled:cursor-not-allowed
                        "
                      >
                        {state === "loading" ? "Génération..." : "Lancer l’IA"}
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions de prompts */}
              <div className="flex flex-wrap gap-2 text-[11px] md:text-xs">
                {[
                  "Boutique en ligne pour une marque de bijoux",
                  "Landing page pour une app mobile de finances",
                  "Site vitrine pour photographe professionnel",
                  "Page de vente pour formation en ligne",
                  "Mini-site pour un restaurant gastronomique",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setPrompt(suggestion)}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#f2d38b]/60 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-xs text-red-300 bg-red-900/30 border border-red-500/40 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <p className="text-[11px] md:text-xs text-white/50">
                Appuie sur <span className="font-semibold">Enter</span> ou sur
                la flèche dorée pour voir l’IA construire ton site en temps
                réel.
              </p>
            </form>
          </div>

          {/* Colonne droite : preview */}
          <div
            className="
              rounded-3xl border border-[#cfa65b]/40
              bg-gradient-to-b from-white/[0.03] via-black/60 to-black/90
              shadow-[0_22px_70px_rgba(0,0,0,.85)]
              overflow-hidden flex flex-col
            "
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/70">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>
                  {state === "loading"
                    ? "Construction du site en cours..."
                    : state === "done"
                    ? "Site généré – aperçu en direct"
                    : "Aperçu du site généré"}
                </span>
              </div>

              <button
                type="button"
                onClick={handlePublish}
                disabled={!siteHtml}
                className="
                  text-[11px] px-3 py-1.5 rounded-full border
                  border-[#f6d88c]/50 bg-black/60
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:bg-[#f6d88c]/10 transition
                "
              >
                Publier & tester
              </button>
            </div>

            <div className="flex-1 bg-black">
              {siteHtml ? (
                <iframe
                  title="Aperçu du site généré"
                  srcDoc={siteHtml}
                  className="w-full h-full border-none"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-sm text-white/60 px-6 text-center">
                  <span className="text-4xl mb-1">✨</span>
                  <p>
                    L’aperçu de ton site apparaîtra ici dès que tu auras lancé
                    une génération.
                  </p>
                  <p className="text-xs text-white/35 max-w-xs">
                    Décris ton projet à gauche, lance l’IA, puis découvre un
                    site complet prêt à affiner et publier.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
