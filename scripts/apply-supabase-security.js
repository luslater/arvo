require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("❌ DATABASE_URL não encontrada no .env");
        process.exit(1);
    }

    console.log("Conectando ao banco de dados Supabase/PostgreSQL...");
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("✅ Conectado com sucesso!");

        const sqlPath = path.join(__dirname, '..', 'supabase_security_setup.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        console.log("Executando script de segurança RLS e revogação de acessos anônimos...");
        await client.query(sql);

        console.log("✅ Script de segurança executado com sucesso!");
        console.log("   - RLS habilitado nas tabelas User, Profile, Asset, FinancialPlan, etc.");
        console.log("   - Permissões da role pública 'anon' e 'authenticated' revogadas.");
        console.log("   - API PostgREST pública bloqueada contra vazamento de dados.");
    } catch (err) {
        console.error("❌ Erro ao aplicar script no banco:", err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
