import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.resolve(process.cwd(), 'data', 'sqlite.db');
const db = new Database(dbPath);

console.log("👥 Ajout des employés et de leurs compétences...");

const staffList = [
    { name: "Karima", categories: ["Coiffures"] },
    { name: "Malika", categories: ["Coiffures"] },
    { name: "Farida", categories: ["Coiffures"] },
    { name: "Meriem", categories: ["Coiffures"] },
    { name: "Houda", categories: ["Coiffures"] },
    { name: "Samira", categories: ["Coiffures", "Formules Hammam"] },
    { name: "Dounia", categories: ["Onglerie", "Manucure", "Pédicure"] },
    { name: "Safa", categories: ["Onglerie", "Manucure", "Pédicure"] },
    { name: "Chanez", categories: ["Onglerie", "Manucure", "Pédicure"] },
    { name: "Sara", categories: ["Maquillages"] },
    { name: "Saliha", categories: ["Soins Du Visage (Thalgo)", "Soins Du Visage (Esthemax)", "Hydrafacial"] },
    { name: "Amel", categories: ["Soins Du Visage (Thalgo)", "Soins Du Visage (Esthemax)", "Hydrafacial"] },
];

for (const staff of staffList) {
    const email = `${staff.name.toLowerCase()}@anaros.com`;
    const profileId = crypto.randomUUID();

    // 1. Créer le profil s'il n'existe pas
    db.prepare(`
    INSERT OR IGNORE INTO profiles (id, first_name, last_name, email, password, role, color_code)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
        profileId,
        staff.name,
        "Anaros", // Nom de famille par défaut
        email,
        "anaros2026",
        "staff",
        `#${Math.floor(Math.random() * 16777215).toString(16)}` // Couleur aléatoire pour l'agenda
    );

    // Récupérer l'ID (soit le nouveau, soit l'existant)
    const profileRow: any = db.prepare("SELECT id FROM profiles WHERE email = ?").get(email);
    const currentProfileId = profileRow.id;

    // 2. Lier aux catégories
    for (const catName of staff.categories) {
        // S'assurer que la catégorie existe
        db.prepare("INSERT OR IGNORE INTO services_categories (name) VALUES (?)").run(catName);
        const catRow: any = db.prepare("SELECT id FROM services_categories WHERE name = ?").get(catName);

        // Ajouter la compétence
        db.prepare("INSERT OR IGNORE INTO staff_skills (profile_id, category_id) VALUES (?, ?)")
            .run(currentProfileId, catRow.id);
    }
}

db.close();
console.log("✅ Tous les employés ont été ajoutés et configurés !");
