import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'data', 'sqlite.db');
const db = new Database(dbPath);

console.log("🧹 Nettoyage des catégories vides...");

// On supprime les catégories qui n'ont aucun service lié
const result = db.prepare(`
    DELETE FROM services_categories 
    WHERE id NOT IN (SELECT DISTINCT category_id FROM services)
`).run();

console.log(`✅ ${result.changes} catégorie(s) vide(s) supprimée(s).`);

db.close();
