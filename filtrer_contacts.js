const fs = require('fs');

const content = fs.readFileSync('contacts_boombooks.csv', 'utf8');
const lines = content.split('\n');
const header = lines[0];
const contacts = lines.slice(1);

console.log(`📊 Total brut : ${contacts.length} lignes.`);

const filtered = contacts.filter(line => {
    if (!line.trim()) return false;
    const parts = line.split(';');
    if (parts.length < 2) return false;
    
    const phone = parts[1];
    // Un numéro africain (Cameroun, Côte d'Ivoire, etc.) fait généralement entre 8 et 13 chiffres
    return phone && phone.length >= 8 && phone.length <= 15;
});

// Suppression des doublons
const unique = [...new Set(filtered)];

fs.writeFileSync('contacts_filtres.csv', header + '\n' + unique.join('\n'), 'utf8');

console.log(`✅ Filtrage terminé.`);
console.log(`📉 Doublons et numéros invalides supprimés : ${contacts.length - unique.length}`);
console.log(`🎯 Contacts prêts pour la diffusion : ${unique.length}`);
