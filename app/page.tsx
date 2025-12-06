"use client";

import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Ici plus tard : appel à ton API GPT-5.1 pour générer l'app / site
    console.log("Prompt envoyé :", prompt);
  }

  function applyIdea(text: string) {
    setPrompt(text);
  }

  return (
    <div className="ub-page">
      {/* NAV BAR */}
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
          <span>GPT-5.1 (API)</span>
          <button className="ub-nav-pill">Mon espace</button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="ub-main-area">
        {/* HERO */}
        <section className="ub-hero">
          <h1 className="ub-hero-title">Qu&apos;est-ce que tu veux créer aujourd&apos;hui ?</h1>
          <p className="ub-hero-subtitle">
            Décris ton idée d&apos;app ou de site, et Ultimated Builder IA te renvoie une
            structure complète, prête à personnaliser.
          </p>
        </section>

        {/* CARTE INPUT */}
        <section className="ub-input-card">
          <form onSubmit={handleSubmit}>
            <div className="ub-input-row">
              <textarea
                className="ub-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décris l’app que tu veux créer… (ex : une plateforme de boutiques e-commerce façon Shopify, mais en version luxe Ultimated)."
              />
              <button type="submit" className="ub-generate-btn">
                →
              </button>
            </div>
            <div className="ub-input-footer">
              <div className="ub-model-pill">GPT-5.1</div>
              <div>
                L&apos;IA va générer : pages, sections, structure et idées de contenu selon
                ta description.
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
                "Un site e-commerce de liquidation pour camions et remorques avec inventaire, filtres et formulaire de financement."
              )
            }
          >
            Site de liquidation
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Une plateforme style Shopify light où les clients créent leur propre boutique Ultimated en quelques clics."
              )
            }
          >
            Plateforme e-commerce SaaS
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Un tableau de bord crypto luxe avec suivi des portefeuilles, graphiques temps réel et alertes IA."
              )
            }
          >
            Dashboard crypto
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Un site studio musical Ultimated Records pour vendre des beats, services de mix/master et packs vocaux IA."
              )
            }
          >
            Studio musical Ultimated
          </button>
        </div>

        {/* APPS RÉCENTES (CARDS STYLE BASE44) */}
        <section className="ub-recent">
          <div className="ub-recent-header">
            <div className="ub-recent-title">Apps récentes</div>
            <div className="ub-recent-sub">
              Exemples d&apos;idées générées avec Ultimated Builder IA.
            </div>
          </div>

          <div className="ub-recent-grid">
            <article className="ub-app-card">
              <div className="ub-app-title">Liquidation Montcalm Auctions</div>
              <div className="ub-app-desc">
                Plateforme d&apos;enchères en ligne pour lots de liquidation, camions et
                équipements, avec pages lots, calendrier et espace acheteurs.
              </div>
              <div className="ub-app-meta">Mis à jour il y a 8 minutes</div>
            </article>

            <article className="ub-app-card">
              <div className="ub-app-title">MotoShop Pro</div>
              <div className="ub-app-desc">
                Concessionnaire virtuel de motos et pièces, fiches détaillées, section
                performance, et prise de rendez-vous en atelier.
              </div>
              <div className="ub-app-meta">Mis à jour il y a 6 heures</div>
            </article>

            <article className="ub-app-card">
              <div className="ub-app-title">Ultimated Chat</div>
              <div className="ub-app-desc">
                Assistant IA personnel aux couleurs Ultimated, capable de conseiller,
                rédiger et générer des idées de boutique en continu.
              </div>
              <div className="ub-app-meta">Mis à jour il y a 17 heures</div>
            </article>

            <article className="ub-app-card">
              <div className="ub-app-title">Ultimated Studio Dashboard</div>
              <div className="ub-app-desc">
                Centre de contrôle pour gérer clients, boutiques, abonnements Stripe et
                statistiques, le tout en version noir et or.
              </div>
              <div className="ub-app-meta">Nouveau</div>
            </article>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="ub-footer">
        <span>From the House of Ultimated Studio Officiel</span>
        <span>Ultimated Builder IA — ta Base44 version luxe, 100% personnalisée</span>
      </footer>
    </div>
  );
}
