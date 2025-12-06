// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1) Vérif clé
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY manquante dans Vercel");
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY manquante dans Vercel.",
          details:
            "Ajoute ta clé secrète sk-... dans Vercel (OPENAI_API_KEY) et redeploie.",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    // 2) Récup prompt + mode
    const body = await req.json().catch(() => ({}));
    const prompt: string | undefined = body?.prompt;
    const mode: string | undefined = body?.mode;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt manquant ou invalide." },
        { status: 400 }
      );
    }

    // 3) Prompt pour GPT-5.1
    const fullPrompt = `
Tu es "Ultimated Builder IA", une IA qui génère des sites web complets en HTML.

CONTRAINTES IMPORTANTES :
- Retourne UNIQUEMENT du HTML (aucun texte en dehors des balises).
- Ne mets PAS de balises <html>, <head> ou <body>, seulement le contenu principal.
- Le site est une one-page moderne, sombre, luxe, avec touches dorées.
- Inclure au minimum : header, section héros, sections contenu, section produits / services, call-to-action, footer.
- Utilise des classes HTML génériques (container, section, button...) et un peu de style inline si nécessaire.

DESCRIPTION UTILISATEUR À RESPECTER :
"${prompt}"

MODE : ${
      mode === "assistant"
        ? "Ajoute une FAQ et un peu de texte explicatif pour aider l'utilisateur."
        : "Reste simple et clair, orienté design, prêt à être utilisé."
    }
    `.trim();

    // 4) Appel OpenAI (nouvelle API Responses)
    const response = await client.responses.create({
      model: "gpt-5.1",
      input: fullPrompt,
    });

    // 5) Extraction du HTML retourné
    let html = "";
    try {
      const firstOutput: any = response.output?.[0];
      const firstContent: any = firstOutput?.content?.[0];

      if (typeof firstContent?.text === "string") {
        html = firstContent.text;
      } else if (firstContent?.text?.value) {
        html = firstContent.text.value;
      } else {
        html = String(firstContent ?? "");
      }
    } catch (e) {
      console.error("❌ Erreur extraction HTML:", e);
    }

    if (!html || html.trim().length === 0) {
      console.error("❌ Réponse OpenAI vide ou illisible:", response);
      return NextResponse.json(
        {
          error: "Réponse OpenAI vide.",
          details:
            "Le modèle a répondu mais sans HTML exploitable. Vérifie le modèle ou le prompt.",
        },
        { status: 500 }
      );
    }

    // 6) Réponse OK
    return NextResponse.json({ html });
  } catch (err: any) {
    console.error("❌ Erreur globale route /api/generate:", err);

    const status = err?.status ?? 500;
    const message =
      err?.error?.message ||
      err?.message ||
      "Erreur inconnue côté serveur ou OpenAI.";

    return NextResponse.json(
      {
        error: "Erreur OpenAI / serveur.",
        details: message,
      },
      { status }
    );
  }
}
