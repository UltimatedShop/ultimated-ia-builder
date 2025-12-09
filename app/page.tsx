"use client";

import { useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateSite() {
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Erreur API:", errData);
        setError("Erreur pendant la génération (voir logs Vercel).");
        setGenerated("Aucune structure générée.");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // 🔥 On accepte plusieurs formats de réponse pour ne pas tout casser
      const value =
        data.result ??
        data.config ??
        data.structure ??
        data.html ??
        data.output ??
        data.text ??
        "";

      if (!value) {
        setGenerated("Aucune structure générée.");
      } else {
        setGenerated(String(value));
      }
    } catch (e) {
      console.error("Erreur fetch:", e);
      setError("Erreur réseau ou serveur.");
      setGenerated("Aucune structure générée.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
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
           HERO SECTION — accroche
      ———————————————————— */}
      <section className="ub-hero">
        <div className="ub-hero-badge">
          Outil officiel · Ultimated Studio Officiel
        </div>

        <h1 className="ub-hero-title">
          Transforme une simple phrase en site complet prêt à vendre.
        </h1>

        <p className="ub-hero-punchline">
          Tu expliques ton idée. Ultimated Builder IA te sort une structure de
          site professionnelle comme si tu avais payé une agence à 5&nbsp;000$.
        </p>

        <p className="ub-hero-subtext">
          Vitrine, boutique en ligne, restaurant, portfolio, coach, service
          local, blog, landing page, projet sur mesure…
          <br />
          <span className="ub-hero-highlight">
            Tes clients voient un site propre. Tes concurrents se demandent
            combien tu as payé. Toi, tu as juste utilisé ton Builder IA.
          </span>
        </p>

        <div className="ub-hero-tags">
          <span className="ub-hero-tag">Design maison de luxe</span>
          <span className="ub-hero-tag">GPT-5.1 intégré</span>
          <span className="ub-hero-tag">Structure + sections auto</span>
        </div>

        <div className="ub-hero-cta-hint">
          Écris ton idée juste en dessous, appuie sur <strong>Enter</strong> et
          regarde.
        </div>
      </section>

      {/* ————————————————————
              INPUT CARD LUXE
      ———————————————————— */}
      <section className="ub-input-card">
        <div className="ub-input-label">ÉTAPE 1 — Décris ton idée</div>

        <textarea
          className="ub-input-area"
          placeholder={`Exemple : "Crée un site pour mon service de remorquage 24/7, avec page services, prix, formulaire d’appel d’urgence et avis clients."`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />

        <button onClick={generateSite} className="ub-input-btn">
          {loading ? "…" : "→"}
        </button>

        <div className="ub-chip-list">
          {examples.map((ex) => (
            <button
              key={ex}
              className="ub-chip"
              type="button"
              onClick={() => setInput(ex)}
            >
              {ex}
            </button>
          ))}
        </div>
      </section>

      {/* ————————————————————
                APERÇU
      ———————————————————— */}
      <section className="ub-preview">
        <h2 className="ub-preview-title">Aperçu généré</h2>
        <p className="ub-preview-hint">
          L’IA génère ici la structure complète. Appuie sur{" "}
          <strong>Enter</strong> pour lancer la génération.
        </p>

        {error && (
          <p
            style={{
              color: "#ffb4b4",
              fontSize: "13px",
              marginTop: "8px",
            }}
          >
            {error}
          </p>
        )}

        <div className="ub-preview-box">
          {generated ? (
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
              {generated}
            </pre>
          ) : (
            <p className="ub-preview-placeholder">
              Aucune structure générée pour l’instant.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
