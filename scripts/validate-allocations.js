const { PORTFOLIO_ALLOCATIONS } = require('./src/lib/portfolio-allocations');

console.log('Validando Carteiras...');

let hasError = false;

for (const [name, funds] of Object.entries(PORTFOLIO_ALLOCATIONS)) {
    const total = funds.reduce((acc, fund) => acc + fund.percentage, 0);
    console.log(`${name}: ${total.toFixed(2)}%`);

    if (Math.abs(total - 100) > 0.001) {
        console.error(`❌ Erro: Carteira ${name} não soma 100%! (Total: ${total}%)`);
        hasError = true;
    }
}

if (!hasError) {
    console.log('✅ Todas as carteiras estão balanceadas (100%)');
} else {
    process.exit(1);
}
