// @ts-nocheck
/*
 * Comportamento interativo da Carta Mensal (graficos, abas, mapa das casas, simulacoes).
 * Portado do material original em HTML; cada bloco abaixo e um script independente.
 * Os temporizadores e observers sao injetados para poderem ser cancelados ao sair da pagina.
 */

function navegacao() {
  const links = Array.from(document.querySelectorAll('.carta .nav-links a'));
  const porId = {};
  links.forEach((a) => { porId[a.getAttribute('href').slice(1)] = a; });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && porId[e.target.id]) {
        links.forEach((l) => l.classList.remove('on'));
        porId[e.target.id].classList.add('on');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(porId).forEach((id) => {
    const s = document.getElementById(id);
    if (s) io.observe(s);
  });
}

function bloco1(setTimeout, clearTimeout, requestAnimationFrame, IntersectionObserver) {
(function(){
var C={pos:'#123044',inf:'#1F674F',pre:'#A8C5A1',mm:'#C08A34',br:'#B34A3C',intl:'#5687AF',alt:'#8B7355'};
var N={pos:'Pós-fixado',inf:'Inflação (IPCA+)',pre:'Prefixado',mm:'Multimercados',br:'Ações Brasil',intl:'Internacional',alt:'Alternativos / FIIs'};
var K=['pos','inf','pre','mm','br','intl','alt'];
function S(o){return K.filter(function(k){return o[k]>0}).map(function(k){return {k:k,n:N[k],v:o[k],c:C[k]}})}
var H={
 xp:{name:'XP',date:'Set/26',sub:{con:'Conservadora',mod:'Moderada',arr:'Sofisticada'},
   con:{pos:71.5,inf:12.5,pre:6,mm:2.5,br:0,intl:5,alt:2.5},
   mod:{pos:34.5,inf:22.5,pre:11,mm:13,br:5,intl:7,alt:7},
   arr:{pos:14,inf:27.5,pre:9.5,mm:8,br:15,intl:9.5,alt:16.5}},
 btg:{name:'BTG Pactual',date:'Out/26',sub:{con:'Conservador · carteira Brasil',mod:'Balanceado · carteira Brasil',arr:'Sofisticado · carteira Brasil'},
   con:{pos:52.5,inf:30,pre:0,mm:9,br:7.5,intl:0,alt:1},
   mod:{pos:29,inf:37.5,pre:2.5,mm:14,br:15,intl:0,alt:2},
   arr:{pos:20.5,inf:30,pre:5,mm:19,br:22.5,intl:0,alt:3}},
 santander:{name:'Santander',date:'Out/26',sub:{con:'Conservador',mod:'Moderado',arr:'Arrojado'},
   con:{pos:70,inf:16,pre:11,mm:1,br:0,intl:0,alt:2},
   mod:{pos:43,inf:26,pre:12,mm:7,br:2,intl:6,alt:4},
   arr:{pos:18,inf:26,pre:16,mm:14,br:7,intl:12,alt:7}},
 safra:{name:'Safra',date:'Out/26',sub:{con:'Conservador',mod:'Moderado',arr:'Dinâmico'},
   con:{pos:48,inf:19,pre:9,mm:7,br:5,intl:8,alt:4},
   mod:{pos:12,inf:27,pre:14,mm:14,br:10,intl:16,alt:7},
   arr:{pos:4,inf:25,pre:6,mm:12,br:17,intl:26,alt:10}},
 nu:{name:'Nu Asset',date:'Set/26',sub:{con:'Nu Seleção Cautela · carteira real',mod:'Nu Seleção Equilíbrio · carteira real',arr:'Nu Seleção Potencial · carteira real'},
   con:{pos:81,inf:0,pre:0,mm:1,br:9,intl:9,alt:0},
   mod:{pos:45,inf:0,pre:0,mm:5,br:39,intl:11,alt:0},
   arr:{pos:22,inf:0,pre:0,mm:7,br:52,intl:19,alt:0}},
 itau:{name:'Itaú',date:'Out/26',sub:{con:'Carteira mensal (perfil não especificado)'},
   con:{pos:76,inf:13,pre:1,mm:7,br:0,intl:3,alt:0}},
 arvo:{name:'ARVO · Robustez 360',date:'Out/26',sub:{con:'Abrigo · geral',mod:'Visão · geral',arr:'Oceano · geral'},
   con:{pos:100,inf:0,pre:0,mm:0,br:0,intl:0,alt:0},
   mod:{pos:40,inf:28,pre:0,mm:5,br:10,intl:17,alt:0},
   arr:{pos:16,inf:27,pre:0,mm:8,br:20,intl:29,alt:0}}
};
var F={ /* ARVO fine */
 cls:[['Pós-fixado (Selic / DI)','#123044'],['Crédito privado CDI+','#2B6E76'],['IPCA+ título público','#1F674F'],['Debêntures incentivadas','#4FA080'],['Prefixado','#B9D6C8'],['Multimercados','#C08A34'],['Ações Brasil','#B34A3C'],['Internacional','#5687AF'],['Alternativos / FIIs','#8B7355']],
 con:{w:[60,12,15,0,3,3,0,5,2],b:['55–70','5–15','10–20','0–5','0–5','0–5','0–3','3–8','0–3'],d:[-20,-8,15,0,3,3,0,5,2]},
 mod:{w:[30,10,15,5,5,10,10,12,3],b:['25–40','5–15','10–20','0–10','0–8','5–15','5–15','8–18','0–5'],d:[-10,-5,15,-10,5,-5,5,2,3]},
 arr:{w:[12,5,15,3,5,10,18,28,4],b:['8–20','0–10','10–20','0–8','0–8','6–14','12–24','20–32','0–6'],d:[-8,-2,15,-7,5,-3,-2,-2,4]}
};
var GLOBAL=[{n:'Soberanos desenvolvidos',v:13.5,c:'#123044'},{n:'Crédito grau de investimento',v:40,c:'#2B6E76'},{n:'High yield',v:10.5,c:'#8AB0B2'},{n:'Renda fixa emergente',v:6,c:'#1F674F'},{n:'Ações EUA',v:15,c:'#5687AF'},{n:'Ações desenvolvidos ex-EUA',v:2.5,c:'#A3BFD9'},{n:'Ações emergentes',v:2.5,c:'#B34A3C'},{n:'Alternativos',v:7.5,c:'#8B7355'},{n:'Caixa',v:2.5,c:'#C08A34'}];
function fmt(v){return (Math.round(v*10)/10).toString().replace('.',',')+'%'}
var tip=document.querySelector('.carta .tip');
function showTip(e,t){tip.textContent=t;tip.style.opacity=1;var x=(e.touches?e.touches[0].clientX:e.clientX),y=(e.touches?e.touches[0].clientY:e.clientY);tip.style.left=Math.min(x+14,window.innerWidth-250)+'px';tip.style.top=(y+14)+'px'}
function hideTip(){tip.style.opacity=0}
function arc(cx,cy,r,a0,a1){var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);return [x0,y0,x1,y1,(a1-a0)>Math.PI?1:0]}
window.__donut=donut;
function donut(el,slices,center){
 var tot=slices.reduce(function(s,x){return s+x.v},0),a=-Math.PI/2,R=90,r=56,svg='<svg viewBox="0 0 200 200" role="img" aria-label="'+(center||'Gráfico de rosca')+': '+slices.map(function(s){return s.n+' '+fmt(s.v)}).join(', ')+'">';
 slices.forEach(function(s,i){var a1=a+2*Math.PI*s.v/tot;if(s.v/tot>0.9999){a1=a+2*Math.PI-0.0001}
  var o=arc(100,100,R,a,a1),n=arc(100,100,r,a,a1);
  svg+='<path data-i="'+i+'" fill="'+s.c+'" d="M'+o[0]+' '+o[1]+'A'+R+' '+R+' 0 '+o[4]+' 1 '+o[2]+' '+o[3]+'L'+n[2]+' '+n[3]+'A'+r+' '+r+' 0 '+n[4]+' 0 '+n[0]+' '+n[1]+'Z" stroke="#fff" stroke-width="1.5"/>';a=a1});
 svg+='<text x="100" y="96" text-anchor="middle" font-family="Plus Jakarta Sans, Arial" font-size="13" fill="#5A635C" class="c1">'+(center||'')+'</text><text x="100" y="118" text-anchor="middle" font-family="Plus Jakarta Sans, Arial" font-size="20" font-weight="800" fill="#123044" class="c2"></text></svg>';
 var lg='<ul class="legend">'+slices.map(function(s,i){return '<li data-i="'+i+'"><i style="background:'+s.c+'"></i><span>'+s.n+'</span><b>'+fmt(s.v)+'</b></li>'}).join('')+'</ul>';
 el.innerHTML=svg+lg;
 var c1=el.querySelector('.c1'),c2=el.querySelector('.c2');
 function on(i,e){el.classList.add('hovering');el.querySelectorAll('[data-i]').forEach(function(n){n.classList.toggle('hot',n.getAttribute('data-i')==i)});c1.textContent=slices[i].n.length>20?slices[i].n.slice(0,19)+'…':slices[i].n;c2.textContent=fmt(slices[i].v);if(e)showTip(e,slices[i].n+': '+fmt(slices[i].v))}
 function off(){el.classList.remove('hovering');el.querySelectorAll('.hot').forEach(function(n){n.classList.remove('hot')});c1.textContent=center||'';c2.textContent='';hideTip()}
 el.querySelectorAll('[data-i]').forEach(function(n){var i=n.getAttribute('data-i');n.addEventListener('mouseenter',function(e){on(i,e)});n.addEventListener('mousemove',function(e){showTip(e,slices[i].n+': '+fmt(slices[i].v))});n.addEventListener('mouseleave',off);n.addEventListener('touchstart',function(e){on(i,e)},{passive:true})});
}
function seg(id,cb){var g=document.getElementById(id);if(!g)return;g.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){g.querySelectorAll('button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false')});b.classList.add('on');b.setAttribute('aria-selected','true');cb(b.getAttribute('data-p')||b.getAttribute('data-metric'))})})}
/* AA bars */
var AAL=[['Reserva','100% Selic'],['Abrigo','80% Selic'],['Ritmo','60% Selic'],['Visão','40% Selic'],['Oceano','20% Selic']];
var AAD={G:{12:[[14.4,100,0.28,0],[14.4,99,0.30,0],[14.3,99,1.25,0],[15.1,105,2.40,-0.43],[16.7,115,4.30,-1.75]],24:[[13.8,100,0.42,0],[13.9,100,0.43,0],[14.6,106,1.25,0],[15.7,114,2.38,-0.43],[17.2,125,4.26,-1.75]],36:[[12.9,100,0.50,0],[13.1,101,0.48,0],[14.5,114,1.43,0],[16.3,130,2.74,-0.43],[18.6,152,4.90,-1.75]]},
 Q:{12:[[14.4,100,0.28,0],[14.4,99,0.30,0],[15.2,105,1.48,0],[16.4,113,2.89,-0.67],[18.4,127,5.34,-2.19]],24:[[13.8,100,0.42,0],[13.9,100,0.45,0],[15.3,111,1.57,0],[16.5,120,2.69,-0.67],[18.4,135,5.06,-2.19]],36:[[12.9,100,0.50,0],[13.1,101,0.49,0],[15.0,119,1.85,0],[16.4,131,3.01,-0.67],[19.6,161,5.84,-2.19]]}};
