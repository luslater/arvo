// Todo o texto e os dados da página inicial ficam aqui.
// Para mudar um texto, edite só este arquivo.

export const links = {
  cadastro: "/register",
  diagnostico: "/diagnostico",
  entrar: "/login",
  privacidade: "/politica-de-privacidade",
  termos: "/termos",
};

export const nav = [
  { label: "Método", href: "#metodo" },
  { label: "Carteiras", href: "#carteiras" },
  { label: "Independência", href: "#independencia" },
  { label: "Dúvidas", href: "#duvidas" },
];

export const hero = {
  eyebrow: "Planejamento financeiro independente",
  title: ["Não basta investir.", "É preciso ter um plano."],
  sub: "Planejamento financeiro completo e orientação de investimentos para quem guarda a partir de R$ 1.000 por mês ou já tem patrimônio e quer direção profissional.",
  cta: "Descobrir meu plano",
  secondary: "Ver como funciona",
  micro: "Gratuito · 5 minutos · Sem cartão",
  trust: [
    { icon: "fee", title: "Fee-only", text: "Sem comissão sobre produto" },
    { icon: "bank", title: "No seu banco", text: "Você mantém a custódia" },
    { icon: "badge", title: "Planejador CFP®", text: "Metodologia certificada" },
  ],
};

export const simulator = {
  label: "Simule agora",
  title: "Quando seu dinheiro pode trabalhar por você?",
  realRate: 0.06, // 6% a.a. acima da inflação
  withdrawalRate: 0.04, // regra dos 4%
  fields: [
    { key: "invested", label: "Quanto você já tem investido", min: 0, max: 5_000_000, step: 5_000, value: 50_000 },
    { key: "monthly", label: "Quanto investe por mês", min: 500, max: 50_000, step: 100, value: 2_000 },
    { key: "income", label: "Quanto quer ter por mês no futuro", min: 2_000, max: 60_000, step: 500, value: 5_000 },
  ],
  cta: "Receber meu mapa gratuito",
  note: "Projeção com 6% a.a. de rendimento real, acima da inflação, em valores de hoje. Não é garantia de retorno.",
};

export const method = {
  eyebrow: "Método ARVO",
  title: "Você já investe. Mas está no caminho certo?",
  sub: "Ter bons investimentos não é o mesmo que ter um plano. A ARVO responde, em quatro etapas, as perguntas que tiram o sono de quem investe.",
  cta: "Começar meu planejamento",
  steps: [
    {
      n: "01",
      question: "Onde estou hoje?",
      title: "Entenda seu momento",
      text: "Mapeamos suas finanças, identificamos o que precisa de atenção e definimos as prioridades do seu plano.",
    },
    {
      n: "02",
      question: "Quanto preciso acumular e quanto investir por mês?",
      title: "Planeje seu futuro",
      text: "Estruturamos sua aposentadoria-base e seus outros objetivos: quanto guardar, por quanto tempo e quais ajustes fazer.",
    },
    {
      n: "03",
      question: "Minha carteira faz sentido para os meus objetivos?",
      title: "Saiba onde investir",
      text: "Você recebe uma carteira com investimentos selecionados e a distribuição certa para seu perfil, seus prazos e seus objetivos.",
    },
    {
      n: "04",
      question: "Estou mais perto ou mais longe da minha independência?",
      title: "Avance com orientação",
      text: "Acompanhe o plano na plataforma e conte com a equipe para tirar dúvidas e ajustar o caminho.",
    },
  ],
};

// Resultados: ATENÇÃO — no projeto, ligar estes números à mesma fonte de dados
// do gráfico atual de "Resultado aberto" (não deixar fixo no código).
export const strategies = {
  eyebrow: "Estratégias ARVO",
  title: "Não existe a melhor carteira. Existe a certa para cada momento.",
  sub: "Quatro estratégias, do mais conservador ao mais arrojado. Com o resultado de cada uma aberto para você conferir.",
  period: "Acumulado de jan. 2023 a out. 2026",
  disclaimer: "Rentabilidade passada não representa garantia de resultados futuros.",
  cta: "Conhecer as carteiras",
  items: [
    {
      id: "abrigo",
      name: "Abrigo",
      kind: "Preservação",
      risk: 1,
      text: "Segurança e liquidez. O dinheiro que você pode precisar a qualquer momento.",
      focus: "Liquidez imediata",
      assets: ["Selic", "Renda fixa"],
      cdi: 101.37,
    },
    {
      id: "ritmo",
      name: "Ritmo",
      kind: "Equilíbrio",
      risk: 2,
      text: "O primeiro passo além do básico. Diversificação estruturada em renda fixa e inflação.",
      focus: "Diversificação em renda fixa",
      assets: ["Renda fixa", "IPCA", "Pré"],
      cdi: 114.41,
    },
    {
      id: "visao",
      name: "Visão",
      kind: "Crescimento",
      risk: 3,
      text: "Mais diversificação para buscar crescimento. Renda fixa com renda variável controlada.",
      focus: "Crescimento com controle",
      assets: ["Inflação", "Ações", "Multimercado"],
      cdi: 123.82,
    },
    {
      id: "oceano",
      name: "Oceano",
      kind: "Arrojada",
      risk: 4,
      text: "Mais exposição ao longo prazo, para quem aceita oscilações maiores em busca de retorno.",
      focus: "Longo prazo",
      assets: ["Ações", "Multimercados"],
      cdi: 146.8,
    },
  ],
};

