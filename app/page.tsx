"use client";

import { useState } from "react";
import GeneratedSitePreview from "./components/GeneratedSitePreview";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);

  async function generateSite() {
    if (!idea.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt: idea }),
      });

      const data = await res.json();
      setGenerated(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <main className="ub-page">

      {/* ————————— HERO ————————— */}
      <section className="ub-hero">
        <h1 className="ub-hero-title">Ultimated Builder IA</h1>
        <p className="ub-hero-welcome">
          Bienvenue dans l’outil officiel signé Ultimated Studio Officiel.
        </p>

        <p className="ub-hero-tagline">
          Décrivez votre idée. L’IA génère une structure de site complète.
        </p>

        <p className="ub-hero-subtext">
          Vitrine, entreprise, e-commerce, restaurant, portfolio, blog, landing page, services,
          coach, artiste, événement…  
          <span className="ub-hero-highlight">Vous imaginez. Nous construisons.</span>
        </p>
      </section>

      {/* ————————— INPUT CARD ————————— */}
      <section className="ub-input-card">
        <div className="ub-input-header">ÉTAPE 1 — Décris ton idée</div>

        <div className="ub-input-box">
          <textarea
            className="ub-textarea"
            placeholder="Exemple : « Fais un site professionnel pour mon entreprise de rénovation,
            avec page services, témoignages, photos et formulaire de contact. »"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? generateSite() : null}
          ></textarea>

          <button className="ub-generate-btn" onClick={generateSite}>
            {loading ? "Génération..." : "→"}
          </button>
        </div>

        <div className="ub-chip-row">
          <span className="ub-chip">Site d’entreprise</span>
          <span className="ub-chip">Restaurant</span>
          <span className="ub-chip">Portfolio</span>
          <span className="ub-chip">Blog</span>
          <span className="ub-chip">Page de vente</span>
        </div>
      </section>

      {/* ————————— PREVIEW ————————— */}
      <section className="ub-preview">
        <h2 className="ub-preview-title">Aperçu généré</h2>

        {!generated && (
          <p className="ub-preview-placeholder">
            Écris ton idée au-dessus puis appuie sur Enter.  
            L’aperçu de la structure générée apparaîtra ici.
          </p>
        )}

        {generated && <GeneratedSitePreview config={generated} />}
      </section>

    </main>
  );
}