var CDIA={12:14.5,24:13.9,36:12.9};
var aaS={m:'ret',h:'36',p:'G'};
function bars(){var el=document.getElementById('aa-bars');if(!el)return;var m=aaS.m,idx={ret:0,pct:1,vol:2,dd:3}[m],rows=AAD[aaS.p][aaS.h].map(function(r,i){return {n:AAL[i][0],s:AAL[i][1],v:r[idx]}});
 if(m==='ret')rows.unshift({n:'CDI',s:'referência do período',v:CDIA[aaS.h],ref:1});
 var max=Math.max.apply(null,rows.map(function(r){return Math.abs(r.v)}))||1;var col={ret:'#1F674F',pct:'#1F674F',vol:'#123044',dd:'#B34A3C'}[m];
 el.innerHTML=rows.map(function(r){var w=Math.abs(r.v)/max*100;var txt=m==='dd'?(r.v===0?'0,0%':'−'+fmt(-r.v)):(m==='pct'?Math.round(r.v)+'%':fmt(r.v)+' a.a.');
  return '<div class="bar-row"><div class="lbl">'+r.n+'<small>'+r.s+'</small></div><div class="bar-track"><div class="bar-fill" style="width:'+(m==='dd'&&r.v===0?0.6:Math.max(w,0.6))+'%;background:'+(r.ref?'#BDB7A6':col)+'"></div></div><div class="val">'+txt+'</div></div>'}).join('')}
['aa-m','aa-h','aa-p'].forEach(function(id){var g=document.getElementById(id);if(!g)return;g.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){g.querySelectorAll('button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false')});b.classList.add('on');b.setAttribute('aria-selected','true');aaS[{'aa-m':'m','aa-h':'h','aa-p':'p'}[id]]=b.getAttribute('data-v');bars()})})});
bars();
/* casas */
function casas(p){var g=document.getElementById('pies-casas');if(!g)return;var keys=['xp','btg','santander','safra'];if(p==='con')keys.push('itau');keys.push('nu','arvo');
 g.innerHTML=keys.map(function(k){var h=H[k];return '<div class="pie-card"><div class="t"><b>'+h.name+'</b><small>'+h.date+'</small></div><p class="sub">'+h.sub[p]+'</p><div class="pie-wrap" id="pie-'+k+'"></div></div>'}).join('');
 keys.forEach(function(k){donut(document.getElementById('pie-'+k),S(H[k][p]),k==='arvo'?'ARVO':H[k].name)});
 var rows=keys;var st=document.getElementById('stack-casas');
 st.innerHTML=rows.map(function(k){var h=H[k],o=h[p];return '<div class="stack-row'+(k==='arvo'?' me':'')+'"><div class="lbl">'+h.name+'<small>'+h.sub[p]+' · '+h.date+'</small></div><div class="stack-bar">'+K.filter(function(c){return o[c]>0}).map(function(c){return '<span data-t="'+h.name+' · '+N[c]+': '+fmt(o[c])+'" style="flex-basis:'+o[c]+'%;background:'+C[c]+';color:'+(c==='pre'?'#0E1511':'#fff')+'">'+(o[c]>=7?fmt(o[c]):'')+'</span>'}).join('')+'</div></div>'}).join('');
 st.querySelectorAll('[data-t]').forEach(function(s){s.addEventListener('mousemove',function(e){showTip(e,s.getAttribute('data-t'))});s.addEventListener('mouseleave',hideTip);s.addEventListener('touchstart',function(e){showTip(e,s.getAttribute('data-t'))},{passive:true})});
 document.getElementById('stack-legend').innerHTML=K.map(function(c){return '<span><i style="background:'+C[c]+'"></i>'+N[c]+'</span>'}).join('');}
casas('mod');seg('perfil-casas',casas);
var pg=document.getElementById('pie-btg-global');if(pg)donut(pg,GLOBAL,'BTG Global');
/* arvo */
function arvo(p){var f=F[p],el=document.getElementById('pie-arvo');if(!el)return;
 donut(el,f.w.map(function(v,i){return {n:F.cls[i][0],v:v,c:F.cls[i][1]}}).filter(function(s){return s.v>0}),'ARVO '+({con:'Conservador',mod:'Moderado',arr:'Arrojado'})[p]);
 document.querySelector('#tbl-arvo tbody').innerHTML=F.cls.map(function(c,i){var d=f.d[i];return '<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+c[1]+';margin-right:8px"></span>'+c[0]+'</td><td><b>'+f.w[i]+'%</b></td><td>'+f.b[i]+'%</td><td class="'+(d>0?'delta-up':(d<0?'delta-down':'delta-0'))+'">'+(d>0?'+'+d+' p.p.':(d<0?'−'+Math.abs(d)+' p.p.':'sem mudança'))+'</td></tr>'}).join('');}

})();
}

