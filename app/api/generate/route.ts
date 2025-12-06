// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // sécurité, évite certains bugs edge

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY manquante dans Vercel");
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY manquante",
          details:
            "Ajoute ta clé secrète sk-... dans Vercel (Environment Variables) en PROD et redeploie.",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json().catch(() => ({}));
    const prompt = body?.prompt;
    const mode = body?.mode;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt manquant", details: "Envoie un texte valide." },
        { status: 400 }
      );
    }

    const fullPrompt = `
Tu es "Ultimated Builder IA", une IA qui génère des sites web complets en HTML.

RÔLE :
- Générer un site d'une page (one-page) en HTML.
- Style moderne, sombre, luxe, touches dorées.
- Ne renvoie QUE du code HTML (aucun texte hors balises).
- Pas de <html>, <head> ou <body>, juste le contenu principal.
- Inclure : header, héros, sections, CTA, footer.

DESCRIPTION UTILISATEUR :
"${prompt}"

MODE : ${
      mode === "assistant"
        ? "Met un peu plus de texte explicatif et des FAQ."
        : "Concentre-toi sur un site clair prêt à être utilisé."
    }
    `.trim();

    const response = await client.responses.create({
      model: "gpt-5.1",
      input: fullPrompt,
    });

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

    if (!html) {
      console.error("❌ Réponse OpenAI vide ou illisible:", response);
      return NextResponse.json(
        {
          error: "Réponse vide",
          details:
            "OpenAI a répondu mais le texte est vide. Vérifie le modèle ou le format.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error("❌ Erreur OpenAI brute:", err);

    const status = err?.status ?? 500;
    const message =
      err?.error?.message ||
      err?.message ||
      "Erreur inconnue côté OpenAI ou serveur.";

    return NextResponse.json(
      {
        error: "Erreur OpenAI / serveur",
        details: message,
        statusCode: status,
      },
      { status }
    );
  }
}
