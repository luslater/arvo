import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-dash-bg text-dash-text selection:bg-dash-accent/20">
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-dash-text-muted hover:text-dash-text transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para a página inicial
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Termos de Uso</h1>
                <p className="text-dash-text-muted mb-8 text-sm">Última atualização: 12 de Agosto de 2026</p>

                <div className="prose prose-slate prose-p:text-dash-text-muted prose-headings:text-dash-text prose-a:text-dash-accent max-w-none">
                    <p>
                        Este é um documento de referência (placeholder). Para entrar em produção e realizar a cobrança real de clientes, 
                        estes Termos de Uso devem ser redigidos e aprovados por um profissional jurídico especializado em direito digital e financeiro.
                    </p>

                    <h2>1. Aceitação dos Termos</h2>
                    <p>
                        Ao acessar e utilizar a plataforma ARVO, você concorda em cumprir e ser regido pelos presentes Termos de Uso. 
                        Caso não concorde com qualquer parte destes termos, você não deverá utilizar nossos serviços.
                    </p>

                    <h2>2. Natureza dos Serviços</h2>
                    <p>
                        A ARVO é uma plataforma de tecnologia educacional e de ferramentas financeiras, desenvolvida para auxiliar o usuário na 
                        organização e projeção do seu patrimônio. <strong>A ARVO não atua como consultora de valores mobiliários, gestora ou 
                        analista de investimentos (CVM).</strong> Nenhuma informação fornecida pela plataforma constitui recomendação individualizada 
                        de investimento, e o usuário é o único responsável por suas decisões financeiras.
                    </p>

                    <h2>3. Limitação de Responsabilidade</h2>
                    <p>
                        As projeções, simulações e cálculos exibidos na plataforma são baseados em premissas matemáticas e dados históricos. 
                        A rentabilidade passada não é garantia de rentabilidade futura. A ARVO não se responsabiliza por eventuais perdas, 
                        danos ou lucros cessantes resultantes da utilização de nossas calculadoras e simuladores.
                    </p>

                    <h2>4. Assinatura e Pagamentos</h2>
                    <p>
                        Para acessar os recursos Premium (como o "Motor de Alocação" e a "Análise de Markowitz"), é necessário possuir uma 
                        assinatura ativa. Os pagamentos são processados por provedores de pagamento terceirizados e seguros. A ARVO não armazena 
                        os dados completos do seu cartão de crédito.
                    </p>
                </div>
            </div>
        </div>
    );
}