function bloco2(setTimeout, clearTimeout, requestAnimationFrame, IntersectionObserver) {
(function(){
var T=['Bolsa Brasil','Juros Brasil','Real (BRL)','Crédito privado','FIIs','Bolsa EUA / IA','Dólar global','Juros globais','Ouro e commodities'];
var Z=[0];
var D=[
['Vista Capital','Ago–Set/26',[['b','Comprado','Tirou proteções em bolsa; concentra em domésticas sensíveis à queda de juros e pouco endividadas. Vê reversão da baixa alocação em Brasil.'],['b','Espera curva mais baixa','Vê o debate sobre ajustes acontecendo com a curva de juros bem abaixo da atual.'],['b','Sem proteção','Retirou as proteções em câmbio no fim de agosto.'],Z,Z,['c','Cauteloso','Vê posição excessiva em ativos americanos; ganhos de produtividade com IA amortecem a saída.'],['s','Dólar mais fraco','Espera dólar mais fraco; o ritmo depende do Fed.'],Z,['c','Urânio comprado, Petrobras vendida','Mantém urânio; em setembro passou a vender Petrobras como visão de petróleo (fonte secundária).']]],
['Alaska','Set/26',[['b','Comprado','Maiores posições em varejo e consumo não cíclico.'],Z,['b','Comprado','O Alaska Range segue vendido em dólar contra o real.'],Z,Z,Z,Z,Z,Z]],
['Brasil Capital','2T26',[['b','Comprado, caixa perto de zero','Vê desconto ampliado após a correção; carteira equilibrada entre exportadoras e domésticas.'],Z,Z,Z,Z,Z,Z,Z,Z]],
['Real Investor','Set/26',[['b','Comprado','93,9% em ações; maiores setores imobiliário e financeiro. Relatório sem comentário de gestão.'],Z,Z,Z,Z,Z,Z,Z,Z]],
['IP Capital Partners','Fev/26',[Z,Z,Z,Z,Z,['c','Seletivo','Vê venda indiscriminada por medo da IA e oportunidades em franquias de qualidade a preços incomuns.'],Z,Z,Z]],
['Atmos*','Nov/25',[['b','Comprado em carrego','Prioriza carrego e preservação: utilities perto de 40% do fundo; Nubank como maior posição.'],Z,Z,Z,Z,['c','Reduziu','Reduziu ações internacionais pela atratividade relativa do Brasil.'],Z,Z,Z]],
['MAPFRE*','Jul/26',[Z,['n','Queda lenta','Espera queda gradual dos juros, limitada pelo cenário global e local.'],Z,Z,Z,Z,Z,Z,Z]],
['Legacy Capital','Set/26',[['b','Comprado','Exposição equilibrada ao "kit Brasil" (bolsa, juros e câmbio) apostando em compressão de prêmio.'],['b','Aplicado','Parte do kit Brasil; vê espaço para Selic perto de 10% no fim do ciclo em cenário de ajuste fiscal.'],['b','Comprado','Parte do kit Brasil; espera apreciação do real.'],Z,Z,['b','Comprado, seletivo','Comprada em ações globais de empresas com lucro consistente e retorno alto sobre capital.'],['n','Neutro','Neutra em dólar; espera níveis melhores para voltar a comprar.'],['c','Neutro, aplicando tático','Perto da neutralidade em Treasuries; começa a aplicar taticamente após a janela de emissões.'],Z]],
['Kapitalo K10','Set/26',[['b','Comprado, reduziu','Reduziu a posição comprada em bolsa brasileira após a alta.'],['b','Aplicado, reduziu','Reduziu marginalmente a posição aplicada no Brasil.'],['b','Comprado','Comprada em real e peso chileno.'],Z,Z,['b','Comprado em tecnologia','Segue comprada no setor de tecnologia dos EUA.'],['s','Vendido','Vendida em dólar, libra e franco suíço contra moedas de carrego.'],['c','Misto','Tomada na parte curta da curva americana; aplicada no Reino Unido.'],['s','Vendido em café e açúcar','Vendida em café e açúcar por excesso de oferta; zerou milho, diesel, alumínio e cobre.']]],
['Kapitalo Kappa/Zeta','Ago/26',[['b','Comprado','Ganhos em bolsa brasileira: mineração e siderurgia, transporte, saúde, papel e celulose.'],Z,Z,Z,Z,Z,Z,Z,Z]],
['Kinea Atlas','Set/26',[['b','Comprado tático','Comprada via EWZ, condicionada a uma proposta fiscalista vencer a eleição.'],['b','Aplicado','Posicionada para juros abaixo do precificado no Brasil.'],Z,Z,Z,['c','Cauteloso, via opções','Cautela em IA até a receita voltar a acelerar; exposição em opções de Nasdaq e bolsas de Coreia e Taiwan.'],['b','Comprado vs. europeus','Viés comprador de dólar contra moedas europeias.'],['b','Aplicado em Europa, México e NZ','Aplicada onde a ociosidade sugere juros abaixo do precificado.'],['b','Comprado (cesta)','Cesta de agrícolas, petróleo, ouro e cobre como proteção.']]],
['Genoa Capital','Ago/26',[['b','Comprado','Fundo de ações com exposição líquida perto de 95%, priorizando empresas brasileiras.'],['b','Aplicado','Espera ciclo de cortes maior do que o precificado.'],Z,Z,Z,Z,Z,Z,Z]],
['Dahlia Capital','9/out/26',[['b','Aumentou','Aumentou risco em ações brasileiras: bancos, energia elétrica e cíclicos domésticos.'],Z,Z,Z,Z,['b','Comprado','Comprada em semicondutores e hyperscalers.'],Z,Z,Z]],
['JGP','Set/26',[['b','Comprado','Ações individuais brasileiras contribuíram nos mandatos tradicionais.'],['b','Aplicado','Ganhos com posições aplicadas em juros no Brasil.'],Z,['b','Comprado seletivo','Títulos da Light contribuíram positivamente.'],Z,Z,['s','Vendido vs. cesta','Comprada em uma cesta de moedas contra o dólar.'],Z,Z]],
['Ibiuna Macro*','Ago/26',[['s','Vendido, reduziu','Reduziu o tamanho da posição vendida em Ibovespa, sem inverter a direção.'],['b','Aplicado','Aplicada em juros nominais e reais.'],['b','Comprado','Comprada em real e outras moedas de carrego.'],Z,Z,Z,['s','Vendido','Vendida em dólar, comprada em euro e peso mexicano.'],['c','Reduziu vendido em EUA','Reduziu posições vendidas em juros americanos; aplicada em países com início de cortes.'],Z]],
['Verde Asset*','Ago/26',[['b','Comprado','Retomou e ampliou exposição a ações, vendo assimetria melhor que na renda fixa.'],Z,['b','Comprado','Ampliou posição em real.'],Z,Z,['b','Comprado','Ganhos com ações globais.'],Z,Z,['b','Comprado em ouro e prata','Ganhos com ouro e prata.']]],
['Vinland Macro*','Jul/26',[Z,['b','Aplicado na parte curta','Posição na ponta curta da curva brasileira.'],Z,Z,Z,Z,['n','Neutro','Neutra em posições direcionais de moedas.'],['c','Parte curta dos EUA','Iniciou posição na ponta curta da curva americana.'],Z]],
['ARX','Set/26',[['b','Comprado','Fundos de ações ganharam com empresas do ciclo doméstico.'],Z,Z,['c','Seletivo','Avalia spreads comprimidos que não pagam o risco; vê cenário negativo para incentivadas no curto prazo.'],Z,Z,Z,Z,Z]],
['Sparta','Set/26',[Z,['b','Prefere indexado à inflação','Assimetria está na taxa do título público, não em compressão de spread.'],Z,['c','Seletivo','Spreads de incentivadas abriram cerca de 40 pontos-base com pouco fluxo; atenção ao passivo.'],Z,Z,Z,Z,Z]],
['Vinland Crédito','Set/26',[Z,Z,Z,['c','Cauteloso','Índice de infraestrutura passou de NTN-B + 0,70%; atribui a resgates contínuos.'],Z,Z,Z,Z,Z]],
['Ibiuna Credit','Set/26',[Z,Z,Z,['c','Cauteloso em incentivadas','Espera ajuste mais longo e intenso em incentivadas; CDI+ tranquilo.'],Z,['c','Protegido','Carrega proteção via CDS de hyperscalers e índice de high yield.'],Z,['s','Negativo','Vê vetores estruturais pressionando a parte longa da curva americana.'],Z]],
['Legacy Renda Mais','Set/26',[Z,Z,Z,['c','Encurtou prazo','Duration de incentivadas em 4,8 anos, abaixo do mercado; vendeu 18 ativos no secundário.'],Z,Z,Z,Z,Z]],
['Capitânia','Set/26',[Z,Z,Z,Z,['n','IFIX estável','Queda de juros não chegou aos FIIs no mês.'],Z,Z,['s','Títulos não são seguros','Teme repressão financeira global com Treasury de 10 anos a 5,30%.'],Z]],
['Kinea Imobiliário','Set/26',[Z,Z,Z,Z,['b','Comprado com deságio','Prefere FoFs e multiestratégia negociando com deságio; juros altos limitam recuperação das cotas.'],Z,Z,Z,Z]],
['HIX Capital','1S26',[['b','Comprado','Vê muitas barganhas em small caps e domésticas, com cenário parecido ao de dez/2024.'],Z,Z,Z,Z,Z,Z,Z,Z]],
['Squadra','1S26',[['c','Comprado com short relevante','Novas posições em Mercado Livre e Nubank; carteira vendida de tamanho importante.'],Z,Z,Z,Z,Z,Z,Z,Z]],
['Oceana','1S26',[['b','Comprado, value','Alto grau de percepção variante frente ao consenso; small caps muito descontadas.'],Z,Z,Z,Z,Z,Z,Z,Z]],
['BTG Pactual','Out/26',[['n','Neutro','Neutro em ações brasileiras: positivo para risco, mas desaceleração pesa no ciclo doméstico.'],['b','Acima do neutro em IPCA+ longo','Sobrealocação tática em juro real longo; prefixado neutro.'],Z,['n','Neutro','Crédito pós-fixado em linha com o neutro.'],['n','Neutro','FIIs com peso pequeno e neutro.'],['b','Acima do neutro','Ações americanas como núcleo da carteira global.'],['n','Referência','Mantém o dólar como moeda de referência da carteira global.'],['b','Acima do neutro, duration curta','Renda fixa global acima do neutro pelo carrego, com prazo abaixo do índice e preferência por grau de investimento.'],Z]],
['XP','Set/26',[['n','5% no moderado','Peso modesto em ações brasileiras no perfil moderado.'],['b','Aumentou prefixado','Aumentou prefixados com duration de três anos; inflação com 22,5% no moderado.'],Z,['s','Reduziu','Reduziu crédito privado pós-fixado.'],['b','Fundos listados','Fundos listados com 4% no moderado.'],['b','Aumentou','Aumentou ações dos EUA e de outros desenvolvidos na carteira global.'],Z,['s','Reduziu soberanos','Reduziu renda fixa soberana de países desenvolvidos.'],Z]],
['Itaú','Ago–Set/26',[['n','Neutro','Carta mensal de investimentos: neutra em bolsa, com inflação limitando cortes e lucros mais fracos.'],['n','Neutro em IPCA+','Neutra em títulos de inflação; a carteira mensal de setembro tem 13% em Tesouro IPCA+ e 73% em pós-fixado.'],Z,['c','Neutro, spreads apertados','Neutra em crédito global: spreads pagam pouco pelo risco.'],Z,['n','Neutro','Passou para neutra em ações internacionais por inflação persistente e sinais de desaceleração.'],['b','Espera dólar forte','Espera que as altas do Fed fortaleçam o dólar e pressionem moedas emergentes.'],['n','Neutro em Treasuries','Prevê novas altas do Fed e mantém neutralidade em Treasuries.'],Z]],
['Santander','Out/26',[['c','Construtivo, seletivo','Ambiente construtivo para bolsa local, mas exige seletividade.'],['b','Juro real atrativo','Juros reais em níveis atrativos para proteção do poder de compra.'],Z,Z,['b','Oportunidade','FIIs após correção vistos como oportunidade de longo prazo.'],['c','Seletivo','Lucros e IA sustentam bolsas, mas juros, preços e câmbio pedem seletividade.'],['b','Proteção estrutural','Câmbio como posição estrutural de proteção.'],Z,['b','Ouro como proteção','Ouro protege contra eventos globais inesperados.']]],
['BlackRock','4T/26',[Z,Z,Z,Z,Z,['b','Acima do neutro','Acima do neutro em ações americanas; emergentes elevados para acima do neutro.'],Z,['c','Prefere curtos','Prefere títulos curtos a longos.'],Z]],
['T. Rowe Price','Out/26',[Z,Z,Z,['c','Reduziu crédito','Reduziu crédito com spreads comprimidos; fechou sobrealocação em high yield.'],Z,['b','Acima do neutro','Acima do neutro em ações, com mais convicção em crescimento nos EUA e emergentes.'],Z,['s','Abaixo do neutro','Abaixo do neutro em renda fixa, embora menos negativo em duration.'],Z]],
['Kinea Oportunidade','Set/26',[Z,Z,Z,['c','Seletivo em high grade, compra high yield','Vê high grade e mid yield perto das mínimas de spread; segue buscando oportunidades em high yield. Carrego de CDI + 1,68%.'],Z,Z,Z,Z,Z]],
['Wellington','Set/26',[Z,Z,Z,['n','Neutro','Neutra em spreads de crédito, grau de investimento e high yield.'],Z,['n','Neutro em EUA, acima em globais','Acima do neutro em ações globais e emergentes, com convicção moderada; neutra em ações americanas.'],Z,['b','Acima do neutro em duration','Moderadamente acima do neutro em duration global.'],['n','Neutro','Neutra em commodities.']]],
['BB Investimentos','Set–Out/26',[['c','Cauteloso','Vê volatilidade elevada e cenário externo menos favorável a risco; carteiras focadas em qualidade e fluxo de caixa previsível.'],Z,Z,['c','Seletivo, alta qualidade','Estratégia seletiva com foco em emissores de elevada qualidade de crédito.'],Z,Z,Z,Z,Z]],
['Bradesco Asset*','Set/26',[Z,Z,Z,['s','Cauteloso: deterioração','A CIO vê deterioração de crédito começando; prefere emissores de menor risco e pede atenção a FIDCs de PMEs e crédito ao consumidor.'],Z,Z,Z,Z,Z]]
];
D.sort(function(a,b){return a[0].localeCompare(b[0],'pt')});
var ARVO={'ARX':'ARX Fuji e ARX Hedge Infra','Ibiuna Credit':'Ibiuna Credit','Kinea Atlas':'Kinea Atlas','Kinea Oportunidade':'Kinea Oportunidade','Sparta':'Sparta Deb Inc','Verde Asset*':'Verde AM X60','Kapitalo Kappa/Zeta':'Kapitalo Kappa','Wellington':'Wellington Ventura','BlackRock':'IVVB11'};
var onlyArvo=false;
function inA(n){return ARVO.hasOwnProperty(n)}
function mark(n){return inA(n)?'<span class="arvo-mark" title="Na carteira ARVO: '+ARVO[n]+'">ARVO</span>':''}
function rowsF(){return onlyArvo?D.filter(function(r){return inA(r[0])}):D}
var ORD=['b','c','n','s'],NM={b:'Positivo / comprado',c:'Seletivo / misto',n:'Neutro',s:'Negativo / vendido'},COL={b:'#1F674F',c:'#B8862B',n:'#7F8A83',s:'#B34A3C'};
var tipEl=document.querySelector('.tip');
function tipOn(e,t){if(!tipEl)return;tipEl.textContent=t;tipEl.style.opacity=1;var x=e.clientX,y=e.clientY;tipEl.style.left=Math.min(x+14,window.innerWidth-250)+'px';tipEl.style.top=(y+14)+'px'}
function tipOff(){if(tipEl)tipEl.style.opacity=0}
/* modo tema */
var chips=document.getElementById('tema-chips');
chips.innerHTML=T.map(function(t,i){return '<button role="tab" data-i="'+i+'" aria-selected="false">'+t+'</button>'}).join('');
function tema(i){i=+i;chips.querySelectorAll('button').forEach(function(b){var on=+b.getAttribute('data-i')===i;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
 var DD=rowsF(),g={b:[],c:[],n:[],s:[]};DD.forEach(function(r){var c=r[2][i];if(c[0])g[c[0]].push([r[0],r[1],c[1],c[2]])});
 var tot=g.b.length+g.c.length+g.n.length+g.s.length,sem=DD.length-tot;
 document.getElementById('tema-head').innerHTML='<h3>'+T[i]+'</h3><p>'+tot+' de '+DD.length+' casas declararam posição neste tema'+(sem?' · '+sem+' não tratam do assunto':'')+'.</p><div class="big-bar" role="img" aria-label="'+ORD.map(function(k){return NM[k]+': '+g[k].length}).join(', ')+'">'+ORD.map(function(k){return g[k].length?'<span style="flex-basis:'+(g[k].length/tot*100)+'%;background:'+COL[k]+'">'+g[k].length+'</span>':''}).join('')+'</div>';
 document.getElementById('tema-cols').innerHTML=ORD.map(function(k){return '<div class="tcol"><div class="th" style="background:'+COL[k]+'">'+NM[k]+'<small>'+g[k].length+'</small></div>'+(g[k].length?'<ul>'+g[k].map(function(x){return '<li><b>'+x[0]+mark(x[0])+'<small>'+x[1]+'</small></b><span class="lb" style="color:'+COL[k]+'">'+x[2]+'</span><p>'+x[3]+'</p></li>'}).join('')+'</ul>':'<div class="empty">Nenhuma casa</div>')+'</div>'}).join('');}
chips.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){tema(b.getAttribute('data-i'))})});
var cur=0;chips.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){cur=+b.getAttribute('data-i')})});
var tg=document.getElementById('only-arvo');if(tg)tg.addEventListener('change',function(){onlyArvo=tg.checked;tema(cur)});
tema(0);
/* modo casa */
var sel=document.getElementById('casa-select');
sel.innerHTML=D.map(function(r,i){return '<option value="'+i+'">'+r[0]+'</option>'}).join('');
function casa(i){var r=D[+i];var n=r[2].filter(function(c){return c[0]}).length;
 document.getElementById('casa-card').innerHTML='<h3>'+r[0]+mark(r[0])+'</h3><div class="meta">Material de referência: '+r[1]+' · posição declarada em '+n+' de '+T.length+' temas</div><div class="casa-grid">'+r[2].map(function(c,j){if(!c[0])return '<div class="casa-item na" style="border-left-color:#DDD9CC"><h4>'+T[j]+'</h4><b>Não trata do tema</b></div>';return '<div class="casa-item" style="border-left-color:'+COL[c[0]]+'"><h4>'+T[j]+'</h4><b style="color:'+COL[c[0]]+'">'+c[1]+'</b><p>'+c[2]+'</p></div>'}).join('')+'</div>';}
