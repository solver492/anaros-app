import pg from 'pg';

const HOST = "aws-1-eu-west-1.pooler.supabase.com";
const USER = "postgres.svfcdgzbvyibknofahsv";

// Test des deux variantes visuelles possibles
const passwords = [
    "O60v5AGhi2bc1iRq", // Lettre O
    "060v5AGhi2bc1iRq"  // Chiffre 0
];

async function runTest() {
    for (const pass of passwords) {
        console.log(`\n🔍 Test avec le pass: ${pass}`);
        const client = new pg.Client({
            connectionString: `postgresql://${USER}:${pass}@${HOST}:6543/postgres?sslmode=require`,
            ssl: { rejectUnauthorized: false }
        });

        try {
            await client.connect();
            console.log("✅ SUCCÈS !!! C'est celui-là ! 🎉");
            await client.end();
            process.exit(0);
        } catch (err) {
            console.log(`❌ ÉCHEC: ${err.message}`);
        }
    }
}

runTest();
