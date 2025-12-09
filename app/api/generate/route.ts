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
            "OPENAI_API_KEY manquante. Ajoute ta clé OpenAI dans Vercel (OPENAI_API_KEY) et redeploie.",
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

    // Import dynamique pour éviter les bugs en build
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey });

    //---------------------------------------------------
    // 🔥 — SYSTEM MESSAGE : RÈGLES POUR FORCER UNE VRAIE APP
    //---------------------------------------------------
    const systemMessage = `
Tu es un expert front-end senior.

TA MISSION : créer UNE SEULE page HTML complète qui fonctionne comme une vraie APP.

CONTRAINTES EXTREMEMENT IMPORTANTES :

1. STYLE VISUEL :
   - Noir profond + Or luxe (style Ultimated / Louis Vuitton)
   - Look application/dahsboard moderne, pas landing page marketing.

2. STRUCTURE :
   - Sidebar ou header app
   - Cartes, tableaux, listes dynamiques, UI propre
   - Aucun texte long, uniquement des blocs utiles

3. INTERACTIONS (OBLIGATOIRE) :
   - Onglets qui changent le contenu
   - Boutons ON/OFF qui changent des états visibles
   - Panneaux / sections qui s’ouvrent et se ferment
   - Petites animations JS (sans frameworks)
   - Tout doit fonctionner uniquement en JavaScript natif

4. CODE :
   - AUCUN markdown
   - AUCUN bloc \`\`\`
   - AUCUN React, AUCUN Tailwind, AUCUN import externe
   - Tout le CSS doit être dans <style>
   - Tout le JS doit être dans <script>
   - Le résultat doit commencer par : <!DOCTYPE html>
`;

    //---------------------------------------------------
    // 🔥 — USER MESSAGE (ton idée)
    //---------------------------------------------------
    const userMessage = `
Idée de l'app à construire :

"${prompt}"

Génère une application web interactive, avec
- tables
- cartes
- sidebar
- sections dynamiques
- boutons fonctionnels (JS)
- zéro markdown
- unité : une seule page HTML.
`;

    //---------------------------------------------------
    // 🔥 — APPEL AU MODEL GPT-5.1
    //---------------------------------------------------
    const completion = await client.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      max_tokens: 5000,
    });

    let html = completion.choices[0].message?.content || "";

    //---------------------------------------------------
    // 🧽 — NETTOYAGE AUTOMATIQUE : enlève les ```html etc.
    //---------------------------------------------------
    html = html
      .replace(/^```html/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    // Si jamais pas de <html>, on encapsule
    if (!html.toLowerCase().includes("<html")) {
      html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Ultimated App</title></head><body>${html}</body></html>`;
    }

    //---------------------------------------------------
    // 🔥 — REPONSE AU FRONT
    //---------------------------------------------------
    return NextResponse.json({ html });
  } catch (err: any) {
    console.error("Erreur /api/generate :", err);
    return NextResponse.json(
      {
        error:
          "Erreur interne lors de la génération. Vérifie la console Vercel.",
      },
      { status: 500 }
    );
  }
}
