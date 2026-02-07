import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.resolve(process.cwd(), 'data', 'sqlite.db');
const db = new Database(dbPath);

console.log("📥 Importation des menus ANAROS...");

const data = [
    {
        category: "Onglerie",
        services: [
            { name: "Vernis semi permanent mains", price: 3000, duration: 45 },
            { name: "Vernis semi permanent pieds", price: 3500, duration: 45 },
            { name: "Gel mains", price: 3500, duration: 90 },
            { name: "Gel pieds", price: 4000, duration: 90 },
            { name: "Capsules", price: 4500, duration: 90 },
            { name: "Extension chablon", price: 6000, duration: 120 },
            { name: "Remplissage", price: 3500, duration: 90 },
            { name: "Réparation ongle vsp", price: 200, duration: 15 },
            { name: "Réparation ongle gel", price: 300, duration: 15 },
            { name: "French ou Baby-boomer", price: 1000, duration: 30 },
        ]
    },
    {
        category: "Manucure",
        services: [
            { name: "Manucure Thuya", price: 3500, duration: 45 },
            { name: "Manucure à la paraffine", price: 4000, duration: 60 },
        ]
    },
    {
        category: "Pédicure",
        services: [
            { name: "Pédicure Thuya", price: 4500, duration: 60 },
            { name: "Pédicure complète à la paraffine", price: 5000, duration: 90 },
            { name: "Peeling pieds", price: 6500, duration: 90 },
        ]
    },
    {
        category: "Coiffures",
        services: [
            { name: "Coiffure enfant", price: 2500, duration: 30 },
            { name: "Coiffure simple", price: 5000, duration: 45 },
            { name: "Coiffure semi travaillée", price: 8000, duration: 60 },
            { name: "Coiffure travaillée", price: 12000, duration: 90 },
            { name: "Coiffure mariée", price: 15000, duration: 180 },
        ]
    },
    {
        category: "Maquillages",
        services: [
            { name: "Maquillage jour", price: 4500, duration: 45 },
            { name: "Maquillage soirée", price: 6000, duration: 60 },
            { name: "Maquillage mariée", price: 10000, duration: 120 },
            { name: "Faux cils", price: 1000, duration: 15 },
        ]
    },
    {
        category: "Soins Du Visage (Thalgo)",
        services: [
            { name: "Beauty flash visage et yeux", price: 4000, duration: 30 },
            { name: "Soin marin (3 algues)", price: 6000, duration: 60 },
            { name: "Rituel source marine", price: 6500, duration: 60 },
            { name: "Rituel cold cream (Sèche/Sensible)", price: 6500, duration: 60 },
            { name: "Soin combleur hyaluronique", price: 9500, duration: 75 },
            { name: "Soin silicium super lift", price: 10500, duration: 90 },
            { name: "Cure Peeling grade 1/2/3", price: 9500, duration: 60 },
        ]
    },
    {
        category: "Soins Du Visage (Esthemax)",
        services: [
            { name: "Egyptian rose / Hyaluronic Acid", price: 15000, duration: 60 },
            { name: "Illuminating orange / Brightening", price: 15000, duration: 60 },
            { name: "Antioxidant Goji / Spot diminishing", price: 15000, duration: 60 },
            { name: "Blue Glacier / Australian Placenta", price: 15000, duration: 60 },
            { name: "Resilience Caviar / Youthful Elixir", price: 20000, duration: 90 },
        ]
    },
    {
        category: "Hydrafacial",
        services: [
            { name: "Hydraskin coréen", price: 15000, duration: 60 },
            { name: "Hydraskin esthemax", price: 20000, duration: 90 },
        ]
    },
    {
        category: "Formules Hammam",
        services: [
            { name: "Rituel Traditionnel", price: 2800, duration: 60 },
            { name: "Rituel Royal", price: 3800, duration: 90 },
            { name: "Rituel Impérial", price: 4800, duration: 120 },
            { name: "Rituel Sultana", price: 7000, duration: 150 },
        ]
    }
];

// Nettoyage optionnel si vous voulez repartir à zéro (décommentez si besoin)
// db.prepare("DELETE FROM services").run();
// db.prepare("DELETE FROM services_categories").run();

for (const group of data) {
    // 1. Créer ou récupérer la catégorie
    db.prepare("INSERT OR IGNORE INTO services_categories (name) VALUES (?)").run(group.category);
    const catRow: any = db.prepare("SELECT id FROM services_categories WHERE name = ?").get(group.category);
    const categoryId = catRow.id;

    // 2. Insérer les services
    for (const s of group.services) {
        db.prepare(`
      INSERT OR IGNORE INTO services (id, category_id, name, price, duration)
      VALUES (?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), categoryId, s.name, s.price, s.duration);
    }
}

db.close();
console.log("✅ Toutes les informations ont été ajoutées avec succès !");
