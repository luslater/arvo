const { Client } = require('pg')

async function testConnection(url) {
  const client = new Client({ connectionString: url })
  try {
    await client.connect()
    console.log(`SUCESSO: ${url}`)
  } catch (err) {
    console.log(`FALHA (${url.split('@')[1]}):`, err.message)
  } finally {
    await client.end()
  }
}

async function main() {
  await testConnection('postgresql://postgres.sijgmjffsgnhnjppzmbg:yv6EY9Ca5B7mpYej@aws-1-sa-east-1.pooler.supabase.com:5432/postgres')
  await testConnection('postgresql://postgres.sijgmjffsgnhnjppzmbg:xt9J4vUw5Yweo2be@aws-1-sa-east-1.pooler.supabase.com:5432/postgres')
  await testConnection('postgresql://postgres.sijgmjffsgnhnjppzmbg:pbD1tFJBrIVwodcm@aws-1-sa-east-1.pooler.supabase.com:5432/postgres')
  await testConnection('postgresql://postgres.sijgmjffsgnhnjppzmbg:Arvo2026Lucas@aws-1-sa-east-1.pooler.supabase.com:5432/postgres')
}

main()