sel.addEventListener('change',function(){casa(sel.value)});casa(0);
/* modo geral */
var heat=document.getElementById('heat');
heat.innerHTML='<thead><tr><th>Casa</th>'+T.map(function(t){return '<th>'+t+'</th>'}).join('')+'</tr></thead><tbody>'+D.map(function(r,ri){return '<tr><td><button data-r="'+ri+'">'+r[0]+'</button>'+mark(r[0])+'</td>'+r[2].map(function(c,j){return '<td>'+(c[0]?'<span class="dot" tabindex="0" style="background:'+COL[c[0]]+'" aria-label="'+r[0]+', '+T[j]+': '+c[1]+'" data-t="'+r[0]+' · '+T[j]+' — '+c[1]+'. '+c[2].replace(/"/g,'&quot;')+'"></span>':'<span class="dot z" aria-label="sem menção"></span>')+'</td>'}).join('')+'</tr>'}).join('')+'</tbody>';
heat.querySelectorAll('[data-t]').forEach(function(d){d.addEventListener('mousemove',function(e){tipOn(e,d.getAttribute('data-t'))});d.addEventListener('mouseleave',tipOff);d.addEventListener('focus',function(){var b=d.getBoundingClientRect();tipOn({clientX:b.left,clientY:b.bottom},d.getAttribute('data-t'))});d.addEventListener('blur',tipOff)});
/* modos */
var modes=document.querySelectorAll('.mapa-mode button');
function mode(m){modes.forEach(function(b){var on=b.getAttribute('data-m')===m;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});['tema','casa','geral'].forEach(function(k){document.getElementById('mapa-'+k).hidden=(k!==m)})}
modes.forEach(function(b){b.addEventListener('click',function(){mode(b.getAttribute('data-m'))})});
heat.querySelectorAll('button[data-r]').forEach(function(b){b.addEventListener('click',function(){sel.value=b.getAttribute('data-r');casa(sel.value);mode('casa')})});
})();
}

function bloco3(setTimeout, clearTimeout, requestAnimationFrame, IntersectionObserver) {
(function(){
var P=[
 {n:'Gestão financeira',c:'#123044',q:'Para onde vai o dinheiro, e quanto sobra para construir o futuro?',o:['Orçamento e fluxo de caixa','Dívidas e custo do crédito','Reserva de emergência','Capacidade de poupança'],a:['Diagnóstico do fluxo mensal e das dívidas','Reserva formada antes de investir em risco','Meta de poupança ligada a cada objetivo','Calculadora de inflação pessoal']},
 {n:'Investimentos',c:'#1F674F',q:'Cada real está no lugar certo para o objetivo certo?',o:['Perfil, prazos e liquidez','Alocação por classe de ativo','Custos e eficiência','Rebalanceamento'],a:['Carteira por objetivo, com pesos-alvo e bandas','Prateleira independente, sem comissão','Leitura mensal de gestoras e mercado','Ajustes só dentro das bandas']},
 {n:'Aposentadoria',c:'#5687AF',q:'Quanto preciso acumular para ter a renda que quero, e a partir de quando?',o:['Renda desejada e idade-alvo','INSS e previdência complementar','Capital necessário e prazo','Riscos de longevidade e inflação'],a:['Cálculo da aposentadoria-base','Plano de aportes por fase da vida','PGBL ou VGBL só quando a conta fecha','Revisão a cada mudança relevante']},
 {n:'Riscos e seguros',c:'#C08A34',q:'O que acontece com o plano se algo der errado?',o:['Morte, invalidez e doença','Proteção da renda da família','Patrimônio e responsabilidade civil','Saúde'],a:['Mapa de coberturas e lacunas','Dimensionamento pela necessidade real','Sem venda de seguro: recomendação isenta','Revisão quando a família muda']},
 {n:'Planejamento fiscal',c:'#B34A3C',q:'Quanto do retorno realmente fica com você?',o:['Imposto sobre investimentos','Dedução e regimes da previdência','Isenções e come-cotas','Ordem de resgate'],a:['Comparação de produtos sempre líquida de imposto','Escolha de veículo por objetivo e prazo','Uso eficiente da dedução do PGBL','Articulação com o contador']},
 {n:'Planejamento sucessório',c:'#8B7355',q:'Como o patrimônio chega a quem você quer, com menos custo e conflito?',o:['Inventário e seus custos','ITCMD e regras estaduais','Previdência como instrumento','Testamento e estruturas'],a:['Diagnóstico de custos e prazos de uma sucessão','Uso de instrumentos que já existem no plano','Encaminhamento a advogados quando necessário','Plano conversado com a família']}
];
var svg=document.getElementById('pillar-svg');if(!svg)return;
var cx=160,cy=160,R=150,r=78,h='';
function pt(rad,a){return [cx+rad*Math.cos(a),cy+rad*Math.sin(a)]}
P.forEach(function(p,i){var a0=-Math.PI/2+i*Math.PI/3+0.02,a1=a0+Math.PI/3-0.04;var o0=pt(R,a0),o1=pt(R,a1),n0=pt(r,a0),n1=pt(r,a1);
 h+='<path tabindex="0" role="button" aria-label="'+p.n+'" data-i="'+i+'" fill="'+p.c+'" d="M'+o0+' A'+R+' '+R+' 0 0 1 '+o1+' L'+n1+' A'+r+' '+r+' 0 0 0 '+n0+' Z"/>';
 var m=pt((R+r)/2,(a0+a1)/2);h+='<text x="'+m[0]+'" y="'+(m[1]+8)+'" text-anchor="middle" font-family="Plus Jakarta Sans, Arial" font-size="24" font-weight="800" fill="#fff" pointer-events="none">'+(i+1)+'</text>'});
h+='<text x="160" y="152" text-anchor="middle" font-family="Plus Jakarta Sans, Arial" font-size="14" fill="#5A635C">seu</text><text x="160" y="176" text-anchor="middle" font-family="Plus Jakarta Sans, Arial" font-size="22" font-weight="800" fill="#123044">plano</text>';
svg.innerHTML=h;
var tabs=document.getElementById('pillar-tabs');
tabs.innerHTML=P.map(function(p,i){return '<button role="tab" data-i="'+i+'" aria-selected="false"><i style="background:'+p.c+'"></i>'+(i+1)+'. '+p.n+'</button>'}).join('');
var panel=document.getElementById('pillar-panel');
function sel(i){i=+i;var p=P[i];
 svg.querySelectorAll('path').forEach(function(x){var on=+x.getAttribute('data-i')===i;x.classList.toggle('on',on);x.classList.toggle('dim',!on)});
 tabs.querySelectorAll('button').forEach(function(b){var on=+b.getAttribute('data-i')===i;b.classList.toggle('on',on);b.setAttribute('aria-selected',on?'true':'false')});
 panel.innerHTML='<div class="pn" style="color:'+p.c+'">Pilar '+(i+1)+' de 6</div><h3>'+p.n+'</h3><p class="q">'+p.q+'</p><div class="cols"><div><h4>O que olhamos</h4><ul>'+p.o.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div><div><h4>Como a ARVO faz</h4><ul>'+p.a.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div></div>'}
svg.querySelectorAll('path').forEach(function(x){x.addEventListener('click',function(){sel(x.getAttribute('data-i'))});x.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(x.getAttribute('data-i'))}})});
tabs.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){sel(b.getAttribute('data-i'))})});
sel(0);
})();
}

