import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.resolve(process.cwd(), 'data', 'sqlite.db');
const db = new Database(dbPath);

console.log("🛠️ Création des tables SQLite...");

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff',
    color_code TEXT DEFAULT '#3B82F6',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    client_id TEXT NOT NULL,
    staff_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS staff_skills (
    profile_id TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (profile_id, category_id)
  );
`);

console.log("✅ Tables créées avec succès.");

// Insertion de l'admin par défaut
try {
    db.prepare(`
    INSERT OR IGNORE INTO profiles (id, first_name, last_name, email, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), 'Admin', 'Anaros', 'admin@anaros.com', 'admin123', 'superadmin');

    db.prepare(`
    INSERT OR IGNORE INTO profiles (id, first_name, last_name, email, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), 'Super', 'Admin', 'nouveau@admin.com', 'motdepasse123', 'superadmin');

    console.log("👤 Utilisateurs admin créés (admin@anaros.com / nouveau@admin.com).");
} catch (e) {
    console.log("ℹ️ L'admin existe déjà ou erreur d'insertion.");
}

// Quelques catégories par défaut
try {
    const categories = ['Coiffure', 'Esthétique', 'Massage', 'Manucure'];
    for (const cat of categories) {
        db.prepare(`INSERT OR IGNORE INTO services_categories (name) VALUES (?)`).run(cat);
    }
    console.log("📅 Catégories initialisées.");
} catch (e) { }

db.close();
console.log("🚀 SQLite est prêt !");
