const { Client } = require('pg');
require('dotenv').config();

async function addMfaColumns() {
  // Use direct port 5432 to bypass pgbouncer if needed, but 6543 might support DDL if transaction mode is fine for basic ALTER TABLE.
  // Actually, Supabase pgbouncer supports ALTER TABLE.
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to DB.");

    await client.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mfaEnabled" BOOLEAN NOT NULL DEFAULT false;');
    console.log("Added mfaEnabled column.");

    await client.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mfaSecret" TEXT;');
    console.log("Added mfaSecret column.");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

addMfaColumns();
