export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Méthode non autorisée" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ ok: false, error: "Configuration Telegram manquante" });
  }

  try {
    const {
      clientName = "Non précisé",
      clientContact = "Non précisé",
      vehicleModel = "Non précisé",
      formula = "Confort Intérieur",
      preferredSlot = "À définir",
      interiorNotes = "Aucune précision"
    } = req.body || {};

    const text = [
      "🚗 *Nouvelle demande — Wash X Detailing*",
      "• *100 % Intérieur*",
      `• *Client :* ${clientName}`,
      `• *Contact :* ${clientContact}`,
      `• *Véhicule :* ${vehicleModel}`,
      `• *Formule :* ${formula}`,
      `• *Créneaux :* ${preferredSlot}`,
      `• *Détails habitacle :* ${interiorNotes}`
    ].join("\n");

    const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown"
      })
    });

    const tgData = await tgResponse.json();
    if (!tgResponse.ok || !tgData.ok) {
      return res.status(502).json({ ok: false, error: "Erreur d'envoi Telegram" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Erreur serveur" });
  }
}
