const fs = require('fs');
let code = fs.readFileSync('/Users/lucasdematos/Desktop/ARVO/src/app/dashboard/bussola/page.tsx', 'utf-8');

const returnStart = code.indexOf('    return (');
const lastClosingDiv = code.lastIndexOf('        </div>');
const endOfFile = code.lastIndexOf(')') + 1;

const layoutContent = `
    return (
        <div className="min-h-screen text-slate-900 font-sans p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-[#f6f4ef]">
            <style>{\`
                .arvo-slider [role=slider] {
                    border-color: \${currentColor} !important;
                    background-color: \${currentColor} !important;
                    box-shadow: 0 0 10px \${currentColor}60;
                    transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
                }
                .arvo-slider .relative > div:first-child > div {
                    background-color: \${currentColor} !important;
                    transition: background-color 0.3s;
                }
            \`}</style>
            
            <div className="max-w-6xl mx-auto space-y-6">
                
                <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-[#123044] mb-2">Bússola Arvo de Carteiras</h1>
                        <p className="text-[#667085] text-sm max-w-2xl leading-relaxed">
                            A carteira parte de preservação (Abrigo), passa por equilíbrio (Ritmo), diversificação (Visão) 
                            e chega a crescimento global (Oceano). A cada nível, novos ativos aparecem e os pesos mudam com lógica controlada.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#e4e0d7] rounded-full bg-white/60 text-[#17384d] text-xs font-semibold">
                        Modo de simulação educativa
                    </div>
                </header>

                {/* COCKPIT HERO: Bússola + Gráfico */}
                <div className="grid lg:grid-cols-2 gap-6">
                    
                    {/* CONTROLES E MEDIDOR */}
                    <aside className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] shadow-[0_20px_50px_rgba(23,33,43,0.05)] overflow-hidden flex flex-col">
                        <div className="p-6 grid grid-cols-2 gap-4 border-b border-[#e4e0d7]/50">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#667085]">Tipo de investidor</label>
                                <select 
                                    className="w-full border border-[#e4e0d7] rounded-xl px-3 py-2 bg-white text-[#123044] font-semibold outline-none text-sm"
                                    value={investorType} onChange={e => setInvestorType(e.target.value)}
                                >
                                    <option>Geral</option>
                                    <option>Qualificado</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#667085]">Tamanho da carteira</label>
                                <select 
                                    className="w-full border border-[#e4e0d7] rounded-xl px-3 py-2 bg-white text-[#123044] font-semibold outline-none text-sm"
                                    value={complexity} onChange={e => setComplexity(e.target.value)}
                                >
                                    <option value="Light">Light (até R$ 10k)</option>
                                    <option value="Normal">Normal (acima de R$ 10k)</option>
                                </select>
                            </div>
                            <div className="col-span-2 space-y-4 pt-2">
                                <label className="text-xs font-bold text-[#667085]">Nível de risco (0 a 100)</label>
                                <Slider 
                                    value={[riskPosition]} 
                                    min={0} max={100} step={1}
                                    onValueChange={v => setRiskPosition(v[0])}
                                    className="arvo-slider"
                                />
                                <div className="flex justify-between text-[11px] font-bold text-[#8d97a5] uppercase tracking-widest px-1">
                                    <span>Abrigo</span>
                                    <span>Ritmo</span>
                                    <span>Visão</span>
                                    <span>Oceano</span>
                                </div>
                            </div>
                        </div>

                        {/* GAUGE SVG */}
                        <div className="relative h-[220px] flex items-center justify-center pt-8">
                            <svg viewBox="0 0 400 220" className="w-[340px] h-full overflow-visible">
                                <defs>
                                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#9bcbb4" />
                                        <stop offset="33%" stopColor="#4fa080" />
                                        <stop offset="66%" stopColor="#d8b568" />
                                        <stop offset="100%" stopColor="#a45b55" />
                                    </linearGradient>
                                </defs>
                                <path d="M 36 184 A 164 164 0 0 1 364 184" fill="none" stroke="#e4e0d7" strokeWidth="28" strokeLinecap="round" opacity="0.5"/>
                                <path d="M 36 184 A 164 164 0 0 1 364 184" fill="none" stroke="url(#gaugeGradient)" strokeWidth="28" strokeLinecap="round"/>
                                <line x1="111" y1="30" x2="125" y2="54" stroke="#fffdf8" strokeWidth="4" strokeLinecap="round"/>
                                <line x1="289" y1="30" x2="275" y2="54" stroke="#fffdf8" strokeWidth="4" strokeLinecap="round"/>
                                <g fontSize="10" fontWeight="800" fill="#8d97a5" letterSpacing="0.5">
                                    <text x="36" y="215" textAnchor="middle">ABRIGO</text>
                                    <text x="118" y="20" textAnchor="middle">RITMO</text>
                                    <text x="282" y="20" textAnchor="middle">VISÃO</text>
                                    <text x="364" y="215" textAnchor="middle">OCEANO</text>
                                </g>
                                <g transform="translate(200, 184)">
                                    <motion.g 
                                        className="needle"
                                        animate={{ rotate: needleAngle }}
                                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                    >
                                        <circle cx="0" cy="0" r="132" fill="transparent" />
                                        <line x1="0" y1="0" x2="0" y2="-132" stroke="#17212b" strokeWidth="5" strokeLinecap="round"/>
                                        <circle cx="0" cy="0" r="13" fill="#17212b" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.18))" }}/>
                                        <circle cx="0" cy="0" r="4" fill="#fffdf8"/>
                                    </motion.g>
                                </g>
                            </svg>
                        </div>

                        <div className="text-center pb-6 flex-1 flex flex-col justify-end">
                            <div className="text-5xl font-extrabold tracking-tighter leading-none mb-2 transition-colors duration-300" style={{ color: currentColor }}>
                                {riskPosition}
                            </div>
                            <div className="text-lg font-bold text-[#17384d] flex justify-center items-center gap-2">
                                {currentName}
                                {!isOfficial && (
                                    <span className="px-2 py-0.5 rounded border border-[#e4e0d7] bg-white text-[9px] text-[#667085] uppercase tracking-widest font-extrabold">
                                        Simulação
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-[#667085] mt-1.5 px-6">{currentHeadline}</div>
                            {isOfficial && (
                                <div className="inline-flex mt-3 mx-auto px-3 py-1 rounded-full bg-[#e8f1ed] text-[#1f674f] text-[11px] font-bold">
                                    Carteira oficial Arvo
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* GRÁFICO HISTÓRICO */}
                    <section className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] p-6 shadow-[0_20px_50px_rgba(23,33,43,0.05)] overflow-hidden flex flex-col">
                        <h2 className="text-lg font-bold text-[#123044] mb-2">Histórico Real de Desempenho (36 meses)</h2>
                        <p className="text-xs text-[#667085] mb-6">Evolução real de <strong>R$ 10.000</strong> com base no histórico dos fundos que compõem a carteira atual versus CDI.</p>
                        
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white border border-[#e4e0d7] rounded-2xl">
                            <div>
                                <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Retorno Anual</div>
                                <div className="text-xl font-extrabold text-[#123044] mt-1">{realAnual.toFixed(1)}%</div>
                            </div>
                            <div className="w-px bg-[#e4e0d7] hidden md:block"></div>
                            <div>
                                <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Média Mensal</div>
                                <div className="text-xl font-extrabold text-[#123044] mt-1">{realMes.toFixed(2)}%</div>
                            </div>
                            <div className="w-px bg-[#e4e0d7] hidden md:block"></div>
                            <div>
                                <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">% do CDI</div>
                                <div className="text-xl font-extrabold text-[#1f674f] mt-1">{pctCdi.toFixed(0)}%</div>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e0d7" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8d97a5' }} tickLine={false} axisLine={false} minTickGap={30} />
                                    <YAxis tickFormatter={(val) => \`R$ \${(val/1000).toFixed(1)}k\`} tick={{ fontSize: 10, fill: '#8d97a5' }} tickLine={false} axisLine={false} domain={['dataMin - 500', 'auto']} />
                                    <Tooltip 
                                        formatter={(value) => [\`R$ \${value.toLocaleString('pt-BR')}\`, '']}
                                        labelFormatter={(label) => label}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e4e0d7', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', backgroundColor: '#fffdf8' }}
                                        labelStyle={{ color: '#123044', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                    <Line type="monotone" name="portfolio" dataKey="portfolio" stroke={currentColor} strokeWidth={3} dot={false} activeDot={{ r: 6, fill: currentColor }} />
                                    <Line type="monotone" name="cdi" dataKey="cdi" stroke="#8d97a5" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </div>

                {/* MÉTRICAS INFERIORES */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-[#e4e0d7] rounded-2xl p-4 bg-white shadow-sm">
                        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Ativos</div>
                        <div className="text-2xl font-extrabold text-[#123044] mt-1">{activeAssets.length}</div>
                        <div className="text-[11px] text-[#667085] mt-0.5">na carteira</div>
                    </div>
                    <div className="border border-[#e4e0d7] rounded-2xl p-4 bg-white shadow-sm">
                        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Caixa/Selic</div>
                        <div className="text-2xl font-extrabold text-[#123044] mt-1">{formatPct(cashTotal)}</div>
                        <div className="text-[11px] text-[#667085] mt-0.5">liquidez e defesa</div>
                    </div>
                    <div className="border border-[#e4e0d7] rounded-2xl p-4 bg-white shadow-sm">
                        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Retorno Alvo (a.a.)</div>
                        <div className="text-2xl font-extrabold text-[#123044] mt-1">{formatDecimalPct(projectedReturn)}</div>
                        <div className="text-[11px] text-[#667085] mt-0.5">projeção teórica</div>
                    </div>
                    <div className="border border-[#e4e0d7] rounded-2xl p-4 bg-white shadow-sm">
                        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Volatilidade (Risco)</div>
                        <div className="text-2xl font-extrabold text-[#123044] mt-1">{formatDecimalPct(projectedVolatility)}</div>
                        <div className="text-[11px] text-[#667085] mt-0.5">variação esperada</div>
                    </div>
                </div>

                {/* COMPOSIÇÃO E DESCRIÇÃO */}
                <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
                    <section className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#123044] mb-4">Composição por classe</h2>
                        <div className="space-y-4">
                            {sortedClasses.map(([cls, val]) => (
                                <div key={cls} className="flex items-center gap-3 text-sm">
                                    <div className="w-28 font-bold text-[#344054] truncate" title={cls}>{cls}</div>
                                    <div className="flex-1 h-2.5 bg-[#eee9df] rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full bg-gradient-to-r from-[#24556d] to-[#2d8a69] transition-all duration-300" 
                                            style={{ width: \`\${val}%\` }}
                                        />
                                    </div>
                                    <div className="w-12 text-right font-extrabold text-[#667085]">{formatPct(val)}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] p-6 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-gradient-to-br from-[#fffdf8] to-[#edf5f2] border border-[#e4e0d7] rounded-2xl p-5 mb-6">
                            <p className="text-sm text-[#475467] leading-relaxed">
                                {isOfficial ? (
                                    <>Este é um ponto oficial da metodologia Arvo: <strong>{currentName}</strong>. </>
                                ) : (
                                    <>Você está simulando uma transição entre <strong>{from.name}</strong> e <strong>{to.name}</strong>. </>
                                )}
                                Neste nível, a carteira mantém {formatPct(cashTotal)} em caixa para liquidez, 
                                buscando a diversificação através das outras classes na proporção indicada.
                            </p>
                        </div>
                        
                        <h2 className="text-lg font-bold text-[#123044] mb-4">Ativos na carteira</h2>
                        <div className="overflow-x-auto flex-1 border border-[#e4e0d7] rounded-xl">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#e4e0d7] bg-[#faf8f2]">
                                        <th className="py-3 px-3 text-[10px] font-bold text-[#667085] uppercase tracking-widest">Ativo</th>
                                        <th className="py-3 px-3 text-[10px] font-bold text-[#667085] uppercase tracking-widest">Classe</th>
                                        <th className="py-3 px-3 text-[10px] font-bold text-[#667085] uppercase tracking-widest">Gestora</th>
                                        <th className="py-3 px-3 text-[10px] font-bold text-[#667085] uppercase tracking-widest">Peso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeAssets.map((asset) => (
                                        <tr key={asset.assetName} className="border-b border-[#efebe2] hover:bg-[#fff] transition-colors">
                                            <td className="py-3 px-3 font-extrabold text-[#22313f]">{asset.assetName}</td>
                                            <td className="py-3 px-3">
                                                <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-[#eef3f5] text-[#24485b]">
                                                    {asset.assetClass}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-[#475467]">{asset.manager || "-"}</td>
                                            <td className="py-3 px-3 font-black text-[#123044]">{formatPct(asset.applicableWeight)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    )
}
`;

const newCode = code.substring(0, returnStart) + layoutContent;
fs.writeFileSync('/Users/lucasdematos/Desktop/ARVO/src/app/dashboard/bussola/page.tsx', newCode);
console.log("Layout completely rewritten to Cockpit design!");
