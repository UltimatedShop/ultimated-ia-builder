import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Theme = {
  background?: string;
  backgroundAlt?: string;
  accent?: string;
  accentSoft?: string;
  border?: string;
  textPrimary?: string;
  textMuted?: string;
};

type AppConfig = {
  appName: string;
  description: string;
  theme?: Theme;
  cards: { label: string; value: string; hint: string }[];
  columns: string[];
  rows: string[][];
  timeline: { text: string; time: string }[];
};

/** 🎨 Palettes prédéfinies (pour les couleurs aléatoires) */
const PRESET_THEMES: Theme[] = [
  // Bleu néon
  {
    background: "#020617",
    backgroundAlt: "#0b1120",
    accent: "#38bdf8",
    accentSoft: "rgba(56,189,248,0.16)",
    border: "rgba(148,163,184,0.6)",
    textPrimary: "#e5f2ff",
    textMuted: "rgba(191,219,254,0.85)",
  },
  // Vert dashboard
  {
    background: "#020814",
    backgroundAlt: "#04101e",
    accent: "#22c55e",
    accentSoft: "rgba(34,197,94,0.18)",
    border: "rgba(74,222,128,0.5)",
    textPrimary: "#ecfdf3",
    textMuted: "rgba(187,247,208,0.9)",
  },
  // Violet / rose
  {
    background: "#14001f",
    backgroundAlt: "#1f0030",
    accent: "#e879f9",
    accentSoft: "rgba(232,121,249,0.18)",
    border: "rgba(244,114,182,0.6)",
    textPrimary: "#fdf2ff",
    textMuted: "rgba(251,207,232,0.9)",
  },
  // Orange / ambre
  {
    background: "#130a02",
    backgroundAlt: "#1f1305",
    accent: "#fb923c",
    accentSoft: "rgba(251,146,60,0.18)",
    border: "rgba(251,191,36,0.6)",
    textPrimary: "#fff7ed",
    textMuted: "rgba(254,215,170,0.9)",
  },
  // Cyan / teal
  {
    background: "#021518",
    backgroundAlt: "#042024",
    accent: "#2dd4bf",
    accentSoft: "rgba(45,212,191,0.18)",
    border: "rgba(94,234,212,0.6)",
    textPrimary: "#ecfeff",
    textMuted: "rgba(204,251,241,0.9)",
  },
];

function randomPresetTheme(): Theme {
  const i = Math.floor(Math.random() * PRESET_THEMES.length);
  return PRESET_THEMES[i];
}

/** merge : thème généré par l’IA + palette aléatoire propre */
function getTheme(t?: Theme) {
  const base = randomPresetTheme();
  return {
    background: t?.background || base.background,
    backgroundAlt: t?.backgroundAlt || base.backgroundAlt,
    accent: t?.accent || base.accent,
    accentSoft: t?.accentSoft || base.accentSoft,
    border: t?.border || base.border,
    textPrimary: t?.textPrimary || base.textPrimary,
    textMuted: t?.textMuted || base.textMuted,
  };
}

/** fallback si GPT foire le JSON */
function defaultConfig(prompt: string): AppConfig {
  return {
    appName: prompt || "Ultimated Dashboard",
    description:
      "Dashboard généré par Ultimated Builder IA. Adapte ensuite cette base pour ton vrai projet.",
    cards: [
      {
        label: "Tâches actives",
        value: "12",
        hint: "Éléments en cours de traitement.",
      },
      {
        label: "Priorité élevée",
        value: "4",
        hint: "Demandes à traiter en premier.",
      },
      {
        label: "Clôturées aujourd'hui",
        value: "18",
        hint: "Opérations terminées.",
      },
    ],
    columns: ["ID", "Description", "Statut", "Action"],
    rows: [
      ["#1024", "Mission prioritaire", "En cours", "Détail"],
      ["#1025", "Nouvelle demande", "En attente", "Assigner"],
      ["#1026", "Validation finale", "À vérifier", "Valider"],
    ],
    timeline: [
      { text: "Nouvelle mission créée.", time: "Il y a 3 min" },
      { text: "Statut mis à jour.", time: "Il y a 11 min" },
      { text: "Mission clôturée avec succès.", time: "Il y a 27 min" },
    ],
  };
}

