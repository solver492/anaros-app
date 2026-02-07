import pg from 'pg';

const configs = [
    // 1. Config actuelle (Session Pooler)
    {
        name: "AWS Pooler - Port 5432",
        connectionString: "postgresql://postgres.svfcdgzbvyibknofahsv:tCSvv5l7RKZ4jy2i@aws-1-eu-central-1.pooler.supabase.com:5432/postgres",
        ssl: { rejectUnauthorized: false }
    },
    // 2. Config Transaction Pooler
    {
        name: "AWS Pooler - Port 6543",
        connectionString: "postgresql://postgres.svfcdgzbvyibknofahsv:tCSvv5l7RKZ4jy2i@aws-1-eu-central-1.pooler.supabase.com:6543/postgres",
        ssl: { rejectUnauthorized: false }
    },
    // 3. Config Directe (DNS standard)
    {
        name: "Direct DNS - db.Ref.supabase.co",
        connectionString: "postgresql://postgres:tCSvv5l7RKZ4jy2i@db.svfcdgzbvyibknofahsv.supabase.co:5432/postgres",
        ssl: { rejectUnauthorized: false }
    },
    // 4. Config Alternative (User simple sur AWS)
    {
        name: "AWS Pooler - User simple",
        connectionString: "postgresql://postgres:tCSvv5l7RKZ4jy2i@aws-1-eu-central-1.pooler.supabase.com:5432/postgres",
        ssl: { rejectUnauthorized: false }
    }
];

async function testConnection(config) {
    console.log(`\n--- Test: ${config.name} ---`);
    console.log(`URL: ${config.connectionString.replace(/:[^:@]+@/, ':****@')}`);

    const client = new pg.Client(config);

    try {
        await client.connect();
        console.log("✅ CONNEXION RÉUSSIE !");
        const res = await client.query('SELECT NOW(), version()');
        console.log("📅 Serveur Time:", res.rows[0].now);
        console.log("ℹ️ Version:", res.rows[0].version);
        await client.end();
        return true;
    } catch (err) {
        console.log("❌ ÉCHEC:");
        console.log(`   Code: ${err.code}`);
        console.log(`   Message: ${err.message}`);
        if (err.hint) console.log(`   Hint: ${err.hint}`);
        return false;
    }
}

async function runTests() {
    console.log("🔍 Démarrage des tests de diagnostic DB...");

    for (const config of configs) {
        await testConnection(config);
    }

    console.log("\n🏁 Tests terminés.");
}

runTests();
