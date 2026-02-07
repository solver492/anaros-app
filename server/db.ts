import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';
import path from 'path';

// Chemin vers le fichier SQLite local
const sqlitePath = path.resolve(process.cwd(), 'data', 'sqlite.db');

// Initialisation de la base SQLite
const sqlite = new Database(sqlitePath);

// Configuration de Drizzle avec SQLite
export const db = drizzle(sqlite, { schema });

console.log(`✅ Base de données SQLite initialisée à : ${sqlitePath}`);
