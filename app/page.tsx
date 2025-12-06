"use client";

import { useState, KeyboardEvent, FormEvent } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");

  function handleGenerate() {
    if (!prompt.trim()) return;
    // Ici plus tard : appel à ton API GPT-5.1 pour générer le site
    console.log("Prompt envoyé :", prompt);
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
      {/* NAV BAR LV */}
      <header className="ub-top-nav">
        <div className="ub-nav-left">
          <div className="ub-nav-logo-circle">
            <span>UB</span>
          </div>
          <div className="ub-nav-brand">Ultimated Builder IA</div>
          <nav className="ub-nav-links">
            <span className="ub-nav-link">Apps</span>
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

      {/* CONTENU PRINCIPAL LV */}
      <main className="ub-main-area">
        {/* HERO */}
        <section className="ub-hero">
          <h1 className="ub-hero-title">
            Qu&apos;est-ce que tu veux créer aujourd&apos;hui ?
          </h1>
          <p className="ub-hero-subtitle">
            Décris ton idée de site ou de plateforme, et Ultimated Builder IA
            te renvoie une structure complète, version{" "}
            <strong>Ultimated Studio Officiel</strong> (luxe, noir & or).
          </p>
        </section>

        {/* CARTE PROMPT LV */}
        <section className="ub-input-card">
          <form onSubmit={handleSubmit}>
            <div className="ub-input-row">
              <textarea
                className="ub-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  "Décris l’app ou le site à créer…\n(Enter = générer, Shift + Enter = nouvelle ligne)"
                }
              />
              <button type="submit" className="ub-generate-btn">
                →
              </button>
            </div>
            <div className="ub-input-footer">
              <div className="ub-model-pill">GPT-5.1 · Ultimated</div>
              <div>
                L&apos;IA construit : pages, sections, structure, comme notre
                plateforme style Shopify mais en version builder IA.
              </div>
            </div>
          </form>
        </section>

        {/* CHIPS D’IDÉES (pré-remplissent le prompt) */}
        <div className="ub-chip-row">
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Une plateforme style Shopify Ultimated Shop où les clients créent leur propre boutique luxe (noir et or), avec abonnements et dashboard."
              )
            }
          >
            Plateforme Ultimated Shop
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Un site de liquidation pour camions et remorques avec inventaire, filtres avancés et formulaire de financement."
              )
            }
          >
            Liquidation camions
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Un dashboard crypto luxe avec suivi de portefeuilles, graphiques temps réel et alertes IA."
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

        {/* APPS RÉCENTES LV */}
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
      </main>

      {/* FOOTER */}
      <footer className="ub-footer">
        <span>From the House of Ultimated Studio Officiel</span>
        <span>
          Ultimated Builder IA — ton builder de sites luxe, inspiré de ta
          plateforme Shopify Ultimated.
        </span>
      </footer>
    </div>
  );
}
