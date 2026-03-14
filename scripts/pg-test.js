const { Client } = require('pg')

async function testConnection() {
    const client = new Client({
        connectionString: 'postgresql://postgres.sijgmjffsgnhnjppzmbg:pbD1tFJBrIVwodcm@aws-1-sa-east-1.pooler.supabase.com:5432/postgres',
    })

    try {
        await client.connect()
        console.log("SUCESSO: Conectado ao banco de dados com Pg nativo!")
        const res = await client.query('SELECT NOW()')
        console.log("Hora no banco:", res.rows[0].now)
    } catch (err) {
        console.error("FALHA na conexão:", err.message)
    } finally {
        await client.end()
    }
}

testConnection()