/** Construit la page HTML finale (dashboard complet) */
function buildHtml(config: AppConfig): string {
  const safeTitle = config.appName || "Ultimated App";
  const th = getTheme(config.theme);

  const cardsHtml = config.cards
    .map(
      (c) => `
      <article class="card">
        <div class="card-label">${c.label}</div>
        <div class="card-value">${c.value}</div>
        <div class="card-sub">${c.hint}</div>
      </article>
    `
    )
    .join("");

  const headerRowHtml = `
    <tr>
      ${config.columns.map((col) => `<th>${col}</th>`).join("")}
    </tr>
  `;

  const rowsHtml = config.rows
    .map(
      (row) => `
      <tr>
        ${row
          .map((cell, idx) => {
            if (idx === 2) {
              return `<td><span class="status-pill">${cell}</span></td>`;
            }
            if (idx === row.length - 1) {
              return `<td><button class="btn-ghost">${cell || "Détail"}</button></td>`;
            }
            return `<td>${cell}</td>`;
          })
          .join("")}
      </tr>
    `
    )
    .join("");

  const timelineHtml = config.timeline
    .map(
      (t) => `
      <div class="timeline-item">
        <div class="dot"></div>
        <div>
          <div class="timeline-text">${t.text}</div>
          <div class="timeline-time">${t.time}</div>
        </div>
      </div>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${safeTitle} — Ultimated Builder IA</title>
  <style>
    :root {
      --bg: ${th.background};
      --bg-alt: ${th.backgroundAlt};
      --accent: ${th.accent};
      --accent-soft: ${th.accentSoft};
      --border: ${th.border};
      --text: ${th.textPrimary};
      --text-muted: ${th.textMuted};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: radial-gradient(circle at top, var(--bg-alt) 0, var(--bg) 55%, #000);
      color: var(--text);
      min-height: 100vh;
      display: flex;
    }
    .sidebar {
      width: 230px;
      padding: 24px 18px;
      border-right: 1px solid var(--border);
      background: rgba(0,0,0,0.85);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
    }
    .logo-badge {
      width: 26px;
      height: 26px;
      border-radius: 999px;
      background: var(--accent);
      display: flex;
      align-items: center;
      justifyContent: center;
      font-weight: 700;
      font-size: 11px;
      color: #050308;
    }
    .logo-text {
      font-size: 11px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .menu {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      margin-top: 10px;
    }
    .menu button {
      text-align: left;
      background: transparent;
      border-radius: 999px;
      border: 1px solid transparent;
      padding: 6px 10px;
      color: var(--text-muted);
      cursor: pointer;
    }
    .menu button.active {
      border-color: var(--accent);
      background: var(--accent-soft);
      color: var(--text);
    }
    .main {
      flex: 1;
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 22px;
      font-weight: 600;
    }
    .subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .top-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .btn-gold {
      border-radius: 999px;
      border: none;
      padding: 7px 14px;
      background: var(--accent);
      color: #050308;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,0.8);
    }
    .btn-ghost {
      border-radius: 999px;
      border: 1px solid var(--accent);
      padding: 6px 12px;
      background: rgba(0,0,0,0.75);
      color: var(--accent);
      font-size: 12px;
      cursor: pointer;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 14px;
      margin-top: 12px;
    }
    .card {
      border-radius: 16px;
      padding: 12px 14px;
      background: radial-gradient(circle at top left, var(--accent-soft), rgba(0,0,0,0.9));
      border: 1px solid var(--border);
    }
    .card-label {
      font-size: 11px;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .card-value {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .card-sub {
      font-size: 11px;
      color: var(--text-muted);
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(0,2fr) minmax(0,1.4fr);
      gap: 16px;
      margin-top: 4px;
    }
    .panel {
      border-radius: 18px;
      background: rgba(4,6,18,0.95);
      border: 1px solid var(--border);
      padding: 14px 16px;
    }
    .panel h3 {
      font-size: 13px;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th, td {
      padding: 6px 8px;
      border-bottom: 1px solid rgba(15,23,42,0.9);
    }
    th {
      text-align: left;
      color: var(--text-muted);
      font-weight: 500;
      font-size: 11px;
    }
    tr:hover td {
      background: rgba(15,23,42,0.9);
    }
    .status-pill {
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
      border: 1px solid var(--accent);
      color: var(--accent);
    }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 12px;
    }
    .timeline-item {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .dot {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: var(--accent);
      margin-top: 4px;
    }
    .timeline-text {
      color: var(--text);
    }
    .timeline-time {
      font-size: 11px;
      color: var(--text-muted);
    }
    footer {
      margin-top: 12px;
      font-size: 10px;
      text-align: right;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-badge">UB</div>
      <div class="logo-text">Ultimated Builder IA</div>
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">
      Vue générale
    </div>
    <div class="menu">
      <button class="active" data-tab="dash">Dashboard</button>
      <button data-tab="today">Jour en cours</button>
      <button data-tab="archive">Historique</button>
      <button data-tab="settings">Paramètres</button>
    </div>
  </aside>

  <main class="main">
    <div class="topbar">
      <div>
        <div class="title">${safeTitle}</div>
        <div class="subtitle">${config.description}</div>
      </div>
      <div class="top-actions">
        <button class="btn-ghost" id="toggle-theme">Mode clair</button>
        <button class="btn-gold">Créer une nouvelle mission</button>
      </div>
    </div>

    <section class="cards" id="cards">
      ${cardsHtml}
    </section>

    <section class="layout">
      <div class="panel">
        <h3>Liste des éléments</h3>
        <table id="items-table">
          <thead>${headerRowHtml}</thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <div class="panel">
        <h3>Flux en direct</h3>
        <div class="timeline" id="timeline">
          ${timelineHtml}
        </div>
      </div>
    </section>

    <footer>
      From the House of Ultimated Studio Officiel — Aperçu généré automatiquement.
    </footer>
  </main>

  <script>
    const menuButtons = document.querySelectorAll(".menu button");
    const timeline = document.getElementById("timeline");
    const toggleThemeBtn = document.getElementById("toggle-theme");

    menuButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        menuButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.getAttribute("data-tab");

        const extra = document.createElement("div");
        extra.className = "timeline-item";
        extra.innerHTML = '<div class="dot"></div><div><div class="timeline-text">Onglet "' + tab + '" sélectionné.</div><div class="timeline-time">À l\\'instant</div></div>';
        timeline.prepend(extra);
      });
    });

    let light = false;
    toggleThemeBtn?.addEventListener("click", () => {
      light = !light;
      document.body.style.background = light
        ? "radial-gradient(circle at top, #e5e7eb 0,#f9fafb 55%,#e5e7eb)"
        : "radial-gradient(circle at top, var(--bg-alt) 0, var(--bg) 55%, #000)";
      toggleThemeBtn.textContent = light ? "Mode sombre" : "Mode clair";
    });
  </script>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY manquante");
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY manquante. Ajoute ta clé dans Vercel (OPENAI_API_KEY) puis redeploie.",
        },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt manquant ou invalide." },
        { status: 400 }
      );
    }

    // 🧠 Demande à GPT-5.1 un JSON avec éventuellement un theme
    const system = `
Tu renvoies UNIQUEMENT un JSON valide, sans markdown.
Format attendu :

{
  "appName": "Nom court",
  "description": "Phrase courte qui décrit le dashboard",
  "theme": {
    "background": "#0b1020",
    "backgroundAlt": "#020617",
    "accent": "#38bdf8",
    "accentSoft": "rgba(56,189,248,0.18)",
    "border": "rgba(148,163,184,0.6)",
    "textPrimary": "#e5f2ff",
    "textMuted": "rgba(191,219,254,0.9)"
  },
  "cards": [
    { "label": "...", "value": "...", "hint": "..." }
  ],
  "columns": ["Col 1", "Col 2", "Col 3", "Col 4"],
  "rows": [
    ["val1", "val2", "val3", "val4"]
  ],
  "timeline": [
    { "text": "Événement", "time": "Il y a X min" }
  ]
}

- Si la personne précise des couleurs ou un thème (ex: "thème rouge et noir", "look pastel bleu et rose"),
  adapte l'objet "theme" en conséquence.
- Si tu n'es pas sûr des couleurs, mets "theme": null ou ne le mets pas : le serveur choisira une palette aléatoire propre.
`.trim();

    const user = `
Idée de l'application :

"${prompt}"

Construit un JSON pour un dashboard professionnel qui gère ce type d'app.
`.trim();

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        instructions: system,
        input: user,
        max_output_tokens: 1200,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("❌ Erreur OpenAI (JSON config):", data);
      const fallback = defaultConfig(prompt);
      const htmlFallback = buildHtml(fallback);
      return NextResponse.json({ html: htmlFallback });
    }

    let raw = data.output?.[0]?.content?.[0]?.text?.toString() || "";
    // nettoyage éventuels ```json
    raw = raw
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    let config: AppConfig;
    try {
      config = JSON.parse(raw);
    } catch (e) {
      console.error("❌ JSON.parse échoué, on utilise le fallback:", e, raw);
      config = defaultConfig(prompt);
    }

    // sécurité si GPT oublie des champs
    if (!config || !config.cards || !config.columns || !config.rows) {
      config = defaultConfig(prompt);
    }

    const html = buildHtml(config);
    return NextResponse.json({ html });
  } catch (err: any) {
    console.error("Erreur /api/generate :", err);
    const html = buildHtml(defaultConfig("Ultimated Dashboard"));
    return NextResponse.json({ html });
  }
}
