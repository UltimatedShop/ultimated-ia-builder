"use client";

import React, { useState } from "react";

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
  const [previewLoading, setPreviewLoading] = useState(false);

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
        const s = slugify(input);
        setSlug(s);
        setPreviewLoading(true); // 👉 on affiche le loader de preview
        setHtml(String(content));
        setStep(2); // passe au mode dashboard
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

  // ouvre le site en plein écran (utilisé aussi par "Publier")
  function openFullPage() {
    if (!html) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  function handlePublish() {
    if (!slug) return;
    setPublishing(true);

    // plus tard : appel API pour sauvegarder en DB + sous-domaine réel
    setTimeout(() => {
      setPublishing(false);
      // on simule le sous-domaine ET on ouvre le site pour test
      openFullPage();
      alert(
        `Ton site est prêt à être publié sur : https://${slug}.ultimatedbuilder.app (quand ton wildcard Vercel sera configuré).`
      );
    }, 700);
  }

  const examples = [
    "Plateforme de towing 24/7",
    "Restaurant haut de gamme",
    "Portfolio de photographe",
    "Coach business en ligne",
    "Page de vente pour une formation",
    "Mini-app IA pour agenda",
  ];

  const subdomainUrl = slug
    ? `https://${slug}.ultimatedbuilder.app`
    : "Sous-domaine en attente";

  return (
    <main className="ub-page">
      {/* ————— ÉCRAN 1 : landing style Base44, mais LV ————— */}
      {step === 1 && (
        <section className="ub-landing">
          <div className="ub-landing-inner">
            <div className="ub-landing-badge">
              Outil officiel · Ultimated Studio Officiel · GPT-5.1
            </div>

            <h1 className="ub-landing-title">
              What would you build today,<br />
              version Ultimated&nbsp;?
            </h1>

            <p className="ub-landing-sub">
              Décris ton idée d’app, de site ou de boutique. Ultimated Builder IA
              te renvoie un vrai site prêt à tester&nbsp;: sections, textes,
              structure complète.
            </p>

            <div className="ub-landing-card">
              <textarea
                className="ub-landing-textarea"
                placeholder={`Exemple : "Une app pour les remorquages style Towsoft : tableau de bord pour dispatch, suivi des camions, facture en ligne et portail client."`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
              />

              <button
                onClick={generateSite}
                className="ub-landing-btn"
                type="button"
              >
                {loading ? <span className="ub-loader" /> : "→"}
              </button>
            </div>

            <div className="ub-landing-chips">
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

            {error && <p className="ub-error-msg">{error}</p>}

            <p className="ub-landing-hint">
              Appuie sur <strong>Enter</strong> ou sur la flèche dorée pour voir
              l’IA construire ton site, comme sur Base44 mais en version Ultimated.
            </p>
          </div>
        </section>
      )}

      {/* ————— ÉCRAN 2 : dashboard / preview comme Base44 ————— */}
      {step === 2 && (
        <section className="ub-dashboard">
          {/* Colonne gauche : “chat / log” */}
          <div className="ub-dashboard-left">
            <h2 className="ub-dash-title">Session Ultimated Builder</h2>
            <p className="ub-dash-sub">
              Historique rapide de cette génération. Tu peux relancer une autre
              idée quand tu veux.
            </p>

            <div className="ub-chat-log">
              <div className="ub-chat-item user">
                <div className="ub-chat-label">Toi</div>
                <div className="ub-chat-bubble">{input}</div>
              </div>

              <div className="ub-chat-item ia">
                <div className="ub-chat-label">Ultimated Builder IA</div>
                <div className="ub-chat-bubble">
                  J’analyse ton idée, je construis une page complète (hero,
                  sections, CTA) et j’envoie le résultat à la preview à droite.
                </div>
              </div>

              <div className="ub-chat-steps">
                <div className="ub-step-pill">Analyse du besoin</div>
                <div className="ub-step-pill">Structure du site</div>
                <div className="ub-step-pill">Mise en page HTML</div>
                <div className="ub-step-pill">Preview interactive</div>
              </div>
            </div>

            <button
              type="button"
              className="ub-back-btn"
              onClick={() => {
                setStep(1);
                setHtml(null);
                setError(null);
              }}
            >
              ← Revenir à l’écran d’idée
            </button>
          </div>

          {/* Colonne droite : grosse preview + loader */}
          <div className="ub-dashboard-right">
            <div className="ub-dash-right-header">
              <h2 className="ub-dash-title">Preview en direct</h2>
              <p className="ub-dash-sub">
                À droite, tu vois exactement ce que ton client verra. Tu peux
                l’ouvrir en plein écran ou le publier sur un sous-domaine
                Ultimated.
              </p>
            </div>

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
                  <>
                    <iframe
                      className="ub-live-site"
                      srcDoc={html}
                      sandbox="allow-same-origin allow-forms allow-scripts"
                      title="Preview site généré"
                      onLoad={() => setPreviewLoading(false)} // 👉 cache le loader dès que le site est prêt
                    />
                    {previewLoading && (
                      <div className="ub-preview-overlay">
                        <div className="ub-big-loader" />
                        <p>Loading the preview…</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="ub-preview-placeholder">
                    Aucun HTML généré pour l’instant.
                  </p>
                )}
              </div>
            </div>

            <div className="ub-studio-actions">
              <button
                className="ub-fullscreen-btn"
                type="button"
                onClick={openFullPage}
                disabled={!html}
              >
                Ouvrir le site en plein écran
              </button>

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
            </div>

            <p className="ub-subdomain-hint">
              Sous-domaine prévu :{" "}
              <span className="ub-subdomain-link">{subdomainUrl}</span>
              <br />
              (Quand ton wildcard Vercel sera prêt, tu pourras ouvrir ce lien
              et tester ton site comme un vrai projet.)
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
