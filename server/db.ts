import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Connexion PostgreSQL via Neon (serverless HTTP — aucune compilation native requise)
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    '❌ DATABASE_URL manquante. Ajoutez la variable d\'environnement DATABASE_URL (Neon PostgreSQL).\n' +
    'Exemple: postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require'
  );
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

console.log('✅ Base de données PostgreSQL (Neon) connectée');
