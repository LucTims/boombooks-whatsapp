require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const WACHAP_API_KEY = process.env.WACHAP_API_KEY;
const API_BASE_URL = 'https://api.wachap.com/v1';

// Vérification de santé du serveur
app.get('/health', (req, res) => {
    res.status(200).send('Webhook en ligne et prêt.');
});

// Endpoint pour recevoir les messages WhatsApp
app.post('/webhook', async (req, res) => {
    // 1. Accusé de réception immédiat pour WaChap (évite les timeouts)
    res.status(200).send('OK');

    const body = req.body;
    console.log('Nouveau message reçu:', JSON.stringify(body, null, 2));

    try {
        // Extraction des données du webhook (Structure à adapter selon l'Event WaChap réel)
        // Exemple hypothétique d'event (Message entrant)
        if (body.event === 'message.received') {
            const senderPhone = body.data.from;
            const messageText = body.data.content;
            const accountId = body.data.accountId;

            // 2. Traitement intelligent (Classification et Réponse de l'agent)
            await processIncomingMessage(accountId, senderPhone, messageText);
        }
    } catch (error) {
        console.error('Erreur lors du traitement du webhook:', error.message);
    }
});

async function processIncomingMessage(accountId, to, text) {
    // TODO: Intégrer la logique IA (google/gemini) ici pour classifier l'intention et formuler la réponse
    const responseText = "Bonjour, je suis l'assistant commercial BoomBooks. Comment puis-je vous aider aujourd'hui ?";

    // 3. Envoi de la réponse via WaChap
    await sendWhatsAppMessage(accountId, to, responseText);
}

async function sendWhatsAppMessage(accountId, to, content) {
    try {
        const payload = {
            data: {
                accountId: accountId,
                to: to,
                type: 'text',
                content: content
            }
        };

        const response = await axios.post(`${API_BASE_URL}/whatsapp/messages/send`, payload, {
            headers: {
                'Authorization': `Bearer ${WACHAP_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Message envoyé à ${to} avec succès. ID: ${response.data.message_id || 'N/A'}`);
    } catch (error) {
        console.error(`Échec de l'envoi du message à ${to}:`, error.response ? error.response.data : error.message);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur Webhook démarré sur le port ${PORT}`);
});