export const independence = {
  eyebrow: "Modelo fee-only",
  title: "Independente de verdade. A ARVO só ganha da sua assinatura.",
  sub: "Nenhuma recomendação é motivada por comissão. Você sabe quanto paga e sabe quem está remunerando: a ARVO.",
  points: [
    { title: "Sem comissão por produto", text: "Nenhuma indicação é motivada por rebate ou remuneração de corretoras." },
    { title: "Sem mudar de banco ou corretora", text: "Você continua investindo onde preferir: XP, BTG, Itaú, NuInvest ou qualquer outra." },
    { title: "Patrimônio sob seu controle", text: "A ARVO orienta a estratégia. A custódia e a execução são sempre suas." },
  ],
  founder: {
    initials: "LM",
    name: "Lucas Matos, CFP®",
    role: "Fundador da ARVO",
    credentials: ["CFP®", "CPA-20", "ANCORD", "Mestre em Engenharia"],
    quote: "Muita gente escolhe o investimento antes de saber o que precisa fazer com o dinheiro. Nós fazemos o contrário: primeiro o plano, depois a estratégia.",
    // CONFIRMAR antes de publicar
    stats: [
      { value: "+200", label: "pessoas orientadas" },
      { value: "R$ 200 mi+", label: "assessorados na carreira" },
    ],
  },
};

export const faq = {
  eyebrow: "Dúvidas frequentes",
  title: "Antes de decidir.",
  items: [
    {
      q: "Preciso tirar meus investimentos do meu banco?",
      a: "Não. Você continua investindo no banco ou corretora que preferir e mantém o controle do seu patrimônio. A ARVO ajuda a organizar a estratégia; você decide e executa seus investimentos onde quiser.",
    },
    {
      q: "A ARVO investe o dinheiro por mim?",
      a: "Não. A ARVO não recebe, movimenta ou mantém a custódia do seu dinheiro. Seus investimentos continuam no seu banco ou corretora e todas as decisões e movimentações permanecem sob seu controle.",
    },
    {
      q: "Como a ARVO ganha dinheiro?",
      a: "Pela assinatura dos nossos clientes. A ARVO não depende de comissão sobre os produtos que você investe. Isso permite construir nossa relação com um objetivo simples: ajudar você a tomar decisões financeiras melhores, sem precisar empurrar um produto.",
    },
    {
      q: "Posso conhecer antes de pagar?",
      a: "Sim. Você pode começar gratuitamente pelo diagnóstico da ARVO, conhecer seu cenário financeiro e entender como a plataforma funciona antes de decidir assinar.",
    },
    {
      q: "Qual a diferença entre a carteira Geral Light e a Investidor Geral (IG)?",
      a: "A carteira Geral Light foi desenvolvida especificamente para patrimônios de até R$ 100 mil, com produtos acessíveis e valores mínimos reduzidos. As carteiras Investidor Geral (acima de R$ 100 mil) e Investidor Qualificado (IQ) oferecem diversificação institucional mais profunda, com múltiplos gestores e estratégias.",
    },
    {
      q: "Meus dados financeiros e bancários estão protegidos?",
      a: "Sim. A ARVO opera em conformidade com a LGPD (Lei nº 13.709/2018). Seus dados trafegam com criptografia TLS 1.3 de ponta a ponta, senhas são protegidas com Bcrypt e nunca vendemos nem compartilhamos suas informações financeiras com terceiros ou anunciantes.",
    },
    {
      q: "Como funciona o cancelamento e a garantia?",
      a: "Você pode cancelar a renovação da sua assinatura quando quiser. Dentro do período legal de 7 dias de garantia, você recebe 100% de reembolso, sem burocracia.",
    },
    {
      q: "Para quem a ARVO não é?",
      a: "A ARVO não é para quem procura dinheiro rápido, promessas de rentabilidade ou a “ação da vez”. Também não é para quem quer entregar o dinheiro para outra pessoa administrar. É para quem quer construir patrimônio com planejamento, estratégia e visão de longo prazo, mantendo o controle das próprias decisões.",
    },
  ],
};

export const finalCta = {
  title: "Você já começou a investir. Agora descubra se está no caminho certo.",
  sub: "Em menos de 5 minutos você descobre o plano certo para o seu momento.",
  cta: "Descobrir meu plano",
  micro: "Gratuito · 5 minutos · Sem cartão",
};

export const footer = {
  company: "ARVO Orientação Financeira LTDA · ARVO® 2026",
  tagline: "Plataforma independente fee-only",
};
