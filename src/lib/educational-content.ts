export const educationalContent = {
    fundamentos: [
        {
            id: "o-que-sao-fundos",
            title: "O que são Fundos de Investimento?",
            category: "Fundamentos",
            summary: "Entenda como funcionam os fundos e porque eles podem ser uma boa opção.",
            content: `
# O que são Fundos de Investimento?

Fundos de investimento são uma forma coletiva de investir. Diversos investidores aplicam recursos em uma mesma carteira, gerida por um gestor profissional.

## Vantagens dos Fundos

- **Gestão Profissional**: Seu dinheiro é gerido por especialistas
- **Diversificação**: Acesso a diversos ativos com um único investimento
- **Liquidez**: Facilidade para resgatar seu dinheiro
- **Acessibilidade**: Invista em ativos que sozinho seria difícil acessar

## Como Funciona?

Quando você investe em um fundo, você compra "cotas". O valor da cota oscila conforme o desempenho dos ativos do fundo.

**Exemplo prático**: Se você investe R$ 1.000 em um fundo cuja cota vale R$ 10, você terá 100 cotas. Se a cota valorizar para R$ 11, seu investimento valerá R$ 1.100.
      `,
        },
        {
            id: "tipos-de-fundos",
            title: "Tipos de Fundos",
            category: "Fundamentos",
            summary: "Conheça as principais categorias de fundos disponíveis no mercado.",
            content: `
# Tipos de Fundos de Investimento

Existem diversos tipos de fundos, cada um com características específicas de risco e retorno.

## Renda Fixa

Investem em títulos de dívida (CDB, Tesouro Direto, debêntures). Menor risco, retorno mais previsível.

**Ideal para**: Reserva de emergência e objetivos de curto prazo.

## Multimercado

Podem investir em diversos ativos (ações, renda fixa, câmbio). Flexibilidade para buscar rentabilidade.

**Ideal para**: Diversificação e busca por retornos acima da renda fixa.

## Ações

Investem principalmente em ações da Bolsa de Valores. Maior potencial de retorno, mas também maior risco.

**Ideal para**: Objetivos de longo prazo (10+ anos).

## Internacionais

Investem em ativos no exterior. Proteção cambial e acesso a mercados desenvolvidos.

**Ideal para**: Diversificação global.
      `,
        },
    ],
    metricas: [
        {
            id: "indice-sharpe",
            title: "Índice Sharpe Explicado",
            category: "Métricas",
            summary: "Aprenda a avaliar o retorno ajustado ao risco dos seus investimentos.",
            content: `
# Índice Sharpe: Retorno Ajustado ao Risco

O Índice Sharpe mede quanto retorno você está ganhando para cada unidade de risco assumido.

## Fórmula

\`\`\`
Sharpe = (Retorno do Fundo - Taxa Livre de Risco) / Volatilidade
\`\`\`

## Interpretação

- **Sharpe > 1**: Bom retorn o ajustado ao risco
- **Sharpe > 2**: Excelente retorno
- **Sharpe < 1**: Retorno pode não compensar o risco

## Exemplo Prático

**Fundo A**: Retorno 15%, Volatilidade 10% → Sharpe = 1.5  
**Fundo B**: Retorno 20%, Volatilidade 20% → Sharpe = 1.0

Mesmo com retorno maior, o Fundo B tem Sharpe menor, pois assume muito mais risco para atingir esse retorno.
      `,
        },
        {
            id: "volatilidade",
            title: "Volatilidade: Medindo o Risco",
            category: "Métricas",
            summary: "Compreenda como medir e interpretar a volatilidade dos seus investimentos.",
            content: `
# Volatilidade: O Termômetro do Risco

Volatilidade mede o quanto o preço de um ativo oscila ao longo do tempo. Quanto mais volátil, maior o risco.

## Como Funciona?

Imagine dois investimentos:

**Investimento A**: Oscila entre +2% e -2% por mês  
**Investimento B**: Oscila entre +10% e -10% por mês

O investimento B é muito mais volátil, logo mais arriscado.

## Por Que Importa?

- Alta volatilidade = Maior chance de ganhos E perdas
- Baixa volatile = Mais previsibilidade

## Dica Importante

Volatilidade não é necessariamente ruim. Para objetivos de longo prazo (10+ anos), você pode tolerar mais volatilidade em troca de maior retorno potencial.
      `,
        },
    ],
    carteiras: [
        {
            id: "diversificacao",
            title: "O Poder da Diversificação",
            category: "Carteiras",
            summary: "Descubra por que não colocar todos os ovos na mesma cesta.",
            content: `
# Diversificação: Reduzindo Riscos

"Don't put all your eggs in one basket" (Não coloque todos os ovos na mesma cesta) - Ditado popular

## O Princípio

Ao diversificar, você dilui os riscos. Se um ativo perde valor, outros podem compensar.

## Tipos de Diversificação

1. **Por classe de ativo**: Renda Fixa + Ações + Internacional
2. **Por setor**: Tecnologia + Commodities + Consumo
3. **Por geografia**: Brasil + EUA + Emergentes

## Exemplo Real

**Carteira Concentrada**: 100% em uma única ação  
**Resultado**: Se a empresa falir, você perde tudo

**Carteira Diversificada**: 10 ações diferentes  
**Resultado**: Se uma empresa falir, você perde apenas 10%

## Regra de Ouro

Nunca tenha mais de 5-10% do seu patrimônio em um único ativo.
      `,
        },
    ],
}
