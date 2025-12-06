// api/generate.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { prompt, mode } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt manquant" });
    }

    let systemPrompt;
    let maxTokens = 1200;

    if (mode === "chat") {
      // Mode support IA (réponse texte)
      systemPrompt = `
Tu es l'assistant interne "Support IA — Ultimated".
Tu aides à améliorer des sites (sections, UX, textes, idées précises).
Réponds en français, avec des conseils concrets, clairs et directement utilisables.
Pas de code complet ici, juste du texte et quelques petits exemples si besoin.`;
      maxTokens = 700;
    } else {
      // Mode création de site : retourne un FICHIER HTML COMPLET
      systemPrompt = `
Tu es un expert en design web ultra luxe (noir & or, style Ultimated Studio).
Ta mission : générer un FICHIER HTML COMPLET pour une page d'accueil.

CONTRAINTES TRÈS IMPORTANTES :
- Retourne UNIQUEMENT du code HTML (aucune explication autour).
- Le résultat doit être un fichier complet : <html>, <head>, <style>, <body>.
- Place tous les styles dans une balise <style> dans le <head>.
- Design noir & or, très raffiné, sections claires (hero, features, etc.).
- Textes en français.
- Adapte le contenu à l'idée donnée par l'utilisateur.
- Le code doit être propre et prêt à être affiché tel quel dans un navigateur.`;
      maxTokens = 2800;
    }

    const response = await client.responses.create({
      model: "gpt-5.1",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_output_tokens: maxTokens,
    });

    // Récupération du texte renvoyé par l'API
    let output = "";

    try {
      // Nouveau format Responses API
      if (
        response.output &&
        response.output[0] &&
        response.output[0].content &&
        response.output[0].content[0] &&
        response.output[0].content[0].text &&
        typeof response.output[0].content[0].text.value === "string"
      ) {
        output = response.output[0].content[0].text.value;
      }
    } catch (e) {
      console.error("Parsing output error:", e);
    }

    if (!output) {
      output = "Aucune réponse générée. Vérifie ta clé API et ton crédit.";
    }

    return res.status(200).json({ output });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return res.status(500).json({
      error:
        "Erreur lors de la génération. Vérifie OPENAI_API_KEY sur Vercel et ton crédit.",
    });
  }
}
