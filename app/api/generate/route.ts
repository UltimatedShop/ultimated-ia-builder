// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "missing_api_key" },
        { status: 500 }
      );
    }

    const { prompt, mode } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "missing_prompt" },
        { status: 400 }
      );
    }

    // Prompt système pour forcer un HTML propre et autonome
    const fullPrompt = `
Tu es "Ultimated Builder IA", une IA qui génère des sites web complets en HTML.

RÔLE :
- Générer un site d'une page (one-page) en HTML + CSS inline (ou petites <style>).
- Le style doit être moderne, sombre, léger, avec des touches de doré (luxe).
- Ne renvoie QUE du code HTML (pas de texte explicatif en dehors des balises).
- N'ajoute PAS de balises <html>, <head> ou <body>. Juste le contenu principal.
- Inclure : un header, une section héros, sections infos, call-to-action, footer.

DESCRIPTION UTILISATEUR :
"${prompt}"

MODE : ${mode === "assistant" ? "Met un peu plus de texte explicatif et des FAQ." : "Concentre-toi sur un site clair qui pourrait être utilisé tel quel."}
    `.trim();

    const response: any = await client.responses.create({
      model: "gpt-5.1",
      input: fullPrompt,
    });

    // Extraction du texte (adapté au nouveau schema Responses)
    let html = "";
    try {
      const firstOutput = response.output[0];
      const firstContent = firstOutput.content[0];
      if (typeof firstContent.text === "string") {
        html = firstContent.text;
      } else if (firstContent.text?.value) {
        html = firstContent.text.value;
      } else {
        html = String(firstContent);
      }
    } catch {
      html = "";
    }

    if (!html) {
      return NextResponse.json(
        { error: "empty_response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error("Erreur OpenAI:", err);
    return NextResponse.json(
      { error: "openai_error", details: String(err?.message || err) },
      { status: 500 }
    );
  }
}
