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

    // Import dynamique pour éviter les bugs de bundler
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey });

    const systemMessage = `
Tu es un expert front-end senior.
Ta mission : générer UNE SEULE page HTML complète pour une WEB APP moderne.

Contraintes IMPORTANTES :

- Thème visuel : noir profond + or luxe, style Ultimated / Louis Vuitton.
- Pas de long texte marketing : phrases courtes, titres clairs, sections propres.
- Style "app" ou "dashboard", pas "site vitrine compliqué".
- Mets des éléments interactifs avec JavaScript natif :
  - exemples : onglets qui changent le contenu, boutons qui ouvrent un panneau / une modal,
    boutons ON/OFF qui changent un état affiché, filtres simples, etc.
  - Aucune requête serveur ou API externe, tout doit rester côté front.
- Utilise une seule page : pas de lien vers d'autres routes.
- Mets le CSS et le JS directement dans la page (balises <style> et <script>).
- Pas d'import de framework (pas de React, pas de Tailwind, pas de CDN).
- Le design doit rester lisible : pas trop de texte, plutôt des blocs, cartes, tableaux, boutons.
- N'utilise pas de contenu sur le remorquage par défaut : adapte-toi au sujet demandé.
- Le résultat doit être un document HTML COMPLET commençant par <!DOCTYPE html>.
`;

    const userMessage = `
Idée de l'app / du site à construire :

"${prompt}"

Construis une interface qui ressemble à une vraie application web fonctionnelle
(tableau de bord, cartes, boutons, menus, etc.), avec un peu d'interactions.
`;

    const completion = await client.responses.create({
      model: "gpt-5.1",
      input: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_output_tokens: 4000,
    });

    // Récupère le texte
    const raw =
      completion.output[0].content
        ?.map((c: any) => ("text" in c ? c.text : ""))
        .join("") || "";

    const html = raw.trim();

    if (!html.toLowerCase().includes("<html")) {
      // sécurité : si jamais le modèle oublie le DOCTYPE
      const wrapped = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Ultimated Builder IA</title></head><body>${html}</body></html>`;
      return NextResponse.json({ html: wrapped });
    }

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error("Erreur /api/generate :", err);
    return NextResponse.json(
      {
        error:
          "Erreur interne lors de la génération du site. Vérifie la console Vercel pour plus de détails.",
      },
      { status: 500 }
    );
  }
}
