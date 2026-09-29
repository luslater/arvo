-- =====================================================================
-- BLINDAGEM DE BANCO DE DADOS SUPABASE / POSTGRESQL (ARVO PLATFORM)
-- =====================================================================
-- O Prisma conecta diretamente ao PostgreSQL via pooler (porta 6543)
-- como usuário 'postgres' (que possui BYPASSRLS por padrão).
-- 
-- Para proteger o banco contra vazamento via API REST pública do Supabase
-- (PostgREST / anon key exposta no frontend), execute os comandos abaixo
-- no SQL Editor do Dashboard do Supabase:
-- =====================================================================

-- 1. HABILITAR ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS DO PRISMA
-- Sem políticas para 'anon', qualquer chamada via PostgREST/anon key retornará vazio ou negado.
-- O Prisma (como 'postgres') continuará lendo e escrevendo normalmente sem qualquer quebra!

ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Asset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "FinancialPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "UsedToken" ENABLE ROW LEVEL SECURITY;

-- 2. REVOGAR ACESSO DAS ROLES PÚBLICAS DO SUPABASE (anon e authenticated)
-- Como o frontend da ARVO não consome o Supabase Client diretamente (tudo passa
-- pelas rotas /api do Next.js via Prisma), as roles anon e authenticated NÃO
-- precisam de permissão direta nas tabelas.

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;

-- Garante que futuras tabelas também não sejam concedidas automaticamente para anon
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;

-- =====================================================================
-- 3. (OPCIONAL/RECOMENDADO) USUÁRIO DEDICADO COM MENOS PRIVILÉGIOS (LEAST PRIVILEGE)
-- Se desejar que a aplicação não use o superuser postgres:
-- =====================================================================
-- CREATE ROLE app_user WITH LOGIN PASSWORD 'insira_uma_senha_forte_aqui';
-- GRANT CONNECT ON DATABASE postgres TO app_user;
-- GRANT USAGE ON SCHEMA public TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
-- ALTER TABLE "User" FORCE ROW LEVEL SECURITY;

