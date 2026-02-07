import pg from 'pg';

const PROJECT_ID = "svfcdgzbvyibknofahsv";
const POOLER_HOST = "aws-1-eu-central-1.pooler.supabase.com";
const USER = `postgres.${PROJECT_ID}`;
const PASS = "tCSvv5l7RKZ4jy2i";

async function runDiagnostic() {
    console.log("🔍 DIAGNOSTIC DE CONNEXION SUPABASE");
    console.log(`Host: ${POOLER_HOST}`);
    console.log(`User: ${USER}`);

    // Test 1: Connexion avec mot de passe actuel
    console.log("\n1️⃣  Test avec le mot de passe actuel...");
    await tryConnect(POOLER_HOST, USER, PASS);

    // Test 2: Connexion avec un FAUX mot de passe
    console.log("\n2️⃣  Test avec un FAUX mot de passe (pour vérifier l'utilisateur)...");
    await tryConnect(POOLER_HOST, USER, "wrongpassword123");
}

async function tryConnect(host, user, pass) {
    const client = new pg.Client({
        connectionString: `postgresql://${user}:${pass}@${host}:5432/postgres`,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    try {
        await client.connect();
        console.log("✅ SUCCÈS : Connexion réussie !");
        await client.end();
    } catch (err) {
        console.log(`❌ ERREUR : ${err.message}`);
        console.log(`   Code: ${err.code}`);

        if (err.code === '28P01') {
            console.log("   -> CONCLUSION : Le serveur est BON, mais le mot de passe est INCORRECT.");
        } else if (err.code === 'XX000') {
            console.log("   -> CONCLUSION : L'utilisateur ou le projet est INTROUVABLE sur ce serveur.");
        } else if (err.code === 'ENOTFOUND') {
            console.log("   -> CONCLUSION : L'adresse du serveur est INTROUVABLE (DNS).");
        }
    }
}

runDiagnostic();
