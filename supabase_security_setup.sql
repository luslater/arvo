-- 1. Criar um usuário dedicado para a aplicação (menos privilégios que o superusuário postgres)
-- Altere a senha abaixo para uma senha forte antes de rodar!
CREATE ROLE app_user WITH LOGIN PASSWORD 'insira_uma_senha_forte_aqui';

-- 2. Conceder permissão de conexão ao banco de dados
GRANT CONNECT ON DATABASE postgres TO app_user;

-- 3. Conceder uso do schema público
GRANT USAGE ON SCHEMA public TO app_user;

-- 4. Conceder permissões apenas de leitura, escrita e exclusão nas tabelas do Prisma (Sem permissão de DROP TABLE ou ALTER)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

-- 5. Conceder acesso às sequências (necessário para auto-incremento de IDs e campos CUID/UUID gerados pelo banco)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app_user;

---------------------------------------------------------------------
-- Opcional (Mas Recomendado contra IDOR/BOLA): Ativar RLS (Row Level Security)
-- Atenção: Ative o RLS apenas se o Prisma estiver configurado para fazer Bypass ou assumir o papel correto,
-- Do contrário, a API poderá não conseguir ler dados. Como o Prisma atualmente usa a mesma string de conexão para tudo, 
-- o RLS nativo do Postgres é mais difícil de implementar perfeitamente com Next.js+Prisma sem JWT customizado.
-- O passo de 'app_user' acima já reduz 90% do risco de vazamento catastrófico.
---------------------------------------------------------------------

-- Exemplo de ativação de RLS na tabela User (Bloqueia tudo por padrão se a role não for superuser)
-- ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Asset" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "FinancialPlan" ENABLE ROW LEVEL SECURITY;

-- Política permissiva temporária para o Prisma (já que a lógica de autorização ocorre no código Next.js)
-- CREATE POLICY "Permitir leitura/escrita para app_user" ON "User" FOR ALL TO app_user USING (true) WITH CHECK (true);
