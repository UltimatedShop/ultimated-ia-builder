export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  // Récupérer le texte envoyé par ton formulaire
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  const prompt = body?.prompt || "";

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "Clé API manquante (OPENAI_API_KEY). Tu pourras l'ajouter dans Vercel.",
    });
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content:
              "Tu es un expert en création de sites web luxueux (style Ultimated). Génère une structure claire de site : sections, titres, textes, FAQ.",
          },
          {
            role: "user",
            content:
              "Idée de site : " +
              prompt +
              ". Fais un plan de site complet avec titres, sections et textes.",
          },
        ],
      }),
    });

    const data = await response.json();

    const output =
      data?.choices?.[0]?.message?.content ||
      "Aucune réponse (vérifie la clé API ou le billing OpenAI).";

    res.status(200).json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur côté IA." });
  }
}