function bloco4(setTimeout, clearTimeout, requestAnimationFrame, IntersectionObserver) {
(function(){
var el=document.getElementById('curva-chart');if(!el)return;
var Y=[1,2,3,4,5,6,7,8,9,10];
var PRE={a:[13.3811,13.7085,13.982,14.1568,14.26,14.3177,14.3479,14.3613,14.3647,14.3621],d5:[12.6798,12.6001,12.7085,12.8172,12.894,12.9423,12.971,12.9869,12.995,12.9982],d:[12.5792,12.3056,12.3314,12.4179,12.4907,12.5343,12.5516,12.55,12.5361,12.5151]};
var IPC={a:[6.5624,7.3673,7.5581,7.6114,7.6177,7.5992,7.5653,7.5221,7.4738,7.4233],d5:[6.359,6.9651,7.0733,7.0933,7.0882,7.0698,7.0423,7.0091,6.9725,6.9346],d:[6.2834,6.6644,6.6952,6.6971,6.6977,6.6971,6.6943,6.6894,6.6825,6.6742]};
var W=760,H=320,L=56,R=24,Tp=20,B=44;
function fx(x){return L+(x-1)/(10-1)*(W-L-R)}
function fy(y,lo,hi){return Tp+(hi-y)/(hi-lo)*(H-Tp-B)}
function f2(v){return v.toFixed(2).replace('.',',')}
var tipEl=document.querySelector('.tip');
function tOn(e,t){if(!tipEl)return;tipEl.textContent=t;tipEl.style.opacity=1;tipEl.style.left=Math.min(e.clientX+14,window.innerWidth-250)+'px';tipEl.style.top=(e.clientY+14)+'px'}
function tOff(){if(tipEl)tipEl.style.opacity=0}
function axes(lo,hi,step){var g='';for(var v=lo;v<=hi+1e-9;v+=step){var y=fy(v,lo,hi);g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'" stroke="#E2DED2"/><text x="'+(L-8)+'" y="'+(y+4)+'" text-anchor="end" font-size="12" fill="#5A635C" font-family="Plus Jakarta Sans, Arial">'+v.toFixed(1).replace('.',',')+'%</text>'}
 [1,2,3,4,5,6,7,8,9,10].forEach(function(x){g+='<text x="'+fx(x)+'" y="'+(H-B+22)+'" text-anchor="middle" font-size="12" fill="#5A635C" font-family="Plus Jakarta Sans, Arial">'+x+(x===1?' ano':' anos')+'</text>'});return g}
function line(v,lo,hi,col,dash,lbl,kind){var d=v.map(function(y,i){return (i?'L':'M')+fx(Y[i])+' '+fy(y,lo,hi)}).join(' ');
 var g='<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="3" stroke-linejoin="round"'+(dash?' stroke-dasharray="6 5"':'')+'/>';
 v.forEach(function(y,i){g+='<circle class="pt" cx="'+fx(Y[i])+'" cy="'+fy(y,lo,hi)+'" r="'+(dash?4:6)+'" fill="#fff" stroke="'+col+'" stroke-width="3" data-t="'+kind+' '+Y[i]+(Y[i]===1?' ano':' anos')+' · '+lbl+': '+f2(y)+'%"/>'});return g}
function bind(){el.querySelectorAll('[data-t]').forEach(function(c){c.addEventListener('mousemove',function(e){tOn(e,c.getAttribute('data-t'))});c.addEventListener('mouseleave',tOff)})}
var cap=document.getElementById('curva-cap');
var LEG='<div class="curva-legend"><span><i style="background:#B34A3C"></i>2/out, antes do 1º turno</span><span><i style="background:#1F674F"></i>5/out, dia seguinte</span><span><i style="background:#123044"></i>9/out, último fechamento</span></div>';
function draw(m){var svg;
 if(m==='pre'){var lo=12,hi=14.5;svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Curva prefixada ANBIMA antes e depois do primeiro turno">'+axes(lo,hi,0.5);
  var sl=fy(13.75,lo,hi);svg+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+sl+'" y2="'+sl+'" stroke="#8A5F17" stroke-dasharray="3 4"/><text x="'+(W-R)+'" y="'+(sl-6)+'" text-anchor="end" font-size="12" font-weight="700" fill="#8A5F17" font-family="Plus Jakarta Sans, Arial">Selic 13,75%</text>';
  svg+=line(PRE.a,lo,hi,'#B34A3C',false,'2/out','Prefixado')+line(PRE.d5,lo,hi,'#1F674F',true,'5/out','Prefixado')+line(PRE.d,lo,hi,'#123044',false,'9/out','Prefixado')+'</svg>'+LEG;
  cap.textContent='Antes da eleição, quanto mais longo o prazo, maior a taxa. Uma semana depois, a curva ficou plana perto de 12,5% e abaixo da Selic. Passe o cursor nos pontos para ver as taxas.'}
 else if(m==='real'){var lo=6,hi=8;svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Curva de juro real ANBIMA antes e depois do primeiro turno">'+axes(lo,hi,0.5);
  svg+=line(IPC.a,lo,hi,'#B34A3C',false,'2/out','IPCA+')+line(IPC.d5,lo,hi,'#1F674F',true,'5/out','IPCA+')+line(IPC.d,lo,hi,'#123044',false,'9/out','IPCA+')+'</svg>'+LEG;
  cap.textContent='O juro real caiu de 7,4% a 7,6% para perto de 6,7% em quase todos os prazos. Ainda é alto para padrões históricos, mas parte do prêmio já saiu.'}
 else {var K=[0,1,2,4,9],max=2,bw=46,grp=(W-L-R)/K.length,base=Tp+30,hh=H-Tp-B-70;
  svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Queda das taxas por prazo">';
  K.forEach(function(k,i){var x0=L+i*grp+(grp-2*bw-10)/2;[[PRE,'#123044','Prefixado'],[IPC,'#1F674F','IPCA+']].forEach(function(c,j){var dlt=c[0].a[k]-c[0].d[k],h=dlt/max*hh,x=x0+j*(bw+10);
   svg+='<rect class="pt" x="'+x+'" y="'+base+'" width="'+bw+'" height="'+h+'" rx="5" fill="'+c[1]+'" data-t="'+c[2]+' '+Y[k]+(Y[k]===1?' ano':' anos')+': de '+f2(c[0].a[k])+'% para '+f2(c[0].d[k])+'%"/><text x="'+(x+bw/2)+'" y="'+(base+h+18)+'" text-anchor="middle" font-size="13" font-weight="800" fill="#123044" font-family="Plus Jakarta Sans, Arial">−'+dlt.toFixed(2).replace('.',',')+'</text>'});
   svg+='<text x="'+(x0+bw+5)+'" y="'+(base-10)+'" text-anchor="middle" font-size="13" fill="#5A635C" font-family="Plus Jakarta Sans, Arial">'+Y[k]+(Y[k]===1?' ano':' anos')+'</text>'});
  svg+='</svg><div class="curva-legend"><span><i style="background:#123044"></i>Prefixado</span><span><i style="background:#1F674F"></i>IPCA+ (juro real)</span></div>';cap.textContent='Queda em pontos percentuais entre 2/out e 9/out. O prefixado longo caiu mais que o curto; no juro real, a queda foi parecida em todos os prazos acima de 2 anos.'}
 el.innerHTML=svg;bind()}
var seg=document.getElementById('curva-seg');
seg.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){seg.querySelectorAll('button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false')});b.classList.add('on');b.setAttribute('aria-selected','true');draw(b.getAttribute('data-s'))})});
draw('pre');
})();
}

