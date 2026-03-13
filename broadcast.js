require('dotenv').config();
const axios = require('axios');

const WACHAP_API_KEY = process.env.WACHAP_API_KEY;
const ACCOUNT_ID = '7a7c0ee3-f247-412e-a0fc-93749c11123f';
const API_BASE_URL = 'https://api.wachap.com/v1';

async function sendBroadcast(contacts, message) {
    console.log(`🚀 Début de la campagne d'envoi pour ${contacts.length} contacts...`);
    
    for (const phone of contacts) {
        try {
            const payload = {
                data: {
                    accountId: ACCOUNT_ID,
                    to: phone,
                    type: 'text',
                    content: message
                }
            };

            await axios.post(`${API_BASE_URL}/whatsapp/messages/send`, payload, {
                headers: {
                    'Authorization': `Bearer ${WACHAP_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`✅ Message envoyé avec succès à ${phone}`);
            
            // Règle de Sécurité : Pause de 2 à 3 secondes pour éviter le blocage anti-spam WhatsApp
            await new Promise(resolve => setTimeout(resolve, 2500));
        } catch (error) {
            console.error(`❌ Échec de l'envoi à ${phone}:`, error.response ? JSON.stringify(error.response.data) : error.message);
        }
    }
    console.log('🎉 Campagne terminée.');
}

// --- CONFIGURATION DE LA CAMPAGNE ---
// Insère ici les numéros de tes clients (format international, sans le symbole +)
const listeContacts = [
    '237674246355', // Ton numéro pour tester
    // '2376XXXXXXXX'
];

// Le message de relance ou de promotion (le copywriting)
const messagePromotionnel = `📚 *Offre Spéciale BoomBooks* 🚀\n\nBonjour !\nDécouvrez les meilleures stratégies pour développer votre mindset d'entrepreneur.\n\n👉 Accédez à notre catalogue ici : https://app.chariow.com/stores/store_btsva9ayvha4/home`;

// Lancement du script
sendBroadcast(listeContacts, messagePromotionnel);
