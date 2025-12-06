"use client";

import { useState, FormEvent, KeyboardEvent } from "react";

type GenerateResponse = {
  html?: string;
  error?: string;
  [key: string]: any;
};

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de la génération.");
      }

      const data: GenerateResponse = await res.json();

      if (data.error) {
        setErrorMsg(data.error);
        setPreview("");
      } else if (typeof data.html === "string") {
        setPreview(data.html);
      } else {
        // fallback : on affiche le JSON formaté
        setPreview(
          `<pre style="white-space:pre-wrap;font-size:13px;">${JSON.stringify(
            data,
            null,
            2
          )}</pre>`
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur inconnue.");
      setPreview("");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleGenerate();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      // Enter simple → génère le site
      e.preventDefault();
      handleGenerate();
    }
  }

  function applyIdea(text: string) {
    setPrompt(text);
  }

  return (
    <div className="ub-page">
      {/* NAVBAR */}
      <header className="ub-top-nav">
        <div className="ub-nav-left">
          <div className="ub-nav-logo-circle">
            <span>UB</span>
          </div>
          <div className="ub-nav-brand">Ultimated Builder IA</div>
          <nav className="ub-nav-links">
            <span className="ub-nav-link">Applications</span>
            <span className="ub-nav-link">Intégrations</span>
            <span className="ub-nav-link">Templates</span>
            <span className="ub-nav-link">Support</span>
          </nav>
        </div>
        <div className="ub-nav-right">
          <span>GPT-5.1</span>
          <button className="ub-nav-pill">Mon espace</button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="ub-main-area">
        {/* HERO */}
        <section className="ub-hero">
          <h1 className="ub-hero-title">
            Qu&apos;est-ce que tu veux créer aujourd&apos;hui ?
          </h1>
          <p className="ub-hero-subtitle">
            Décris ton idée de site ou de plateforme, et Ultimated Builder IA
            te renvoie une structure complète, dans l&apos;esthétique
            Ultimated Studio Officiel (noir & or).
          </p>
        </section>

        {/* CARTE PROMPT (ENTER = GÉNÈRE) */}
        <section className="ub-input-card">
          <form onSubmit={handleSubmit}>
            <div className="ub-input-row">
              <textarea
                className="ub-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  "Décris l’app ou le site à créer…\nEnter = générer, Shift + Enter = nouvelle ligne."
                }
              />
              <button type="submit" className="ub-generate-btn">
                {loading ? "…" : "→"}
              </button>
            </div>
            <div className="ub-input-footer">
              <div className="ub-model-pill">GPT-5.1 · Ultimated</div>
              <div>
                L&apos;IA construit les sections de ton site, comme une
                plateforme clé en main, mais aux couleurs Ultimated.
              </div>
            </div>
          </form>
        </section>

        {/* CHIPS D’IDÉES */}
        <div className="ub-chip-row">
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Une plateforme de boutiques en ligne Ultimated où les clients créent leur propre boutique luxe (noir et or) avec abonnements et dashboard."
              )
            }
          >
            Plateforme Ultimated Shop
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Un site de liquidation pour camions et remorques avec inventaire, filtres avancés, photos et formulaire de financement."
              )
            }
          >
            Liquidation camions
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Un dashboard crypto luxe avec suivi de portefeuilles, graphiques temps réel et alertes IA personnalisées."
              )
            }
          >
            Dashboard crypto
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Un site studio musical Ultimated Records pour vendre des beats, packs vocaux IA et services de mix/master."
              )
            }
          >
            Studio musical Ultimated
          </button>
        </div>

        {/* PREVIEW DU SITE GÉNÉRÉ */}
        <section className="ub-preview-section">
          <h2 className="ub-preview-title">Preview du site généré</h2>
          <div className="ub-preview-box">
            {errorMsg && (
              <p style={{ color: "#f97373", marginBottom: 8 }}>{errorMsg}</p>
            )}
            {!preview && !errorMsg && (
              <p style={{ fontSize: 13, color: "#9ca3af" }}>
                Écris ton idée de site ci-dessus puis appuie sur <b>Enter</b> ou
                sur la flèche pour générer une preview. Le rendu s&apos;affiche
                ici.
              </p>
            )}
            {preview && (
              <div
                dangerouslySetInnerHTML={{ __html: preview }}
                style={{ fontSize: 13 }}
              />
            )}
          </div>
        </section>

        {/* APPS RÉCENTES */}
        <section className="ub-recent">
          <div className="ub-recent-header">
            <div className="ub-recent-title">Apps récentes</div>
            <div className="ub-recent-sub">
              Exemples d&apos;idées construites avec Ultimated Builder IA.
            </div>
          </div>

          <div className="ub-recent-grid">
            <article className="ub-app-card">
              <div className="ub-app-title">Liquidation Montcalm Auctions</div>
              <div className="ub-app-desc">
                Plateforme d&apos;enchères en ligne pour lots de liquidation,
                camions et équipements, avec pages lots, calendrier et espace
                acheteurs.
              </div>
              <div className="ub-app-meta">Mis à jour il y a 8 minutes</div>
            </article>

            <article className="ub-app-card">
              <div className="ub-app-title">MotoShop Pro</div>
              <div className="ub-app-desc">
                Concessionnaire virtuel de motos et pièces, fiches détaillées,
                section performance et prise de rendez-vous en atelier.
              </div>
              <div className="ub-app-meta">Mis à jour il y a 6 heures</div>
            </article>

            <article className="ub-app-card">
              <div className="ub-app-title">Ultimated Chat</div>
              <div className="ub-app-desc">
                Assistant IA personnel aux couleurs Ultimated, capable de
                conseiller, rédiger et générer des idées de boutique en continu.
              </div>
              <div className="ub-app-meta">Mis à jour il y a 17 heures</div>
            </article>

            <article className="ub-app-card">
              <div className="ub-app-title">Ultimated Studio Dashboard</div>
              <div className="ub-app-desc">
                Centre de contrôle pour gérer clients, boutiques, abonnements
                Stripe et statistiques, le tout en noir & or.
              </div>
              <div className="ub-app-meta">Nouveau</div>
            </article>
          </div>
        </section>

        {/* SUPPORT IA ULTIMATED */}
        <section className="ub-support">
          <div className="ub-support-card">
            <div className="ub-support-text">
              <div className="ub-support-title">Support IA Ultimated</div>
              <div>
                Besoin d&apos;aide pour une idée de site, une intégration ou un
                bug ? Notre support IA t&apos;accompagne pour optimiser ton
                builder et tes boutiques.
              </div>
            </div>
            <button className="ub-support-btn">
              Ouvrir le support IA
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="ub-footer">
        <span>From the House of Ultimated Studio Officiel</span>
        <span>Ultimated Builder IA — Outil interne, version noir & or.</span>
      </footer>
    </div>
  );
}
