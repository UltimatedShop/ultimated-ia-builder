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

        // stocke le HTML pour /preview
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
          <div className="ub-nav-logo-circle"><span>UB</span></div>
          <div className="ub-nav-brand">Ultimated Builder IA</div>
          <nav className="ub-nav-links">
            <span className="ub-nav-link">Fonctionnalités</span>
            <span className="ub-nav-link">Templates</span>
            <span className="ub-nav-link">Intégrations</span>
            <span className="ub-nav-link">Support</span>
          </nav>
        </div>
        <div className="ub-nav-right">
          <span>GPT-5.1</span>
          <button className="ub-nav-pill">Mon espace</button>
        </div>
      </header>


      {/* CONTENU */}
      <main className="ub-main-area">

        {/* HERO */}
        <section className="ub-hero">
          <h1 className="ub-hero-title">
            Crée n’importe quel site en quelques secondes.
          </h1>
          <p className="ub-hero-subtitle">
            Vitrine, entreprise, e-commerce, restaurant, portfolio, blog, landing page,
            événement, coach, artiste, service local, CV interactif, mini-app…  
            Tu décris. L’IA construit.
          </p>
        </section>


        {/* CARTE OR — INPUT */}
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
              Étape 1 · Décris ton idée
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#3b260c",
                marginTop: 4,
              }}
            >
              L’IA génère un site adapté à TON style, TON domaine et TA vision.
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
`Exemples :
• Site professionnel pour entreprise (accueil, services, contact).
• Landing page pour une offre, formation ou événement.
• Portfolio pour photographe, artiste, designer ou créateur.
• Site restaurant : menu, photos, réservation, avis.
• Blog ou plateforme de contenu.
• Page de vente haute conversion.
• CV interactif moderne.
• Mini-application web simple.

Enter = générer · Shift + Enter = nouvelle ligne.`
                }
              />
              <button type="submit" className="ub-generate-btn">
                {loading ? "…" : "→"}
              </button>
            </div>

            <div className="ub-input-footer">
              <div className="ub-model-pill">GPT-5.1 · Générateur universel</div>
              <div>
                Décris ton projet. L’IA crée une structure complète : sections,
                contenu suggéré et organisation optimale.
              </div>
            </div>
          </form>
        </section>


        {/* CHIPS D’IDÉES — version PRO */}
        <div className="ub-chip-row">
          <button className="ub-chip" onClick={() => applyIdea(
            "Site professionnel pour entreprise : accueil, services, équipe, témoignages et contact."
          )}>Site d’entreprise</button>

          <button className="ub-chip" onClick={() => applyIdea(
            "Landing page moderne pour une offre ou événement avec sections conversion."
          )}>Landing page</button>

          <button className="ub-chip" onClick={() => applyIdea(
            "Portfolio pour créatif avec galeries, biographie, tarifs et formulaire."
          )}>Portfolio</button>

          <button className="ub-chip" onClick={() => applyIdea(
            "Site restaurant : menu interactif, réservations, horaires et avis."
          )}>Restaurant</button>

          <button className="ub-chip" onClick={() => applyIdea(
            "Blog ou plateforme de contenu organisée avec catégories et articles."
          )}>Blog</button>

          <button className="ub-chip" onClick={() => applyIdea(
            "Page de vente complète avec sections bénéfices, preuves sociales et CTA."
          )}>Page de vente</button>
        </div>


        {/* PREVIEW */}
        <section className="ub-preview-section">
          <h2 className="ub-preview-title">Aperçu généré</h2>

          <div className="ub-preview-box">
            {errorMsg && (
              <p style={{ color: "#f97373", marginBottom: 8 }}>{errorMsg}</p>
            )}

            {!preview && !errorMsg && (
              <p style={{ fontSize: 13, color: "#9ca3af" }}>
                Écris ton idée ci-dessus puis appuie sur <b>Enter</b>.
                La structure du site généré apparaîtra ici.
              </p>
            )}

            {preview && (
              <div
                dangerouslySetInnerHTML={{ __html: preview }}
                style={{ fontSize: 13 }}
              />
            )}
          </div>

          {/* BOUTON OUVRIR EN PLEIN ÉCRAN */}
          {preview && (
            <div className="ub-preview-actions">
              <button
                type="button"
                className="ub-open-preview-btn"
                onClick={openFullPreview}
              >
                Ouvrir en page séparée
              </button>
            </div>
          )}
        </section>


        {/* SUPPORT */}
        <section className="ub-support">
          <div className="ub-support-card">
            <div className="ub-support-text">
              <div className="ub-support-title">Besoin d’aide ?</div>
              <div>
                Le support IA peut t’aider à formuler tes idées, choisir le bon type
                de site ou optimiser ta structure avant la création finale.
              </div>
            </div>
            <button className="ub-support-btn">Support IA</button>
          </div>
        </section>

      </main>


      {/* FOOTER */}
      <footer className="ub-footer">
        <span>From the House of Ultimated Studio Officiel</span>
        <span>Ultimated Builder IA — Crée sans limite.</span>
      </footer>

    </div>
  );
}
