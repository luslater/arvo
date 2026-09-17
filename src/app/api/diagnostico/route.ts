import {appendFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
export const runtime='nodejs';
const schema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(254),
  phone: z.string().trim().min(8, "Telefone inválido").max(25),
  marketingConsent: z.boolean().default(true),
  profile: z.string().optional(),
  portfolioName: z.string().optional(),
  target: z.number().optional(),
  months: z.number().nullable().optional(),
  contactStatus: z.enum(['NOVO', 'EM_CONTATO', 'FECHADO', 'SEM_INTERESSE']).default('NOVO'),
  input: z.object({
    initial: z.number().finite().min(0).max(1e9),
    monthly: z.number().finite().min(0).max(1e7),
    income: z.number().finite().positive().max(1e7),
    inflation: z.number().min(0).max(0.2).default(0.0514),
    withdrawal: z.number().min(0.01).max(0.1).default(0.04),
    indexed: z.boolean().default(true)
  })
});

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin && process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Origem inválida' }, { status: 403 });
  }

  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return Response.json({ error: 'Formato inválido' }, { status: 415 });
  }

  try {
    const raw = await request.text();
    if (raw.length > 8000) {
      return Response.json({ error: 'Dados excedem o limite' }, { status: 413 });
    }

    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return Response.json({ error: 'Confira os campos do cadastro', details: parsed.error.issues }, { status: 400 });
    }

    const leadId = randomUUID();
    const leadData = {
      id: leadId,
      createdAt: new Date().toISOString(),
      source: 'diagnostico-gratuito',
      privacyVersion: '2026-09-11',
      ...parsed.data
    };

    // Store in persistent leads folder with /tmp fallback
    let folder = process.env.ARVO_LEADS_DIRECTORY || path.join(process.cwd(), 'data', 'diagnostic-leads');
    try {
      await mkdir(folder, { recursive: true, mode: 0o700 });
      await appendFile(path.join(folder, 'leads.jsonl'), JSON.stringify(leadData) + '\n', { mode: 0o600 });
    } catch {
      // Fallback for restricted / serverless disk environments
      folder = path.join('/tmp', 'diagnostic-leads');
      await mkdir(folder, { recursive: true });
      await appendFile(path.join(folder, 'leads.jsonl'), JSON.stringify(leadData) + '\n');
    }

    return Response.json({ ok: true, id: leadId }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Não foi possível concluir o cadastro' }, { status: 500 });
  }
}
