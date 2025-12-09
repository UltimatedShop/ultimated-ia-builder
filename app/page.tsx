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

        // garde le HTML pour la page /preview
        if (typeof window !== "undefined") {
          window.localStorage.setItem("ub-last-site-html", data.html);
        }
      } else {
        const fallback = JSON.stringify(data, null, 2);
        setPreview(
          `<pre style="white-space:pre-wrap;font-size:13px;">${fallback}</pre>`
        );
        if (typeof window !== "undefined") {
          window.localStorage.setItem("ub-last-site-html", fallback);
        }
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
      // Enter simple → générer
      e.preventDefault();
      handleGenerate();
    }
  }

  function applyIdea(text: string) {
    setPrompt(text);
  }

  function openFullPreview() {
    if (typeof window !== "undefined") {
      window.open("/preview", "_blank");
    }
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
            Qu&apos;est-ce que tu veux construire aujourd&apos;hui ?
          </h1>
          <p className="ub-hero-subtitle">
            Décris ton idée de site et Ultimated Builder IA crée une structure
            complète (pages, sections, contenu de base) adaptée à ton projet,
            ton audience et ton branding.
          </p>
        </section>

        {/* CARTE OR — PROMPT */}
        <section className="ub-input-card">
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(94, 62, 22, 0.95)",
              }}
            >
              Étape 1 · Décris ton projet
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#3b260c",
                marginTop: 4,
              }}
            >
              L&apos;IA s&apos;adapte à ton style, tes couleurs, ta niche
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="ub-input-row">
              <textarea
                className="ub-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  "Exemples :\n• Boutique en ligne pour vêtements avec page d’accueil, catalogue, panier et page À propos.\n• Site pour un garage mécanique avec services, section rendez-vous et témoignages.\n• Portfolio pour photographe avec galeries, bio et formulaire de contact.\n\nEnter = générer · Shift + Enter = nouvelle ligne."
                }
              />
              <button type="submit" className="ub-generate-btn">
                {loading ? "…" : "→"}
              </button>
            </div>
            <div className="ub-input-footer">
              <div className="ub-model-pill">GPT-5.1 · Générateur de sites</div>
              <div>
                Tu expliques ce que tu veux, l&apos;IA propose une structure de
                site prête à personnaliser (textes, sections, blocs).
              </div>
            </div>
          </form>
        </section>

        {/* CHIPS D’IDÉES (génériques, pas de marque perso) */}
        <div className="ub-chip-row">
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Boutique en ligne pour vêtements et accessoires, avec page d'accueil, catalogue de produits, panier et page À propos."
              )
            }
          >
            Boutique en ligne
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Site vitrine pour garage mécanique : présentation du garage, liste des services, section rendez-vous et zone avis clients."
              )
            }
          >
            Garage / services
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Site pour restaurant avec menu, réservation en ligne, horaires, photos et section avis."
              )
            }
          >
            Restaurant & réservations
          </button>
          <button
            className="ub-chip"
            onClick={() =>
              applyIdea(
                "Portfolio pour créatif (designer, photographe, artiste) avec projets, biographie, tarifs et formulaire de contact."
              )
            }
          >
            Portfolio créatif
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
                Décris ton projet dans la carte or ci-dessus puis appuie sur{" "}
                <b>Enter</b> (ou sur la flèche). La structure du site généré
                apparaîtra ici au format HTML.
              </p>
            )}
            {preview && (
              <div
                dangerouslySetInnerHTML={{ __html: preview }}
                style={{ fontSize: 13 }}
              />
            )}
          </div>

          {/* Bouton pour ouvrir le site en page séparée */}
          {preview && (
            <div className="ub-preview-actions">
              <button
                type="button"
                className="ub-open-preview-btn"
                onClick={openFullPreview}
              >
                Ouvrir le site généré dans un nouvel onglet
              </button>
            </div>
          )}
        </section>

        {/* APPS RÉCENTES — exemples génériques */}
        <section className="ub-recent">
          <div className="ub-recent-header">
            <div className="ub-recent-title">Exemples d&apos;apps générées</div>
            <div className="ub-recent-sub">
              Idées de projets que des utilisateurs pourraient créer avec le
              builder.
            </div>
          </div>

          <div className="ub-recent-grid">
            <article className="ub-app-card">
              <div className="ub-app-title">Boutique Mode Urbain</div>
              <div className="ub-app-desc">
                Site e-commerce pour vêtements streetwear avec lookbook,
                fiches produits détaillées et section nouveautés.
              </div>
              <div className="ub-app-meta">Idée type · e-commerce</div>
            </article>

            <article className="ub-app-card">
              <div className="ub-app-title">Atelier Mécanique Pro</div>
              <div className="ub-app-desc">
                Site de services avec liste de réparations, prise de
                rendez-vous et zone conseils pour les clients.
              </div>
              <div className="ub-app-meta">Idée type · services locaux</div>
            </article>

            <article className="ub-app-card">
              <div className="ub-app-title">Studio Photo Lumière</div>
              <div className="ub-app-desc">
                Portfolio photo avec galeries thématiques, tarifs et formulaire
                de réservation de séance.
              </div>
              <div className="ub-app-meta">Idée type · portfolio</div>
            </article>

            <article className="ub-app-card">
              <div className="ub-app-title">Coach en ligne Momentum</div>
              <div className="ub-app-desc">
                Page de vente pour coach avec présentation de l&apos;offre,
                témoignages, FAQ et bouton d&apos;inscription.
              </div>
              <div className="ub-app-meta">Idée type · landing page</div>
            </article>
          </div>
        </section>

        {/* SUPPORT IA ULTIMATED (texte neutre) */}
        <section className="ub-support">
          <div className="ub-support-card">
            <div className="ub-support-text">
              <div className="ub-support-title">Support IA intégré</div>
              <div>
                Tu ne sais pas comment formuler ton idée ou quelles sections
                ajouter ? Le support IA peut t&apos;aider à trouver la meilleure
                structure pour ton type de projet.
              </div>
            </div>
            <button className="ub-support-btn">
              Ouvrir le support IA
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER (tu peux le garder ou le changer) */}
      <footer className="ub-footer">
        <span>From the House of Ultimated Studio Officiel</span>
        <span>Ultimated Builder IA — Générateur de sites assisté par IA.</span>
      </footer>
    </div>
  );
}
