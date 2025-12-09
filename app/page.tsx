"use client";

import { useState, useCallback, KeyboardEvent, FormEvent } from "react";

type GenerationState = "idle" | "loading" | "done" | "error";

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [siteHtml, setSiteHtml] = useState("");
  const [state, setState] = useState<GenerationState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(
    async (e?: FormEvent) => {
      if (e) e.preventDefault();
      if (!prompt.trim() || state === "loading") return;

      try {
        setState("loading");
        setError(null);

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erreur pendant la génération.");
        }

        const data = await res.json();
        setSiteHtml(data.html || "");
        setState("done");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Une erreur est survenue.");
        setState("error");
      }
    },
    [prompt, state]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handlePublish = () => {
    if (!siteHtml) return;
    const blob = new Blob([siteHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Styles LV noir & or
  const mainStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    color: "#fdfaf4",
    backgroundImage:
      "radial-gradient(circle at top, #3c2810 0, #050308 55%, #000000 100%)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, system-ui, -apple-system, Segoe UI, sans-serif",
  };

  const maxWidth: React.CSSProperties = {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "32px 20px 32px 20px",
  };

  const goldGradient = "linear-gradient(135deg,#f6ddb0,#f0c878,#b9832e)";
  const goldBorder = "1px solid rgba(207,166,91,0.7)";

  return (
    <main style={mainStyle}>
      {/* Header */}
      <header
        style={{
          ...maxWidth,
          paddingBottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              border: goldBorder,
              background: "rgba(0,0,0,0.7)",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "999px",
                backgroundImage: goldGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1a1307",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: 0.5,
              }}
            >
              UB
            </div>
            <span
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.24em",
                fontSize: 10,
                color: "#f4dfb0",
              }}
            >
              Ultimated Builder IA
            </span>
          </div>

          <div
            style={{
              padding: "4px 9px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            GPT-5.1
          </div>
        </div>

        <div
          style={{
            display: "none",
          }}
        >
          {/* réservé si tu veux rajouter un bouton plus tard */}
        </div>
      </header>

      {/* Main */}
      <section style={maxWidth}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {/* Colonne gauche – prompt */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid rgba(244,223,176,0.7)",
                background: "rgba(12,8,3,0.9)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.26em",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "#f6d88c",
                }}
              />
              <span>Outil officiel · Ultimated Studio Officiel · IA créative</span>
            </div>

            <h1
              style={{
                fontSize: 30,
                lineHeight: 1.15,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              What would you build today,
              <br />
              <span
                style={{
                  backgroundImage: goldGradient,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                version Ultimated ?
              </span>
            </h1>

            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.78)",
                maxWidth: 460,
                marginBottom: 20,
              }}
            >
              Décris ton idée de site, d’app ou de boutique. Ultimated Builder
              IA te renvoie un vrai site prêt à tester : sections, textes et
              structure complète.
            </p>

            <form onSubmit={handleGenerate}>
              {/* Carte input luxe */}
              <div
                style={{
                  borderRadius: 26,
                  padding: 1,
                  backgroundImage:
                    "linear-gradient(135deg,rgba(246,221,176,0.8),rgba(0,0,0,0.05),rgba(185,131,46,0.9))",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    borderRadius: 25,
                    background: "rgba(5,3,5,0.97)",
                    border: "1px solid rgba(0,0,0,0.9)",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 18px 10px 18px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <label
                      htmlFor="prompt"
                      style={{
                        display: "block",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        color: "rgba(244,223,176,0.85)",
                        marginBottom: 6,
                      }}
                    >
                      Décris ton projet
                    </label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={3}
                      placeholder={`Exemple : "Une landing page luxe pour une marque de vêtements, avec section héros, grille de produits et formulaire de contact."`}
                      style={{
                        resize: "none",
                        width: "100%",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: "#fdfaf4",
                        fontSize: 14,
                        lineHeight: 1.4,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "10px 16px 12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      Appuie sur <strong>Enter</strong> ou clique sur le bouton
                      pour lancer l&apos;IA.
                    </span>

                    <button
                      type="submit"
                      disabled={state === "loading"}
                      style={{
                        borderRadius: 999,
                        padding: "8px 20px",
                        border: "none",
                        backgroundImage: goldGradient,
                        color: "#1a1307",
                        fontWeight: 600,
                        fontSize: 13,
                        letterSpacing: 0.4,
                        cursor: state === "loading" ? "default" : "pointer",
                        opacity: state === "loading" ? 0.6 : 1,
                        boxShadow:
                          "0 8px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.6)",
                      }}
                    >
                      {state === "loading" ? "Génération..." : "Lancer l’IA →"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                {[
                  "Boutique en ligne pour une marque de bijoux",
                  "Landing page pour une app mobile de finances",
                  "Site vitrine pour photographe professionnel",
                  "Page de vente pour formation en ligne",
                  "Mini-site pour un restaurant gastronomique",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPrompt(s)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(10,7,5,0.88)",
                      color: "rgba(255,255,255,0.82)",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {error && (
                <p
                  style={{
                    fontSize: 11,
                    color: "#ffd0d0",
                    background: "rgba(120,0,0,0.55)",
                    borderRadius: 8,
                    padding: "6px 10px",
                    border: "1px solid rgba(255,140,140,0.5)",
                    marginTop: 4,
                  }}
                >
                  {error}
                </p>
              )}

              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  marginTop: 6,
                }}
              >
                Laisse l’IA construire ton site comme un studio de luxe : structure,
                textes et sections déjà en place.
              </p>
            </form>
          </div>

          {/* Colonne droite – preview */}
          <div style={{ flex: 1.1 }}>
            <div
              style={{
                borderRadius: 26,
                border: goldBorder,
                background:
                  "linear-gradient(180deg,rgba(255,255,255,0.06),rgba(0,0,0,0.96))",
                boxShadow:
                  "0 24px 70px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,0,0,0.9)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* barre top de la fenêtre */}
              <div
                style={{
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(6,4,3,0.95)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background:
                        state === "loading" ? "#f6d88c" : "#4ade80",
                    }}
                  />
                  <span>
                    {state === "loading"
                      ? "Construction du site en cours..."
                      : state === "done"
                      ? "Site généré — aperçu en direct"
                      : "Aperçu du site généré"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!siteHtml}
                  style={{
                    fontSize: 11,
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: "1px solid rgba(246,216,140,0.7)",
                    background: "rgba(0,0,0,0.85)",
                    color: "rgba(246,216,140,0.95)",
                    cursor: siteHtml ? "pointer" : "default",
                    opacity: siteHtml ? 1 : 0.4,
                  }}
                >
                  Publier & tester
                </button>
              </div>

              <div style={{ flex: 1, background: "#000" }}>
                {siteHtml ? (
                  <iframe
                    title="Aperçu du site généré"
                    srcDoc={siteHtml}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: "0 28px",
                      gap: 6,
                    }}
                  >
                    <div style={{ fontSize: 34, marginBottom: 4 }}>✨</div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.78)",
                      }}
                    >
                      L’aperçu de ton site apparaîtra ici dès que tu auras lancé
                      une génération.
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.45)",
                        maxWidth: 320,
                      }}
                    >
                      Décris ton projet à gauche, lance l’IA, puis découvre un
                      site complet prêt à affiner et publier, version Ultimated.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plaque or en bas */}
      <footer
        style={{
          width: "100%",
          padding: "10px 0 16px 0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "8px 24px",
            borderRadius: 999,
            backgroundImage: goldGradient,
            color: "#20130a",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            boxShadow: "0 8px 26px rgba(0,0,0,0.8)",
          }}
        >
          Outil officiel · From the House of Ultimated Studio Officiel
        </div>
      </footer>
    </main>
  );
}
