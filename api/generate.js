import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Not allowed" });

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt manquant" });
    }

    const systemPrompt = `
Tu crées des sites web COMPLETS.
Retourne UNIQUEMENT un fichier HTML + CSS complet.
AUCUN texte autour. AUCUN commentaire. AUCUNE explication.
Le résultat doit être un site fini, stylé noir & or, prêt à afficher dans un navigateur.
`;

    const response = await client.responses.create({
      model: "gpt-5.1",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_output_tokens: 3000
    });

    const html =
      response.output?.[0]?.content?.[0]?.text?.value ||
      "<h1>Erreur de génération</h1>";

    return res.status(200).json({ html });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return res.status(500).json({
      error: "Erreur côté serveur"
    });
  }
}
