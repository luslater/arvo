# Calculadora de Inflação — integração React/Lovable

Este pacote contém a calculadora de inflação da Arvo como um componente React independente.

## Arquivos

- `CalculadoraInflacao.tsx`: componente e lógica de cálculo.
- `calculadora-inflacao.css`: estilos isolados para não interferir no restante do site.

## Como instalar no Lovable ou em outro projeto React

1. Copie os dois arquivos para `src/components/calculadora-inflacao/`.
2. Na página em que a calculadora deve aparecer, importe o componente:

```tsx
import CalculadoraInflacao from "@/components/calculadora-inflacao/CalculadoraInflacao";
```

3. Renderize-o no ponto desejado:

```tsx
export default function PaginaCalculadora() {
  return <CalculadoraInflacao />;
}
```

O CSS já é importado pelo componente. Não é necessário instalar bibliotecas adicionais.

## Fonte dos dados

O componente consulta diretamente a API pública do Sistema Gerenciador de Séries Temporais do Banco Central:

- IPCA: série 433;
- INPC: série 188;
- IGP-M: série 28655.

O navegador precisa ter acesso a `https://api.bcb.gov.br`.

## Observações importantes

- O cálculo considera os índices dos meses inicial e final, seguindo a metodologia da Calculadora do Cidadão.
- O período mínimo foi limitado a julho de 1994 para não misturar moedas anteriores ao Real.
- Se o seu site aplicar uma política CSP, inclua `https://api.bcb.gov.br` em `connect-src`.
- Para evitar dependência direta do navegador em relação ao Banco Central, uma versão futura pode usar uma rota de API do próprio site como proxy e cache.
