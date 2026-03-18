const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres:WFSkCTAuf8T1pNyb@db.sijgmjffsgnhnjppzmbg.supabase.co:5432/postgres"
  });

  try {
    await client.connect();
    console.log("Connected directly to Supabase!");
    await client.query(`ALTER TABLE "FinancialPlan" ADD COLUMN IF NOT EXISTS "currentCapital" DOUBLE PRECISION`);
    console.log("Column added successfully via Direct Database Connection!");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
