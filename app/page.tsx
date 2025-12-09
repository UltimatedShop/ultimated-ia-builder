"use client";

import { useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState("");

  async function generateSite() {
    if (!input.trim()) return;

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    setGenerated(data.result || "Aucune structure générée.");
  }

  function handleKey(e: any) {
    if (e.key === "Enter") {
      e.preventDefault();
      generateSite();
    }
  }

  const examples = [
    "Site d'entreprise",
    "Restaurant",
    "Portfolio",
    "Blog",
    "Page de vente",
    "E-commerce",
    "Coach / Service",
    "Immobilier",
    "Artiste / Créateur",
    "Mini-app IA",
  ];

  return (
    <main className="ub-page">
      {/* ————————————————————
           HERO SECTION WOW
      ————————————————————— */}
      <section className="ub-hero">
        <div className="ub-hero-badge">Outil officiel · Ultimated Studio Officiel</div>

        <h1 className="ub-hero-title">
          L’IA qui construit des sites comme si tu payais une agence à 5 000$.
        </h1>

        <p className="ub-hero-punchline">
          Tu écris ton idée. Ultimated Builder IA te sort un site complet, structuré, prêt à vendre.
        </p>

        <p className="ub-hero-subtext">
          Vitrine, entreprise, boutique en ligne, restaurant, portfolio, coach, service local,
          blog, événement, projet sur mesure…  
          <span className="ub-hero-highlight">
            Tes concurrents payent des devs. Toi, tu écris une phrase et ton site est prêt.
          </span>
        </p>

        <div className="ub-hero-tags">
          <span className="ub-hero-tag">Design maison de luxe</span>
          <span className="ub-hero-tag">GPT-5.1 intégré</span>
          <span className="ub-hero-tag">Structure complète automatique</span>
        </div>

        <div className="ub-hero-cta-hint">
          Descends un peu, décris ton idée et regarde l’IA travailler.
        </div>
      </section>

      {/* ————————————————————
              INPUT CARD LUXE
      ————————————————————— */}
      <div className="ub-input-card">
        <div className="ub-input-label">ÉTAPE 1 — Décris ton idée</div>

        <textarea
          className="ub-input-area"
          placeholder={`Exemple : "Fais un site professionnel pour mon entreprise de rénovation, avec page services, témoignages, photos et formulaire."`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />

        <button onClick={generateSite} className="ub-input-btn">
          →
        </button>

        <div className="ub-chip-list">
          {examples.map((ex) => (
            <button key={ex} className="ub-chip" onClick={() => setInput(ex)}>
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* ————————————————————
                APERÇU
      ————————————————————— */}
      <section className="ub-preview">
        <h2 className="ub-preview-title">Aperçu généré</h2>
        <p className="ub-preview-hint">
          L’IA génère ici la structure complète. Appuie sur <strong>Enter</strong>.
        </p>

        <div className="ub-preview-box">
          {generated ? (
            <pre>{generated}</pre>
          ) : (
            <p className="ub-preview-placeholder">
              Écris ton idée ci-dessus puis appuie sur Enter.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
