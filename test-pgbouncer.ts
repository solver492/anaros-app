import pg from 'pg';

const HOST = "aws-1-eu-central-1.pooler.supabase.com";
const USER = "postgres.svfcdgzbvyibknofahsv";
const PASS = "tCSvv5l7RKZ4jy2i";

async function testTransactionPooler() {
    console.log("🔍 Test Transaction Pooler (Port 6543) avec PgBouncer mode...");

    // Note: Port 6543 est pour le mode Transaction
    const connectionString = `postgresql://${USER}:${PASS}@${HOST}:6543/postgres?sslmode=require`;

    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("✅ SUCCÈS !!! Le Transaction Pooler fonctionne !");
        await client.end();
        return true;
    } catch (err) {
        console.log(`❌ ÉCHEC: ${err.message} (${err.code})`);
    }
}

testTransactionPooler();