function bloco5(setTimeout, clearTimeout, requestAnimationFrame, IntersectionObserver) {
(function(){
var P={"G": [["Reserva (100% Conservador)", [["Tesouro Selic / Fundo Simples", 1.0]]], ["90% Conservador", [["Tesouro Selic / Fundo Simples", 0.9], ["ARX Fuji", 0.1]]], ["Abrigo", [["Tesouro Selic / Fundo Simples", 0.8], ["ARX Fuji", 0.03], ["JGP Corporate", 0.03], ["BNP Paribas Rubi", 0.08], ["Augme 30 CIC", 0.03], ["Ibiuna Credit", 0.03]]], ["Abrigo-Ritmo", [["Tesouro Selic / Fundo Simples", 0.7], ["ARX Fuji", 0.05], ["JGP Corporate", 0.05], ["BNP Paribas Rubi", 0.06], ["Augme 30 CIC", 0.04], ["Ibiuna Credit", 0.05], ["ARX Hedge Infra", 0.05]]], ["Ritmo", [["Tesouro Selic / Fundo Simples", 0.6], ["ARX Fuji", 0.03], ["Sparta Deb Inc FIC Incentivados", 0.04], ["BNP Paribas Rubi", 0.04], ["Ibiuna Credit", 0.04], ["ARX Hedge Infra", 0.07], ["Verde AM X60", 0.05], ["IVVB11", 0.04], ["Wellington Ventura Advisory", 0.03], ["DIVO11", 0.03], ["SPX Patriot FIF CIC Ações RL", 0.03]]], ["Ritmo-Visão", [["Tesouro Selic / Fundo Simples", 0.5], ["ARX Fuji", 0.05], ["Sparta Deb Inc FIC Incentivados", 0.04], ["BNP Paribas Rubi", 0.04], ["Ibiuna Credit", 0.04], ["ARX Hedge Infra", 0.07], ["Verde AM X60", 0.06], ["IVVB11", 0.06], ["Wellington Ventura Advisory", 0.05], ["DIVO11", 0.04], ["SPX Patriot FIF CIC Ações RL", 0.05]]], ["Visão", [["Tesouro Selic / Fundo Simples", 0.4], ["ARX Fuji", 0.06], ["Sparta Deb Inc FIC Incentivados", 0.05], ["BNP Paribas Rubi", 0.05], ["Ibiuna Credit", 0.04], ["ARX Hedge Infra", 0.08], ["Verde AM X60", 0.05], ["SPX Patriot FIF CIC Ações RL", 0.05], ["IVVB11", 0.05], ["NASD11", 0.05], ["Wellington Ventura Advisory", 0.07], ["DIVO11", 0.05]]], ["Visão-Oceano", [["Tesouro Selic / Fundo Simples", 0.3], ["ARX Fuji", 0.05], ["Sparta Deb Inc FIC Incentivados", 0.05], ["BNP Paribas Rubi", 0.04], ["Ibiuna Credit", 0.04], ["ARX Hedge Infra", 0.08], ["Kapitalo Kappa", 0.02], ["Kinea Atlas", 0.04], ["SPX Patriot FIF CIC Ações RL", 0.08], ["IVVB11", 0.07], ["NASD11", 0.07], ["Wellington Ventura Advisory", 0.08], ["DIVO11", 0.08]]], ["Oceano", [["Tesouro Selic / Fundo Simples", 0.2], ["ARX Fuji", 0.04], ["Sparta Deb Inc FIC Incentivados", 0.04], ["BNP Paribas Rubi", 0.05], ["Ibiuna Credit", 0.04], ["ARX Hedge Infra", 0.06], ["Kapitalo Kappa", 0.04], ["Kinea Atlas", 0.04], ["SPX Patriot FIF CIC Ações RL", 0.1], ["IVVB11", 0.1], ["NASD11", 0.09], ["Wellington Ventura Advisory", 0.1], ["DIVO11", 0.1]]]], "Q": [["Reserva (100% Conservador)", [["Tesouro Selic / Fundo Simples", 1.0]]], ["90% Conservador", [["Tesouro Selic / Fundo Simples", 0.9], ["VALORA GUARDIAN ADVISORY FIDC – RL", 0.05], ["ARX Fuji", 0.05]]], ["Abrigo", [["Tesouro Selic / Fundo Simples", 0.8], ["ARX Fuji", 0.03], ["VALORA GUARDIAN ADVISORY FIDC – RL", 0.08], ["Kinea Oportunidade FIM", 0.03], ["Augme 30 CIC", 0.03], ["Ibiuna Credit", 0.03]]], ["Abrigo-Ritmo", [["Tesouro Selic / Fundo Simples", 0.7], ["ARX Fuji", 0.05], ["VALORA GUARDIAN ADVISORY FIDC – RL", 0.06], ["Kinea Oportunidade FIM", 0.04], ["Augme 30 CIC", 0.05], ["Ibiuna Credit", 0.04], ["ARX Hedge Infra", 0.06]]], ["Ritmo", [["Tesouro Selic / Fundo Simples", 0.6], ["ARX Hedge Infra", 0.04], ["Kinea Oportunidade FIF", 0.04], ["VALORA GUARDIAN ADVISORY FIDC – RL", 0.05], ["ARX Fuji", 0.03], ["Ibiuna Credit", 0.03], ["Verde AM X60", 0.03], ["Wellington Ventura Advisory", 0.04], ["SPX Patriot FIF CIC Ações RL", 0.06], ["IVVB11", 0.05], ["DIVO11", 0.03]]], ["Ritmo-Visão", [["Tesouro Selic / Fundo Simples", 0.5], ["ARX Hedge Infra", 0.05], ["Kinea Oportunidade FIF", 0.05], ["VALORA GUARDIAN ADVISORY FIDC – RL", 0.05], ["ARX Fuji", 0.05], ["Ibiuna Credit", 0.04], ["Verde AM X60", 0.06], ["Wellington Ventura Advisory", 0.04], ["SPX Patriot FIF CIC Ações RL", 0.04], ["IVVB11", 0.04], ["DIVO11", 0.04], ["NASD11", 0.04]]], ["Visão", [["Tesouro Selic / Fundo Simples", 0.4], ["VALORA GUARDIAN ADVISORY FIDC – RL", 0.04], ["Sparta Deb Inc FIC Incentivados", 0.04], ["BNP Paribas Rubi", 0.04], ["Ibiuna Credit", 0.04], ["ARX Hedge Infra", 0.06], ["Kinea Oportunidade FIF", 0.05], ["Truxt Long Bias", 0.04], ["Verde AM X60", 0.06], ["SPX Patriot FIF CIC Ações RL", 0.06], ["IVVB11", 0.04], ["NASD11", 0.04], ["Wellington Ventura Advisory", 0.05], ["DIVO11", 0.04]]], ["Visão-Oceano", [["Tesouro Selic / Fundo Simples", 0.3], ["ARX Fuji", 0.03], ["VALORA GUARDIAN ADVISORY FIDC – RL", 0.05], ["Sparta Deb Inc FIC Incentivados", 0.05], ["BNP Paribas Rubi", 0.04], ["Ibiuna Credit", 0.04], ["ARX Hedge Infra", 0.07], ["Kinea Oportunidade FIF", 0.04], ["Truxt Long Bias", 0.05], ["Verde AM X60", 0.07], ["SPX Patriot FIF CIC Ações RL", 0.07], ["DIVO11", 0.05], ["Wellington Ventura Advisory", 0.05], ["NASD11", 0.04], ["IVVB11", 0.05]]], ["Oceano", [["Tesouro Selic / Fundo Simples", 0.2], ["VALORA GUARDIAN ADVISORY FIDC – RL", 0.03], ["ARX Hedge Infra", 0.04], ["BNP Paribas Rubi", 0.02], ["Kinea Oportunidade FIF", 0.05], ["Truxt Long Bias", 0.05], ["Verde AM X60", 0.08], ["IVVB11", 0.1], ["NASD11", 0.08], ["Wellington Ventura Advisory", 0.1], ["DIVO11", 0.1], ["SPX Patriot FIF CIC Ações RL", 0.1], ["WRLD11", 0.05]]]]};
var F={"Tesouro Selic / Fundo Simples": ["Tesouro Nacional", "liq", "n", "Âncora", "Selic em 13,75% e CDI de 14,5% em 12 meses: a liquidez remunera bem."], "ARX Fuji": ["ARX", "cred", "c", "Seletivo", "ARX vê spreads de crédito comprimidos e mantém postura seletiva."], "JGP Corporate": ["JGP", "cred", "z", "Sem carta recente", "Sem relatório de crédito público no mês; no multimercado, títulos privados contribuíram."], "BNP Paribas Rubi": ["BNP Paribas", "cred", "z", "Sem carta recente", "Lâmina de agosto: retorno acima do CDI com volatilidade muito baixa; sem comentário de gestão."], "Augme 30 CIC": ["Augme", "estr", "z", "Sem carta recente", "Último material público é de maio de 2026."], "Ibiuna Credit": ["Ibiuna", "cred", "c", "Atenção", "54% do CDI em setembro por juros e proteções; espera ajuste longo em incentivadas e CDI+ calmo."], "VALORA GUARDIAN ADVISORY FIDC – RL": ["Valora", "estr", "z", "Sem carta recente", "Última carta pública é de maio de 2026, com a família Guardian acima do CDI."], "Kinea Oportunidade FIM": ["Kinea", "cred", "b", "Em linha", "99% do CDI em setembro; carrego de CDI + 1,68%, prazo médio de 2,8 anos, busca oportunidades em high yield."], "Kinea Oportunidade FIF": ["Kinea", "cred", "b", "Em linha", "99% do CDI em setembro; carrego de CDI + 1,68%, prazo médio de 2,8 anos, busca oportunidades em high yield."], "ARX Hedge Infra": ["ARX", "inc", "s", "Atenção", "Incentivadas abriram cerca de 40 pontos-base em setembro; ARX vê cenário negativo para spreads no curto prazo."], "Sparta Deb Inc FIC Incentivados": ["Sparta", "inc", "s", "Atenção", "Sparta relata abertura de 40 pontos-base com pouco fluxo e atenção ao comportamento dos cotistas."], "Verde AM X60": ["Verde", "mm", "b", "Em linha", "Verde subiu acima do CDI em agosto e retomou bolsa brasileira e real (fonte secundária)."], "Kapitalo Kappa": ["Kapitalo", "mm", "b", "Em linha", "Mês forte em agosto puxado por bolsa brasileira; ano ainda abaixo do CDI."], "Kinea Atlas": ["Kinea", "mm", "b", "Em linha", "Comprada taticamente em Brasil, cautelosa em IA e com cesta de commodities como proteção."], "SPX Patriot FIF CIC Ações RL": ["SPX", "br", "z", "Sem carta recente", "Sem carta pública; o rali da bolsa brasileira favorece a classe."], "Truxt Long Bias": ["Truxt", "br", "z", "Sem carta recente", "Lâmina de agosto: +23,6% no ano, com volatilidade alta (cerca de 25% ao ano)."], "DIVO11": ["Itaú Asset (ETF)", "br", "n", "Índice", "ETF de dividendos brasileiros: acompanha o ciclo doméstico e o rali pós-eleição."], "IVVB11": ["BlackRock (ETF)", "intl", "n", "Índice", "S&P 500: BlackRock acima do neutro em EUA; Wellington neutra; real forte reduz o custo de entrada."], "NASD11": ["ETF Nasdaq-100", "intl", "c", "Atenção", "Concentra tecnologia e IA, tema com maior divergência entre as casas."], "WRLD11": ["Investo (ETF)", "intl", "n", "Índice", "Ações globais diversificadas; Wellington acima do neutro em ações globais."], "Wellington Ventura Advisory": ["Wellington", "intl", "b", "Em linha", "Wellington: acima do neutro em ações globais e emergentes, neutra em EUA (setembro)."]};
var CLS={liq:['Liquidez (Selic)','#123044'],cred:['Crédito CDI+','#2B6E76'],estr:['Crédito estruturado','#8AB0B2'],inc:['Debêntures incentivadas','#4FA080'],mm:['Multimercados','#C08A34'],br:['Ações Brasil','#B34A3C'],intl:['Internacional','#5687AF']};
var ORDC=['liq','cred','estr','inc','mm','br','intl'];
var ST={b:'t-buy',c:'t-sel',n:'t-neu',s:'t-sell',z:'t-na'};
var NAMES=['Reserva','90% Conservador','Abrigo','Abrigo-Ritmo','Ritmo','Ritmo-Visão','Visão','Visão-Oceano','Oceano'];
var pub='G',lv=6;
function pct(v){return (Math.round(v*1000)/10).toString().replace('.',',')+'%'}
function draw(){var L=P[pub][lv],funds=L[1].slice().sort(function(a,b){return ORDC.indexOf(F[a[0]][1])-ORDC.indexOf(F[b[0]][1])||b[1]-a[1]});
 document.getElementById('lvl-name').textContent=NAMES[lv]+' · '+(pub==='G'?'Geral':'Qualificado');
 var agg={};funds.forEach(function(f){var c=F[f[0]][1];agg[c]=(agg[c]||0)+f[1]});
 var el=document.getElementById('cart-pie');
 if(window.__donut){window.__donut(el,ORDC.filter(function(k){return agg[k]}).map(function(k){return {n:CLS[k][0],v:Math.round(agg[k]*1000)/10,c:CLS[k][1]}}),NAMES[lv])}
 document.querySelector('#cart-tbl tbody').innerHTML=funds.map(function(f){var m=F[f[0]];var nm=f[0].replace('VALORA GUARDIAN ADVISORY FIDC – RL','Valora Guardian Advisory FIDC');return '<tr><td><b>'+nm+'</b><small>'+m[0]+'</small></td><td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+CLS[m[1]][1]+';margin-right:6px"></span>'+CLS[m[1]][0]+'</td><td><b>'+pct(f[1])+'</b></td><td class="rd">'+(m[2]==='z'?'<span class="t-na" style="font-size:12.5px">'+m[3]+'</span>':'<span class="tag '+ST[m[2]]+'">'+m[3]+'</span>')+'<div>'+m[4]+'</div></td></tr>'}).join('');}
var r=document.getElementById('lvl-range');r.addEventListener('input',function(){lv=+r.value;draw()});
var ps=document.getElementById('pub-seg');ps.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){ps.querySelectorAll('button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false')});b.classList.add('on');b.setAttribute('aria-selected','true');pub=b.getAttribute('data-p');draw()})});
draw();
})();
}

function bloco6(setTimeout, clearTimeout, requestAnimationFrame, IntersectionObserver) {
(function(){
var P=[['Abrigo',[97,3,0],80,0.49,0.0,13.1,1.03,101],['Ritmo',[79,3,18],60,1.85,0.0,15.0,1.17,119],['Visão',[67,10,23],40,3.01,-0.67,16.4,1.27,131],['Oceano',[34,13,53],20,5.84,-2.19,19.6,1.50,161]];
var C=['#123044','#5687AF','#1F674F'];
function f(v,d){return v.toFixed(d).replace('.',',')}
var tb=document.querySelector('#ladder tbody');
if(tb){tb.innerHTML=P.map(function(r){var z=r[1];
 return '<tr><td>'+r[0]+'</td><td class="zma"><div class="zbar" title="Zaga '+z[0]+'% · meio '+z[1]+'% · ataque '+z[2]+'%">'+z.map(function(v,i){return v?'<i style="width:'+v+'%;background:'+C[i]+'"></i>':''}).join('')+'</div><div style="font-size:12.5px;color:var(--muted);margin-top:4px">'+z.join(' · ')+'</div></td><td>'+r[2]+'%</td><td><b style="color:var(--green)">'+f(r[5],1)+'%</b></td><td>'+f(r[6],2)+'%</td><td>'+r[7]+'%</td><td>'+f(r[3],2)+'%</td><td>'+(r[4]===0?'0,0%':'−'+f(-r[4],1)+'%')+'</td></tr>'}).join('')+'<tr style="background:#F7F5EE"><td style="color:var(--muted)">CDI</td><td style="color:var(--muted);font-size:13px">referência</td><td>—</td><td>12,9%</td><td>1,02%</td><td>100%</td><td>—</td><td>—</td></tr>'}
var rg=document.getElementById('stress-r'),out=document.getElementById('stress-o'),box=document.getElementById('stress-rows');
function stress(){if(!rg||!box)return;var a=+rg.value,MAX=25;
 out.textContent=a?('−'+a+'%'):'0%';
 box.innerHTML=P.map(function(r){var z=r[1];var loss=(z[2]*a/100)+(z[1]*a/300)+(z[0]*1/100);var bt=-r[4];
  return '<div class="srow"><b>'+r[0]+'</b><div class="strack"><span class="bt" style="width:'+Math.min(100,bt/MAX*100)+'%"></span><span class="st" style="width:'+Math.min(100,loss/MAX*100)+'%"></span></div><span class="val">−'+f(loss,1)+'%</span></div>'}).join('')}
if(rg){rg.addEventListener('input',stress);stress()}
})();
}

