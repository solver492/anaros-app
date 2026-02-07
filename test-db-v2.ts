import pg from 'pg';

const user = "postgres.svfcdgzbvyibknofahsv";
const appPass = "tCSvv5l7RKZ4jy2i";

const poolers = [
    // Pooler de votre capture (Francfort?)
    "aws-1-eu-central-1.pooler.supabase.com",
    // Poolers potentiels Eu-West-1 (Irlande)
    "aws-0-eu-west-1.pooler.supabase.com",
    "aws-0-eu-central-1.pooler.supabase.com",
    "eu-west-1.pooler.supabase.com",
    "pooler.supabase.com"
];

async function testConnection(host) {
    const url = `postgresql://${user}:${appPass}@${host}:5432/postgres`;
    console.log(`\n--- Test Host: ${host} ---`);

    const client = new pg.Client({
        connectionString: url,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    try {
        await client.connect();
        console.log("✅ CONNEXION RÉUSSIE ! C'est le bon ! 🎉");
        await client.end();
        return url;
    } catch (err) {
        console.log(`❌ ÉCHEC: ${err.code || err.message}`);
        return null;
    }
}

async function runTests() {
    console.log("🔍 Recherche du bon Pooler IPv4...");

    for (const host of poolers) {
        const successUrl = await testConnection(host);
        if (successUrl) {
            console.log("\n✅ SOLUTION TROUVÉE !");
            console.log(`Utilisez cette URL: ${successUrl}`);
            break;
        }
    }
}

runTests();
