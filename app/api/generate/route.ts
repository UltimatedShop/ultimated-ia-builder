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

    // ⚡ Appel direct à l’API Responses avec GPT-5.1
    const systemInstructions = `
Tu es un expert front-end senior.

TA MISSION : créer UNE SEULE page HTML complète qui fonctionne comme une vraie APP.

CONTRAINTES TRÈS IMPORTANTES :

1. STYLE VISUEL :
   - Noir profond + Or luxe (style Ultimated / Louis Vuitton).
   - Look application / dashboard moderne, pas landing page marketing.

2. STRUCTURE :
   - Sidebar ou header d'app.
   - Cartes, tableaux, listes dynamiques, UI propre.
   - Peu de texte, surtout des blocs utiles.

3. INTERACTIONS (OBLIGATOIRE) :
   - Onglets qui changent de contenu.
   - Boutons ON/OFF qui modifient des états visibles.
   - Sections ou panneaux qui s’ouvrent / se ferment.
   - Petites interactions en JavaScript natif.
   - Aucune requête réseau ou API externe (tout en front).

4. CODE :
   - AUCUN markdown, AUCUN bloc \`\`\`.
   - AUCUN React, Tailwind ou framework.
   - Tout le CSS dans une balise <style>.
   - Tout le JS dans une balise <script>.
   - Le document doit commencer par <!DOCTYPE html>.
`.trim();

    const userInput = `
Idée de l'app à construire :

"${prompt}"

Crée une web app interactive (tableaux, cartes, sidebar, boutons, états dynamiques)
en thème noir & or élégant, prête à être affichée telle quelle dans une iframe.
`.trim();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.1", // 💎 GPT-5.1
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

    // Récupérer le texte renvoyé par la Responses API
    let html: string =
      data.output?.[0]?.content?.[0]?.text?.toString().trim() || "";

    // 🧽 Nettoyage : au cas où il mettrait encore des ```html
    html = html
      .replace(/^```html/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    if (!html.toLowerCase().includes("<html")) {
      html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Ultimated App</title></head><body>${html}</body></html>`;
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