function bloco7(setTimeout, clearTimeout, requestAnimationFrame, IntersectionObserver) {
(function(){
var root=document.getElementById('cx');if(!root)return;
var CDI=14.5,DOL=-8.8;
var SN={agro:'Agronegócio',imob:'Imobiliário',gov:'Governo Brasil',banc:'Bancos',ener:'Energia e saneamento',min:'Mineração e petróleo',cons:'Consumo',div:'Diversificado',eua:'Ações EUA',tec:'Tecnologia',geua:'Governo EUA'};
var CL={emp:['Empresa','#7A5C3E'],imo:['Imóveis','#8B7355'],rf:['Renda fixa Brasil','#123044'],mm:['Multimercados','#C08A34'],acb:['Ações Brasil','#B34A3C'],fii:['FIIs','#C9B8A3'],prev:['Previdência','#4FA080'],ext:['Exterior','#5687AF']};
var A=[
['Empresa familiar','Participação na empresa (35%)','emp',6.0,null,null,{agro:6.0},'ilq',0],
['Imóveis','Residência','imo',2.8,null,null,{imob:2.8},'ilq',0],
['Imóveis','Sala comercial alugada','imo',1.2,null,null,{imob:1.2},'ilq',0],
['BTG Pactual','Tesouro IPCA+ 2035','rf',1.0,16.8,null,{gov:1},'liq',0],
['BTG Pactual','Tesouro Selic','rf',0.6,14.4,null,{gov:.6},'liq',0],
['BTG Pactual','CRA do agronegócio','rf',0.5,13.1,null,{agro:.5},'liq',0],
['BTG Pactual','Debêntures incentivadas','rf',0.5,9.8,null,{ener:.5},'liq',0,1],
['BTG Pactual','Fundo multimercado macro','mm',0.4,11.6,null,{div:.4},'liq',0],
['BTG Pactual','Carteira de ações','acb',0.6,21.5,null,{banc:.2,min:.2,agro:.1,ener:.1},'liq',0],
['XP','CDB pós-fixado (bancos médios)','rf',0.6,15.2,null,{banc:.6},'liq',0],
['XP','FIIs de logística e lajes','fii',0.5,8.4,null,{imob:.5},'liq',0],
['XP','Fundo de ações','acb',0.4,18.9,null,{banc:.1,ener:.1,cons:.2},'liq',0],
['XP','LCI','rf',0.3,13.0,null,{banc:.3},'liq',0,1],
['XP','ETF S&P 500 (IVVB11)','ext',0.4,9.5,null,{eua:.4},'liq',0],
['Itaú Private','LCA','rf',0.8,13.3,null,{banc:.8},'liq',0,1],
['Itaú Private','Fundo DI','rf',0.6,14.1,null,{gov:.6},'liq',0],
['Itaú Private','CDB Itaú','rf',0.4,14.3,null,{banc:.4},'liq',0],
['Bradesco Previdência','VGBL renda fixa','prev',1.2,13.6,null,{gov:.8,banc:.4},'prev',0],
['Conta nos EUA','ETF S&P 500','ext',1.0,7.8,18.2,{eua:1.0},'liq',1],
['Conta nos EUA','Treasuries','ext',0.8,-4.6,4.6,{geua:.8},'liq',1],
['Conta nos EUA','Ações de tecnologia','ext',0.4,14.9,26.0,{tec:.4},'liq',1],
['Conta nos EUA','Caixa em dólar','ext',0.2,-4.4,4.8,{geua:.2},'liq',1]];
var DEBT=0.8,scope='all';
function V(){return A.filter(function(a){return scope==='all'||(scope==='br'?!a[8]:a[8])})}
function f1(v){return v.toFixed(1).replace('.',',')}
function mi(v){return 'R$ '+f1(v)+' mi'}
function pc(v){return f1(v)+'%'}
function sum(l,f){return l.reduce(function(s,x){return s+f(x)},0)}
function casas(l){var o=[],m={};l.forEach(function(a){if(!m[a[0]]){m[a[0]]={n:a[0],v:0,l:[]};o.push(m[a[0]])}m[a[0]].v+=a[3];m[a[0]].l.push(a)});return o}
function retU(l){var f=l.filter(function(a){return a[5]!==null&&a[5]!==undefined});var cur=sum(f,function(a){return a[3]}),beg=sum(f,function(a){return a[3]/(1+a[5]/100)});return beg?(cur/beg-1)*100:0}
function ret(l){var fin=l.filter(function(a){return a[4]!==null});var cur=sum(fin,function(a){return a[3]}),beg=sum(fin,function(a){return a[3]/(1+a[4]/100)});return {cur:cur,gain:cur-beg,r:beg?(cur/beg-1)*100:0}}
function grow(el){el.querySelectorAll('[data-w]').forEach(function(b){b.style.width='0';var w=b.getAttribute('data-w');if(reduce)b.style.width=w+'%';else setTimeout(function(){b.style.width=w+'%'},60)})}
function render(i){var l=V(),T=sum(l,function(a){return a[3]}),cs=casas(l);
 if(i===0){var el=document.getElementById('cx-src');el.innerHTML=cs.map(function(c){var k={'Empresa familiar':'Agronegócio','Imóveis':'Residência e sala','Conta nos EUA':'Offshore, em US$'}[c.n]||(c.l.length+(c.l.length>1?' ativos':' ativo'));return '<div><small>'+c.n+'</small><span class="pc">'+pc(c.v/T*100)+'</span><b>'+mi(c.v)+'</b><em>'+k+'</em></div>'}).join('');
  var cards=el.querySelectorAll('div');srcT.forEach(clearTimeout);srcT=[];cards.forEach(function(c,k){if(reduce)c.classList.add('in');else srcT.push(setTimeout(function(){c.classList.add('in')},120+k*260))});
  document.getElementById('cx-src-note').textContent=cs.length+' fontes e '+l.length+' ativos somando '+mi(T)+'. Cada extrato mostra só um pedaço.'}
 if(i===1){var d=scope==='ex'?0:DEBT;var b=document.getElementById('cx-bal');b.innerHTML='<div><small>Ativos</small><b data-n="'+T+'"></b></div><div class="neg"><small>Dívidas</small><b data-n="'+(-d)+'"></b></div><div class="pl"><small>Patrimônio líquido</small><b data-n="'+(T-d)+'"></b></div>';
  b.querySelectorAll('[data-n]').forEach(function(x){var t=parseFloat(x.getAttribute('data-n'));function o(v){return (v<0?'−':'')+mi(Math.abs(v))}if(reduce){x.textContent=o(t);return}var t0=null;function st(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1100);x.textContent=o(t*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(st)}requestAnimationFrame(st)});
  var lq={liq:0,prev:0,ilq:0};l.forEach(function(a){lq[a[7]]+=a[3]});var C={liq:['Até 30 dias','#1F674F'],prev:['Previdência','#A8C5A1'],ilq:['Empresa e imóveis','#8E948C']};
  var h=document.getElementById('cx-liq');h.innerHTML=Object.keys(lq).filter(function(k){return lq[k]>0}).map(function(k){return '<i data-w="'+(lq[k]/T*100)+'" style="background:'+C[k][1]+'"></i>'}).join('');grow(h);
  document.getElementById('cx-liq-l').innerHTML=Object.keys(lq).filter(function(k){return lq[k]>0}).map(function(k){return '<span><i style="background:'+C[k][1]+'"></i>'+C[k][0]+' · '+pc(lq[k]/T*100)+' · '+mi(lq[k])+'</span>'}).join('')}
 if(i===2){var ex=scope==='ex',hd='<thead><tr><th>Ativo</th><th>Classe</th><th>Valor</th><th>% do total</th>'+(ex?'<th>12m em US$</th>':'')+'<th>12m em R$</th><th>% do CDI</th></tr></thead><tbody>';
  cs.forEach(function(c){var rc=ret(c.l);hd+='<tr class="g"><td>'+c.n+'</td><td></td><td>'+mi(c.v)+'</td><td>'+pc(c.v/T*100)+'</td>'+(ex?'<td>'+pc(retU(c.l))+'</td>':'')+'<td>'+(rc.cur?pc(rc.r):'—')+'</td><td>'+(rc.cur?Math.round(rc.r/CDI*100)+'%':'—')+'</td></tr>';
   c.l.forEach(function(a){var r=a[4];hd+='<tr class="rw"><td>'+a[1]+(a[9]?'<span class="tag">isento</span>':'')+'</td><td>'+CL[a[2]][0]+'</td><td>'+mi(a[3])+'</td><td>'+pc(a[3]/T*100)+'</td>'+(ex?'<td class="'+(a[5]>=0?'up':'dn')+'">'+pc(a[5])+'</td>':'')+'<td class="'+(r===null?'':(r>=0?'up':'dn'))+'">'+(r===null?'avaliação':pc(r))+'</td><td>'+(r===null?'—':Math.round(r/CDI*100)+'%')+'</td></tr>'})});
  var rt=ret(l);hd+='<tr class="tot"><td>Total</td><td></td><td>'+mi(T)+'</td><td>100%</td>'+(ex?'<td>'+pc(retU(l))+'</td>':'')+'<td>'+pc(rt.r)+'</td><td>'+Math.round(rt.r/CDI*100)+'%</td></tr></tbody>';
  var tb=document.getElementById('cx-tab');tb.innerHTML=hd;tb.parentNode.scrollTop=0;var rows=tb.querySelectorAll('tr.rw');rows.forEach(function(r,k){if(reduce)r.classList.add('in');else srcT.push(setTimeout(function(){r.classList.add('in')},80+k*90))})}
 if(i===3){var rt=ret(l);var fin=rt.cur;document.getElementById('cx-kp').innerHTML='<div><span class="cx-k">Carteira financeira</span><b>'+mi(fin)+'</b><em>'+pc(fin/T*100)+' do patrimônio</em></div><div class="hi"><span class="cx-k">Rentabilidade 12 meses</span><b>'+pc(rt.r)+'</b><em>CDI: '+pc(CDI)+'</em></div><div><span class="cx-k">% do CDI</span><b>'+Math.round(rt.r/CDI*100)+'%</b><em>global, ponderado</em></div><div><span class="cx-k">Ganho em 12 meses</span><b>'+mi(rt.gain)+'</b><em>bruto de IR</em></div>';
  var rows=cs.filter(function(c){return ret(c.l).cur>0}).map(function(c){var r=ret(c.l);return {n:c.n,p:r.r/CDI*100}});rows.push({n:'Total',p:rt.r/CDI*100,t:1});var MX=130;
  var rb=document.getElementById('cx-rb');rb.innerHTML=rows.map(function(r){var p=Math.max(0,r.p);return '<div class="r"><span'+(r.t?' style="font-weight:800;color:var(--navy)"':'')+'>'+r.n+'</span><div class="t"><i data-w="'+Math.min(100,p/MX*100)+'" style="background:'+(r.t?'#123044':(r.p>=100?'#1F674F':'#C08A34'))+'"></i><s style="left:'+(100/MX*100)+'%"></s></div><b>'+Math.round(r.p)+'%</b></div>'}).join('');grow(rb);
  document.getElementById('cx-r-note').textContent=scope==='br'?'Linha laranja: 100% do CDI. Os isentos aparecem brutos: 92% do CDI isento equivale a cerca de 108% do CDI tributado a 15%.':(scope==='ex'?'Em dólar a conta ganhou; em reais perdeu parte do ganho porque o dólar caiu '+f1(-DOL)+'% em 12 meses. É o custo do seguro cambial.':'Linha laranja: 100% do CDI. A conta nos EUA puxou a média para baixo porque o dólar caiu '+f1(-DOL)+'% em 12 meses: é proteção, não aposta.')}
 if(i===4){var c={};l.forEach(function(a){c[a[2]]=(c[a[2]]||0)+a[3]});var ks=Object.keys(CL).filter(function(k){return c[k]});var h=document.getElementById('cx-cls');h.innerHTML=ks.map(function(k){return '<i data-w="'+(c[k]/T*100)+'" style="background:'+CL[k][1]+'"></i>'}).join('');grow(h);
  document.getElementById('cx-cls-l').innerHTML=ks.map(function(k){return '<span><i style="background:'+CL[k][1]+'"></i>'+CL[k][0]+' '+pc(c[k]/T*100)+'</span>'}).join('');
  document.getElementById('cx-cls-n').textContent=scope==='ex'?'Offshore: dólar, ações americanas e títulos do governo dos EUA.':'Por classe, a parte financeira parece diversificada. A próxima etapa abre cada ativo por setor.'}
 if(i===5){var s={};l.forEach(function(a){for(var k in a[6])s[k]=(s[k]||0)+a[6][k]});var ks=Object.keys(s).sort(function(x,y){return s[y]-s[x]});var top=s[ks[0]]/T*100,mx=Math.max(50,top+2);
  var el=document.getElementById('cx-sec');el.innerHTML=ks.map(function(k,n){return '<div class="r'+(n===0&&top>25?' hot':'')+'"><span>'+SN[k]+'</span><div class="t"><i data-w="'+(s[k]/T*100/mx*100)+'"></i></div><b>'+pc(s[k]/T*100)+'</b></div>'}).join('');grow(el);
  var ag=l.filter(function(a){return a[6].agro});document.getElementById('cx-chips').innerHTML=scope==='ex'?'':ag.map(function(a){return '<span>'+a[1]+' '+mi(a[6].agro)+'</span>'}).join('')}
 if(i===6){var s={};l.forEach(function(a){for(var k in a[6])s[k]=(s[k]||0)+a[6][k]});var br=sum(l.filter(function(a){return !a[8]&&a[2]!=='ext'}),function(a){return a[3]}),ilq=sum(l.filter(function(a){return a[7]==='ilq'}),function(a){return a[3]}),rt=ret(l),h='';
  if(scope!=='ex'){h+='<div class="r"><b>'+pc((s.agro||0)/T*100)+' no agronegócio</b>Empresa, CRA e ações do setor somam '+mi(s.agro||0)+' no mesmo risco que gera a renda da família.</div>';
   h+='<div class="r"><b>'+pc(br/T*100)+' em ativos brasileiros</b>Renda, empresa, imóveis e quase toda a carteira dependem da mesma economia e da mesma moeda.</div>';
   h+='<div><b>'+pc(ilq/T*100)+' ilíquido</b>Empresa e imóveis não pagam despesas numa crise; a reserva precisa estar fora deles.</div>';
   h+='<div><b>'+Math.round(rt.r/CDI*100)+'% do CDI na carteira financeira</b>'+(scope==='all'?'Isentos, FIIs e a queda do dólar puxaram a média; cada parte precisa ser medida pela função que cumpre.':'Isentos e FIIs puxaram a média; comparar isentos pelo equivalente tributado muda a leitura.')+'</div>';
   h+='<div class="g" style="grid-column:1/-1"><b>Próximo passo no plano</b>Sem novo crédito do agronegócio na carteira, mais exterior e IPCA+ para objetivos longos, e uma meta de retorno por objetivo em vez de por produto.</div>'}
  else{h+='<div class="g"><b>'+mi(sum(l,function(a){return a[3]}))+' no exterior</b>Proteção contra o risco Brasil; em 12 meses rendeu '+pc(rt.r)+' em reais com o dólar em queda.</div><div><b>Concentrado em EUA</b>Sem Europa, Ásia ou emergentes; a carteira global pode ser mais ampla.</div><div><b>Imposto e sucessão</b>Estrutura offshore precisa de planejamento sucessório e da nova tributação de investimentos no exterior.</div><div class="r"><b>Câmbio não é retorno</b>Avaliar em dólar e em reais; o papel é diversificar, não acertar o câmbio.</div>'}
  document.getElementById('cx-al').innerHTML=h}}
var tabs=root.querySelectorAll('.cx-steps button'),panels=root.querySelectorAll('.cx-panel'),btn=document.getElementById('cx-play');
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var cur=0,timer=null,playing=!reduce,DUR=[4600,4600,9000,6000,4600,5600,6500],srcT=[];
function show(i){cur=i;srcT.forEach(clearTimeout);srcT=[];tabs.forEach(function(t,k){t.classList.toggle('on',k===i);t.classList.toggle('done',k<i);t.setAttribute('aria-selected',k===i?'true':'false')});panels.forEach(function(p,k){p.classList.toggle('on',k===i)});render(i);schedule()}
function schedule(){clearTimeout(timer);if(playing)timer=setTimeout(function(){show((cur+1)%panels.length)},DUR[cur])}
function stop(){playing=false;btn.textContent='Reproduzir';btn.setAttribute('aria-label','Reproduzir animação');clearTimeout(timer)}
tabs.forEach(function(t,k){t.addEventListener('click',function(){stop();show(k)})});
root.querySelectorAll('.cx-scope button').forEach(function(b){b.addEventListener('click',function(){root.querySelectorAll('.cx-scope button').forEach(function(x){x.classList.toggle('on',x===b)});scope=b.getAttribute('data-s');stop();show(cur)})});
btn.addEventListener('click',function(){playing=!playing;btn.textContent=playing?'Pausar':'Reproduzir';btn.setAttribute('aria-label',playing?'Pausar animação':'Reproduzir animação');schedule()});
if(reduce)btn.textContent='Reproduzir';
var started=false;
if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!started){started=true;show(0)}})},{threshold:.3}).observe(root)}else{show(0)}
setTimeout(function(){if(!started){started=true;show(0)}},4000);
})();
}

