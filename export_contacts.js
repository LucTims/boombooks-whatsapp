require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const WACHAP_API_KEY = process.env.WACHAP_API_KEY;
const ACCOUNT_ID = '7a7c0ee3-f247-412e-a0fc-93749c11123f';
const API_BASE_URL = 'https://api.wachap.com/v1';

async function exportContacts() {
    console.log('🔄 Récupération de la liste des contacts WaChap...');
    
    try {
        const payload = { accountId: ACCOUNT_ID };
        
        const response = await axios.post(`${API_BASE_URL}/whatsapp/contacts/list`, payload, {
            headers: {
                'Authorization': `Bearer ${WACHAP_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Supposons que l'API retourne un tableau dans response.data.contacts (à ajuster selon la réponse réelle)
        const contacts = response.data.contacts || response.data.data || response.data;

        if (!Array.isArray(contacts)) {
            console.error('❌ Format de réponse inattendu:', JSON.stringify(contacts).slice(0, 100));
            return;
        }

        console.log(`✅ ${contacts.length} contacts trouvés. Création du fichier CSV...`);

        // Création de l'en-tête CSV
        let csvContent = 'Nom;Numero_WhatsApp;Type\n';

        contacts.forEach(contact => {
            // Nettoyage basique des données
            const name = (contact.name || contact.pushName || 'Inconnu').replace(/;/g, ',');
            
            // Log de debug pour comprendre la structure
            // console.log(contact); 

            // Tentative de récupération du numéro selon les structures possibles de l'API WaChap
            let phone = '';
            if (contact.phoneNumber) phone = contact.phoneNumber;
            else if (contact.phone) phone = contact.phone;
            else if (contact.jid) phone = contact.jid.split('@')[0];
            else if (typeof contact.id === 'string') phone = contact.id.split('@')[0];
            else if (contact.id && contact.id.user) phone = contact.id.user;

            phone = phone.replace(/\D/g, ''); // Garder uniquement les chiffres

            const type = (contact.isGroup || (contact.id && contact.id.server === 'g.us')) ? 'Groupe' : 'Contact';
            
            if (type === 'Contact' && phone && phone.length > 5) {
                csvContent += `"${name}";${phone};${type}\n`;
            }
        });

        // Sauvegarde sur le disque
        fs.writeFileSync('contacts_boombooks.csv', csvContent, 'utf8');
        console.log('🎉 Fichier "contacts_boombooks.csv" généré avec succès.');

    } catch (error) {
        console.error('❌ Erreur lors de la récupération des contacts:', error.response ? JSON.stringify(error.response.data) : error.message);
    }
}

exportContacts();
