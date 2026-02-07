import pg from 'pg';

// IP IPv6 trouvée par nslookup
const host = "2a05:d018:135e:169b:9ccc:d981:87d5:bf82";
const user = "postgres";
const pass = "tCSvv5l7RKZ4jy2i";

async function testIPv6() {
    console.log("🔍 Test connexion IPv6 directe...");
    // Note: IPv6 doit être entre crochets [] dans l'URL
    const url = `postgresql://${user}:${pass}@[${host}]:5432/postgres`;

    const client = new pg.Client({
        connectionString: url,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    try {
        await client.connect();
        console.log("✅ CONNEXION IPv6 RÉUSSIE !");
        await client.end();
    } catch (err) {
        console.log(`❌ ÉCHEC IPv6: ${err.message}`);
        // console.log(err);
    }
}

testIPv6();
