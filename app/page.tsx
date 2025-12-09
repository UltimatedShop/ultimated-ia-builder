"use client";

import { useState } from "react";

type Step = 1 | 2;

function slugify(raw: string): string {
  return (
    raw
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "mon-site"
  );
}

export default function HomePage() {
  const [input, setInput] = useState("");
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<Step>(1);
  const [slug, setSlug] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  async function generateSite() {
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Erreur API:", errData);
        setError("Erreur pendant la génération (voir logs Vercel).");
        setHtml(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const content =
        data.html ??
        data.result ??
        data.output ??
        data.text ??
        "";

      if (!content) {
        setHtml(null);
        setError("Aucune page générée.");
      } else {
        setHtml(String(content));
        const s = slugify(input);
        setSlug(s);
        setStep(2);
      }
    } catch (e) {
      console.error("Erreur fetch:", e);
      setError("Erreur réseau ou serveur.");
      setHtml(null);
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

  function handlePublish() {
    if (!slug) return;
    setPublishing(true);

    // Ici tu enregistreras plus tard le site + slug en DB
    setTimeout(() => {
      setPublishing(false);
      alert(
        `Ton site sera disponible sur : https://${slug}.ultimatedbuilder.app (quand le système de sous-domaines sera branché).`
      );
    }, 900);
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

  const subdomainUrl = slug
    ? `https://${slug}.ultimatedbuilder.app`
    : "Sous-domaine en attente";

  return (
    <main className="ub-page">
      {/* HERO */}
      <section className="ub-hero">
        <div className="ub-hero-badge">
          Outil officiel · Ultimated Studio Officiel
        </div>

        <h1 className="ub-hero-title">
          Transforme une phrase en vrai site, prêt à tester.
        </h1>

        <p className="ub-hero-punchline">
          Tu écris ton idée. Ultimated Builder IA génère une page complète :
          sections, textes, mise en page. Tu n’as plus qu’à tester et publier.
        </p>

        <p className="ub-hero-subtext">
          Vitrine, boutique en ligne, restaurant, portfolio, coach, service
          local, landing page, app SaaS…
          <br />
          <span className="ub-hero-highlight">
            Ton client croit que tu as payé une équipe de dev. En vrai, tu as
            juste écrit une phrase ici.
          </span>
        </p>

        <div className="ub-hero-tags">
          <span className="ub-hero-tag">Design maison de luxe autour</span>
          <span className="ub-hero-tag">Page générée en temps réel</span>
          <span className="ub-hero-tag">Sous-domaine Ultimated à la demande</span>
        </div>

        <div className="ub-hero-cta-hint">
          Écris ton idée ci-dessous, appuie sur <strong>Enter</strong> et
          regarde la page se construire.
        </div>
      </section>

      {/* STEP 1 : IDÉE */}
      {step === 1 && (
        <>
          <section className="ub-input-card">
            <div className="ub-input-label">ÉTAPE 1 — Décris ton idée</div>

            <textarea
              className="ub-input-area"
              placeholder={`Exemple : "Crée un site pour mon service de remorquage 24/7, avec page services, tarifs, avis clients et formulaire d’appel d’urgence."`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />

            <button onClick={generateSite} className="ub-input-btn">
              {loading ? <span className="ub-loader" /> : "→"}
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

          <section className="ub-preview">
            <h2 className="ub-preview-title">Aperçu brut</h2>
            <p className="ub-preview-hint">
              Ici tu verras bientôt la structure brute du site. Pour l’instant,
              passe surtout en mode STUDIO après la génération.
            </p>

            {error && <p className="ub-error-msg">{error}</p>}

            <div className="ub-preview-box">
              {!html ? (
                <p className="ub-preview-placeholder">
                  Aucune structure générée pour l’instant.
                </p>
              ) : (
                <p className="ub-preview-placeholder">
                  Une page a déjà été générée. Clique sur “Générer” à nouveau
                  pour passer en mode studio.
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {/* STEP 2 : STUDIO AVEC VRAI SITE */}
      {step === 2 && (
        <section className="ub-studio">
          <div className="ub-studio-left">
            <h2 className="ub-studio-title">Studio Ultimated — Construction</h2>
            <p className="ub-studio-sub">
              L’IA vient de construire une vraie page HTML basée sur ton idée.
              Tu peux la prévisualiser à droite.
            </p>

            <ol className="ub-studio-steps">
              <li>Analyse de ton idée (secteur, besoins, audience).</li>
              <li>Génération d’un hero avec accroche et bouton principal.</li>
              <li>Création de plusieurs sections (services, à propos, etc.).</li>
              <li>Ajout d’un appel à l’action final.</li>
            </ol>

            <div className="ub-studio-structure">
              <h3>Résumé</h3>
              <p style={{ fontSize: 14, color: "#f3e0be" }}>
                Ce site est généré dynamiquement à partir de ton texte. La
                version finale pourra être personnalisée, traduite, et reliée à
                ton propre domaine.
              </p>
            </div>
          </div>

          <div className="ub-studio-right">
            <h2 className="ub-studio-title">Preview du site généré</h2>
            <p className="ub-studio-sub">
              Ci-dessous : un rendu direct du HTML généré par l’IA. Tu peux
              scroller dans la fenêtre.
            </p>

            <div className="ub-studio-preview-card">
              <div className="ub-studio-preview-header">
                <div className="ub-dot red" />
                <div className="ub-dot yellow" />
                <div className="ub-dot green" />
                <span className="ub-studio-preview-url">
                  {slug ? `${slug}.ultimatedbuilder.app` : "sous-domaine à venir"}
                </span>
              </div>

              <div className="ub-live-site-shell">
                {html ? (
                  <iframe
                    className="ub-live-site"
                    srcDoc={html}
                    sandbox="allow-same-origin allow-forms allow-scripts"
                    title="Preview site généré"
                  />
                ) : (
                  <p className="ub-preview-placeholder">
                    Aucun HTML généré pour l’instant.
                  </p>
                )}
              </div>
            </div>

            <button
              className="ub-publish-btn"
              type="button"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing
                ? "Publication..."
                : "Publier le site sur un sous-domaine Ultimated"}
            </button>

            <p className="ub-subdomain-hint">
              Sous-domaine prévu :{" "}
              <span className="ub-subdomain-link">{subdomainUrl}</span>
              <br />
              (Quand ton wildcard Vercel sera prêt, tu pourras ouvrir ce lien
              et tester le site comme un vrai.)
            </p>

            <button
              type="button"
              className="ub-back-btn"
              onClick={() => setStep(1)}
            >
              ← Revenir à l’éditeur d’idée
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
