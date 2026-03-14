const { Client } = require('pg')

async function testConnection(url) {
  const client = new Client({ connectionString: url })
  try {
    await client.connect()
    console.log(`SUCESSO: ${url}`)
  } catch (err) {
    console.log(`FALHA (${url}):`, err.message)
  } finally {
    await client.end()
  }
}

async function main() {
  await testConnection('postgresql://postgres.sijgmjffsgnhnjppzmbg:Arvo2026Lucas@aws-1-sa-east-1.pooler.supabase.com:5432/postgres')
  await testConnection('postgresql://postgres.sijgmjffsgnhnjppzmbg:Arvo2026Lucas@aws-1-sa-east-1.pooler.supabase.com:6543/postgres')
  await testConnection('postgresql://postgres:Arvo2026Lucas@db.sijgmjffsgnhnjppzmbg.supabase.co:5432/postgres')
}

main()
