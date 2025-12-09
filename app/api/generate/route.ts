import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    // 🧠 Instructions pour GPT-5.1
    const systemInstructions = `
Tu es un expert front-end senior.

TA MISSION : créer UNE SEULE page HTML complète qui fonctionne comme une vraie APPLICATION WEB.

CONTRAINTES OBLIGATOIRES :

1. STYLE VISUEL :
   - Fond noir profond (#050308) avec dégradés subtils.
   - Détails or luxe (style Ultimated / Louis Vuitton) : #f6d88c, #f0c878, #b9832e.
   - Typo lisible, texte en blanc ou or (jamais noir sur fond noir).

2. CONTENU MINIMUM :
   La page DOIT avoir AU MOINS :
   - Un header avec le nom de l'app.
   - Une sidebar OU un top navigation (menu).
   - 3 cartes de statistiques (ex: "Appels du jour", "Remorquages en cours", etc.).
   - Un tableau avec plusieurs lignes (liste d'éléments).
   - Une section "détail" ou "timeline".
   - Plusieurs boutons visibles (ex : "Assigner", "Clôturer", "Voir détail").

3. INTERACTIONS (JAVASCRIPT NATIF) :
   - Onglets qui changent le contenu de la zone principale.
   - Boutons qui changent l'état affiché (ex: filtres, statut, panneau ouvert/fermé).
   - Aucune requête réseau (pas de fetch), tout en front.
   - Utilise document.querySelector, addEventListener, etc.

4. CODE :
   - AUCUN markdown, AUCUN bloc \`\`\`.
   - AUCUN React, Tailwind ou autre framework.
   - Tout le CSS dans une balise <style>.
   - Tout le JS dans une balise <script>.
   - Le document doit commencer par <!DOCTYPE html>.
`.trim();

    const userInput = `
Idée de l'application à construire :

"${prompt}"

Crée une web app de type dashboard (style outil pro), thème noir & or Ultimated,
avec au minimum header, sidebar ou topbar, plusieurs cartes de stats, un tableau,
des boutons fonctionnels (JS) et du texte lisible (blanc/or).
`.trim();

    // 🔗 Appel à l’API Responses avec GPT-5.1
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        instructions: systemInstructions,
        input: userInput,
        max_output_tokens: 4000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur OpenAI (GPT-5.1):", data);
      return NextResponse.json(
        {
          error:
            data.error?.message ||
            "Erreur renvoyée par l'API OpenAI (GPT-5.1). Vérifie ta clé ou ton compte.",
        },
        { status: 500 }
      );
    }

    // 🧾 Récupération du texte dans la structure Responses
    let html: string =
      data.output?.[0]?.content?.[0]?.text?.toString().trim() || "";

    // 🧽 Nettoyage : au cas où il met encore des ```html
    html = html
      .replace(/^```html/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    // 🛡️ Sécurité : si le HTML est trop court ou quasi vide, on met un template par défaut
    const tooShort = html.length < 300;

    if (tooShort || !html.toLowerCase().includes("<html")) {
      const safeTitle = prompt.slice(0, 60);
      html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Ultimated App — ${safeTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: radial-gradient(circle at top, #3c2810 0, #050308 55%, #000);
      color: #fdfaf4;
      min-height: 100vh;
      display: flex;
    }
    .sidebar {
      width: 230px;
      padding: 24px 18px;
      border-right: 1px solid rgba(246,216,140,0.25);
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
      background: linear-gradient(135deg,#f6ddb0,#f0c878,#b9832e);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 11px;
      color: #1a1307;
    }
    .logo-text {
      font-size: 11px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: #f4dfb0;
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
      color: rgba(255,255,255,0.75);
      cursor: pointer;
    }
    .menu button.active {
      border-color: rgba(246,216,140,0.9);
      background: rgba(246,216,140,0.12);
      color: #f6d88c;
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
      color: rgba(255,255,255,0.65);
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
      background: linear-gradient(135deg,#f6ddb0,#f0c878,#b9832e);
      color: #1a1307;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,0.8);
    }
    .btn-ghost {
      border-radius: 999px;
      border: 1px solid rgba(246,216,140,0.5);
      padding: 6px 12px;
      background: rgba(0,0,0,0.75);
      color: rgba(246,216,140,0.9);
      font-size: 12px;
      cursor: pointer;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 14px;
    }
    .card {
      border-radius: 16px;
      padding: 12px 14px;
      background: radial-gradient(circle at top left, rgba(246,216,140,0.22), rgba(0,0,0,0.9));
      border: 1px solid rgba(246,216,140,0.22);
    }
    .card-label {
      font-size: 11px;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: rgba(246,216,140,0.85);
      margin-bottom: 6px;
    }
    .card-value {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .card-sub {
      font-size: 11px;
      color: rgba(255,255,255,0.7);
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(0,2fr) minmax(0,1.4fr);
      gap: 16px;
      margin-top: 4px;
    }
    .panel {
      border-radius: 18px;
      background: rgba(5,3,8,0.95);
      border: 1px solid rgba(246,216,140,0.25);
      padding: 14px 16px;
    }
    .panel h3 {
      font-size: 13px;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: rgba(246,216,140,0.9);
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th, td {
      padding: 6px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    th {
      text-align: left;
      color: rgba(255,255,255,0.65);
      font-weight: 500;
      font-size: 11px;
    }
    tr:hover td {
      background: rgba(246,216,140,0.06);
    }
    .status-pill {
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
      border: 1px solid rgba(246,216,140,0.6);
      color: rgba(246,216,140,0.92);
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
      background: linear-gradient(135deg,#f6ddb0,#b9832e);
      margin-top: 4px;
    }
    .timeline-text {
      color: rgba(255,255,255,0.8);
    }
    .timeline-time {
      font-size: 11px;
      color: rgba(255,255,255,0.55);
    }
    footer {
      margin-top: 12px;
      font-size: 10px;
      text-align: right;
      color: rgba(255,255,255,0.45);
    }
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-badge">UB</div>
      <div class="logo-text">Ultimated Builder IA</div>
    </div>
    <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-bottom:10px;">
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
        <div class="title">Ultimated App — ${safeTitle || "Aperçu généré"}</div>
        <div class="subtitle">
          Dashboard généré par Ultimated Builder IA. Adapte ensuite cette base pour ton vrai projet.
        </div>
      </div>
      <div class="top-actions">
        <button class="btn-ghost" id="toggle-theme">Mode clair</button>
        <button class="btn-gold">Créer une nouvelle mission</button>
      </div>
    </div>

    <section class="cards" id="cards">
      <article class="card">
        <div class="card-label">Tâches actives</div>
        <div class="card-value" id="metric-main">12</div>
        <div class="card-sub">Missions en cours de traitement.</div>
      </article>
      <article class="card">
        <div class="card-label">Priorité élevée</div>
        <div class="card-value">4</div>
        <div class="card-sub">Demandes à traiter en premier.</div>
      </article>
      <article class="card">
        <div class="card-label">Clôturées aujourd'hui</div>
        <div class="card-value">18</div>
        <div class="card-sub">Taux de complétion en hausse.</div>
      </article>
    </section>

    <section class="layout">
      <div class="panel">
        <h3>Liste des éléments</h3>
        <table id="items-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1024</td>
              <td>Mission prioritaire</td>
              <td><span class="status-pill">En cours</span></td>
              <td><button class="btn-ghost">Détail</button></td>
            </tr>
            <tr>
              <td>#1025</td>
              <td>Nouvelle demande</td>
              <td><span class="status-pill">En attente</span></td>
              <td><button class="btn-ghost">Assigner</button></td>
            </tr>
            <tr>
              <td>#1026</td>
              <td>Clôture en validation</td>
              <td><span class="status-pill">À vérifier</span></td>
              <td><button class="btn-ghost">Valider</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <h3>Flux en direct</h3>
        <div class="timeline" id="timeline">
          <div class="timeline-item">
            <div class="dot"></div>
            <div>
              <div class="timeline-text">Nouvelle mission créée.</div>
              <div class="timeline-time">Il y a 3 min</div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div>
              <div class="timeline-text">Statut mis à jour sur "En route".</div>
              <div class="timeline-time">Il y a 12 min</div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="dot"></div>
            <div>
              <div class="timeline-text">Mission clôturée avec succès.</div>
              <div class="timeline-time">Il y a 28 min</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer>
      From the House of Ultimated Studio Officiel — Aperçu généré automatiquement.
    </footer>
  </main>

  <script>
    const menuButtons = document.querySelectorAll(".menu button");
    const metricMain = document.getElementById("metric-main");
    const timeline = document.getElementById("timeline");
    const toggleThemeBtn = document.getElementById("toggle-theme");

    menuButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        menuButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.getAttribute("data-tab");

        if (tab === "dash") {
          metricMain.textContent = "12";
        } else if (tab === "today") {
          metricMain.textContent = "7";
        } else if (tab === "archive") {
          metricMain.textContent = "42";
        } else if (tab === "settings") {
          metricMain.textContent = "—";
        }

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
        ? "radial-gradient(circle at top,#f6ddb0,#f0c878,#b9832e)"
        : "radial-gradient(circle at top, #3c2810 0, #050308 55%, #000)";
      toggleThemeBtn.textContent = light ? "Mode sombre" : "Mode clair";
    });
  </script>
</body>
</html>`;
    }

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error("Erreur /api/generate (serveur) :", err);
    return NextResponse.json(
      {
        error:
          "Erreur interne lors de la génération. Vérifie les logs Vercel si le problème persiste.",
      },
      { status: 500 }
    );
  }
}