function blocoImpacto() {
  var pInput = document.getElementById('sim-patrimonio');
  var dInput = document.getElementById('sim-delta');
  var pVal = document.getElementById('sim-patrimonio-val');
  var dVal = document.getElementById('sim-delta-val');
  var resBox = document.getElementById('sim-results');
  if (!pInput || !dInput || !resBox) return;

  var PATRIMONIOS = [
    300000, 500000,
    1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000,
    20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000,
    150000000, 200000000, 250000000, 300000000, 350000000, 400000000, 450000000, 500000000,
    550000000, 600000000, 650000000, 700000000, 750000000, 800000000, 850000000, 900000000,
    950000000, 1000000000
  ];

  pInput.max = String(PATRIMONIOS.length - 1);

  var midSpan = document.getElementById('sim-patrimonio-mid');
  if (midSpan) midSpan.textContent = 'R$ 100 mi';
  var ctrl = pInput.closest ? pInput.closest('.sim-ctrl') : pInput.parentElement;
  if (ctrl) {
    var spans = ctrl.querySelectorAll('div:last-child span');
    if (spans.length >= 2) spans[1].textContent = 'R$ 100 mi';
  }

  function formatMoney(val) {
    if (val >= 1e9) {
      var b = val / 1e9;
      return 'R$ ' + (b % 1 === 0 ? b : b.toFixed(1).replace('.', ',')) + ' bi';
    }
    if (val >= 1e6) {
      var m = val / 1e6;
      return 'R$ ' + (m % 1 === 0 ? m : m.toFixed(1).replace('.', ',')) + ' mi';
    }
    if (val >= 1e3) {
      var k = val / 1e3;
      return 'R$ ' + (k % 1 === 0 ? k : k.toFixed(0)) + ' mil';
    }
    return 'R$ ' + Math.round(val).toLocaleString('pt-BR');
  }

  function formatExact(val) {
    return 'R$ ' + Math.round(val).toLocaleString('pt-BR');
  }

  function update() {
    var pIdx = Math.min(PATRIMONIOS.length - 1, Math.max(0, +pInput.value));
    var P = PATRIMONIOS[pIdx];
    var deltaPct = +dInput.value;

    if (pVal) pVal.textContent = formatMoney(P);
    if (dVal) dVal.textContent = '+' + deltaPct.toFixed(1).replace('.', ',') + '% a.a.';

    var r0 = 0.06; // 6% juro real de longo prazo
    var r1 = r0 + (deltaPct / 100);

    var years = [1, 5, 10];
    resBox.innerHTML = years.map(function(t) {
      var v0 = P * Math.pow(1 + r0, t);
      var v1 = P * Math.pow(1 + r1, t);
      var diff = v1 - v0;
      var label = t === 1 ? 'Em 1 ano' : ('Em ' + t + ' anos');

      return '<div class="sim-res-card">' +
        '<div class="k" style="font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted)">' + label + '</div>' +
        '<div class="v" style="font-size:clamp(22px, 2.2vw, 30px);color:var(--green);font-weight:800;margin:10px 0 6px">+ ' + formatExact(diff) + '</div>' +
        '<div class="s" style="font-size:12.5px;color:var(--body);line-height:1.4">a mais gerado no patrimônio</div>' +
        '<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)">Patrimônio final: <b style="color:var(--navy)">' + formatMoney(v1) + '</b></div>' +
      '</div>';
    }).join('');
  }

  pInput.addEventListener('input', update);
  dInput.addEventListener('input', update);
  update();
}

const BLOCOS = [navegacao, bloco1, bloco2, bloco3, bloco4, bloco5, bloco6, bloco7, blocoImpacto];

export function initCarta(): () => void {
  let vivo = true;
  const timers = new Set();
  const observers = [];
  const st = (fn, ms) => {
    const id = window.setTimeout(() => { timers.delete(id); if (vivo) fn(); }, ms);
    timers.add(id);
    return id;
  };
  const ct = (id) => { window.clearTimeout(id); timers.delete(id); };
  const raf = (fn) => window.requestAnimationFrame((t) => { if (vivo) fn(t); });
  const IO = function (cb, opts) {
    const o = new window.IntersectionObserver(cb, opts);
    observers.push(o);
    return o;
  };

  BLOCOS.forEach((fn) => {
    try { fn(st, ct, raf, IO); } catch (e) { console.error('[carta]', fn.name, e); }
  });

  return () => {
    vivo = false;
    timers.forEach((id) => window.clearTimeout(id));
    timers.clear();
    observers.forEach((o) => o.disconnect());
    delete window.__donut;
  };
}
