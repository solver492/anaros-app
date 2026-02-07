import pg from 'pg';

const PROJECT_ID = "svfcdgzbvyibknofahsv";
const USER = `postgres.${PROJECT_ID}`;
// Votre mot de passe (si on ne peut pas se connecter avec, on aura au moins "Password incorrect" au lieu de "Tenant not found")
const PASS = "tCSvv5l7RKZ4jy2i";

const potentialHosts = [
    "aws-0-eu-west-1.pooler.supabase.com",   // Irlande (Standard)
    "aws-0-eu-central-1.pooler.supabase.com", // Francfort (Standard)
    "aws-0-eu-west-2.pooler.supabase.com",   // Londres
    "aws-0-eu-west-3.pooler.supabase.com",   // Paris
    "pooler.supabase.com"                    // Générique
];

async function scanHosts() {
    console.log("🔍 SCANNING POOLERS SUPABASE...");

    for (const host of potentialHosts) {
        console.log(`\nTesting Host: ${host}...`);
        await tryConnect(host);
    }
}

async function tryConnect(host) {
    const client = new pg.Client({
        connectionString: `postgresql://${USER}:${PASS}@${host}:5432/postgres`, // Session Mode (5432)
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3000
    });

    try {
        await client.connect();
        console.log(`✅ SUCCÈS !!! Le bon serveur est: ${host}`);
        await client.end();
        return true;
    } catch (err) {
        if (err.code === '28P01') {
            console.log(`✅ SUCCÈS !!! Le bon serveur est: ${host} (Mais mot de passe incorrect)`);
        } else {
            console.log(`❌ Échec: ${err.message} (${err.code})`);
        }
    }
}

scanHosts();
