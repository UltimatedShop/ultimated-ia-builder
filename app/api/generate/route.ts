// app/api/generate/route.ts
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
          error: "OPENAI_API_KEY manquante.",
          details:
            "Ajoute ta clé sk-... dans Vercel (OPENAI_API_KEY) en Production puis redeploie.",
        },
        { status: 500 }
      );
    }

    // ✅ Import dynamique d'OpenAI, limite les problèmes de bundler/runtime
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey });

    const body = await req.json().catch(() => ({}));
    const prompt: string | undefined = (body as any)?.prompt;
    const mode: string | undefined = (body as any)?.mode;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt manquant ou invalide." },
        { status: 400 }
      );
    }

    const fullPrompt = `
Tu es "Ultimated Builder IA", une IA qui génère des sites web complets en HTML.

CONTRAINTES :
- Retourne UNIQUEMENT du HTML (aucun texte hors balises).
- Pas de <html>, <head> ou <body>, seulement le contenu principal.
- One-page moderne, sombre, luxe, avec touches dorées.
- Sections minimum : header, héros, sections contenu, section produits/services, call-to-action, footer.

DESCRIPTION UTILISATEUR :
"${prompt}"

MODE : ${
      mode === "assistant"
        ? "Ajoute une FAQ et un peu plus de texte explicatif."
        : "Reste simple, clair et prêt à être utilisé."
    }
    `.trim();

    const response = await client.responses.create({
      model: "gpt-5.1",
      input: fullPrompt,
    });

    let html = "";
    try {
      const firstOutput: any = (response as any).output?.[0];
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

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error("❌ Erreur globale /api/generate:", err);
    return NextResponse.json(
      {
        error: "Erreur OpenAI / serveur.",
        details: String(err?.message || err),
      },
      { status: 500 }
    );
  }
}
