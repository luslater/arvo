import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-dash-bg text-dash-text selection:bg-dash-accent/20">
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-dash-text-muted hover:text-dash-text transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para a página inicial
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Política de Privacidade</h1>
                <p className="text-dash-text-muted mb-8 text-sm">Última atualização: 12 de Agosto de 2026</p>

                <div className="prose prose-slate prose-p:text-dash-text-muted prose-headings:text-dash-text prose-a:text-dash-accent max-w-none">
                    <p>
                        Este é um documento de referência (placeholder) para adequação à Lei Geral de Proteção de Dados (LGPD). 
                        Para entrar em produção, esta política deve ser revisada e validada por um profissional jurídico especialista em dados.
                    </p>

                    <h2>1. Coleta de Dados Pessoais</h2>
                    <p>
                        A ARVO coleta as seguintes informações dos usuários para fornecer seus serviços: 
                        nome, e-mail, telefone, dados de perfil de risco e informações financeiras simuladas (como renda e patrimônio). 
                        Esses dados são fornecidos voluntariamente por você ao criar uma conta e utilizar o dashboard.
                    </p>

                    <h2>2. Uso dos Dados</h2>
                    <p>
                        Utilizamos seus dados exclusivamente para:
                    </p>
                    <ul>
                        <li>Personalizar a sua experiência no Motor de Alocação e calculadoras;</li>
                        <li>Processar o login e garantir a segurança da conta (incluindo autenticação em dois fatores);</li>
                        <li>Melhorar os algoritmos e cálculos do sistema;</li>
                        <li>Enviar comunicações sobre atualizações do produto, caso autorizado.</li>
                    </ul>

                    <h2>3. Proteção e Segurança</h2>
                    <p>
                        A ARVO adota medidas técnicas, administrativas e criptográficas adequadas (como senhas criptografadas e conexões HTTPS seguras) 
                        para proteger seus dados pessoais contra acessos não autorizados, perdas ou alterações.
                    </p>

                    <h2>4. Compartilhamento de Dados</h2>
                    <p>
                        Não vendemos, alugamos ou comercializamos seus dados pessoais. Seus dados poderão ser compartilhados apenas com parceiros 
                        estritamente necessários para a operação do serviço (como gateways de pagamento), sob rigorosos contratos de sigilo e adequação à LGPD.
                    </p>

                    <h2>5. Seus Direitos (LGPD)</h2>
                    <p>
                        Você tem o direito de solicitar o acesso, retificação ou exclusão permanente dos seus dados pessoais a qualquer momento. 
                        Para exercer esses direitos, entre em contato conosco através dos nossos canais de suporte no dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
}
