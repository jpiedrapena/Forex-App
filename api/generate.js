export default async function handler(req, res) {
  const allowed = ["https://forex-app-sable.vercel.app", "https://jpiedrapena.github.io"];
  const origin = req.headers.origin || "";
  if (allowed.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Falta el campo prompt" });
  if (typeof prompt !== "string" || prompt.length > 8000) return res.status(400).json({ error: "Prompt demasiado largo" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key no configurada en el servidor" });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  if (data.error) {
    return res.status(response.status).json({ error: data.error.message || JSON.stringify(data.error) });
  }

  const textBlock = (data.content || []).find((b) => b.type === "text" && b.text);
  if (!textBlock) return res.status(500).json({ error: "La API no devolvió contenido." });

  res.status(200).json({ text: textBlock.text });
}
