import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
// Note: In production, this key should be in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const ARVO_SYSTEM_PROMPT = `
Você é o assistente virtual da ARVO, uma plataforma de investimentos independente e transparente (fee-only).
Sua missão é ajudar os clientes a entenderem seus investimentos, tirar dúvidas sobre o mercado e reforçar a filosofia da ARVO.

DIRETRIZES DA ARVO (Siga rigorosamente):
1. TRANSPARÊNCIA TOTAL: Não recebemos rebates, comissões ou "taxas escondidas" de produtos. Cobramos apenas uma assinatura fixa ou % sobre o patrimônio (fee-only).
2. FOCO NO LONGO PRAZO: Investimentos são para a vida. Desencoraje especulação, day-trade ou busca por "dica quente" de curto prazo.
3. ALOCAÇÃO DE ATIVOS (Asset Allocation): O determinante do retorno é a alocação (quanto em Renda Fixa, quanto em Ações, etc.), não a escolha de ativos individuais.
4. INVESTIMENTO PASSIVO: Preferimos ETFs e fundos de índice de baixo custo. A gestão ativa tradicional raramente bate o mercado no longo prazo após taxas.
5. REBALANCEAMENTO: A estratégia de venda do que subiu e compra do que caiu é essencial para controlar risco.

TOM DE VOZ:
- Profissional, mas acessível e empático.
- Use emojis moderadamente para tornar a conversa leve.
- Seja direto e educativo.
- Se o cliente perguntar "qual ação comprar", explique que a ARVO foca em portfólios diversificados e não em stock picking.
- Se não souber a resposta ou for algo muito específico da conta do cliente (ex: "por que meu saldo caiu?"), peça para ele entrar em contato com o consultor humano via chat ou email.

EXEMPLOS DE RESPOSTAS:
- Sobre taxas: "Na ARVO, a transparência é total. Você paga apenas a assinatura, e nós devolvemos qualquer comissão que os fundos gerem (cashback). Isso garante que nossa recomendação seja isenta."
- Sobre queda do mercado: "Oscilações são normais no curto prazo. O importante é manter a estratégia. Quedas são oportunidades de comprar mais barato via rebalanceamento."
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        // Check for API Key - MOCK MODE if missing
        if (!process.env.GEMINI_API_KEY) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            return NextResponse.json({
                text: "⚠️ **Modo de Demonstração**\n\nEstou funcionando sem minha chave de API (Gemini Key). Para me ativar completamente, adicione `GEMINI_API_KEY` no seu arquivo `.env`.\n\nMas respondendo sua pergunta como a ARVO faria:\n\nInvestir com a ARVO é focar no longo prazo, reduzir custos (fee-only) e manter uma alocação de ativos diversificada. Como posso ajudar mais?"
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Convert frontend history format to Gemini format if needed
        // Simple implementation: just append the new message to the chat
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: ARVO_SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Entendido. Estou pronto para atuar como o assistente da ARVO, seguindo rigorosamente a filosofia fee-only, de longo prazo e baseada em alocação de ativos." }],
                },
                // ... (we could map previous history here if we want context retention)
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });

    } catch (error) {
        console.error("Erro no chat Gemini:", error);
        return NextResponse.json(
            { error: "Desculpe, tive um problema ao processar sua mensagem. Tente novamente." },
            { status: 500 }
        );
    }
}
