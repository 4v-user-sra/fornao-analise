import { cn } from './lib/utils';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  CurrencyDollar,
  TrendUp,
  Target,
  ShoppingCart,
  CursorClick,
  Megaphone,
  ChartLineUp,
  Funnel,
  Eye,
  Users
} from '@phosphor-icons/react';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Data ---
const monthlyData = [
  { name: 'MAR26', xAxisPeriod: '1-31', period: '01 A 31 MAR', Investimento: 1150.22, Receita: 3255.83, ROAS: 2.83, CPA: 63.90, CPC: 1.00 },
  { name: 'ABR26', xAxisPeriod: '1-30', period: '01 A 30 ABR', Investimento: 1324.60, Receita: 2160.06, ROAS: 1.63, CPA: 94.61, CPC: 0.74 },
  { name: 'MAI26', xAxisPeriod: '1-08', period: '01 A 08 MAI', Investimento: 267.27, Receita: 529.70, ROAS: 1.98, CPA: 66.82, CPC: 0.87 },
];

const funnelData = [
  { id: '1', label: 'IMPRESSÕES', value: 590269, rate: '100%', subtext: 'Alcance: 187k', icon: Megaphone },
  { id: '2', label: 'CLIQUES', value: 6004, rate: '1.01% CTR', subtext: 'CPC Médio: R$ 0.45', icon: CursorClick },
  { id: '3', label: 'PAGEVIEWS', value: 2111, rate: '35% Ret.', subtext: 'Custo/Visita: R$ 1.29', icon: Eye },
  { id: '4', label: 'CARRINHOS', value: 112, rate: '5.3% CVR', subtext: 'Abandonos: 76', icon: ShoppingCart },
  { id: '5', label: 'COMPRAS', value: 36, rate: '32% Fech.', subtext: 'CPA Médio: R$ 76.17', icon: Target },
];

const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return prefix + latest.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix;
  });

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
};

const CustomAxisTick = ({ x, y, payload }: any) => {
  const data = monthlyData.find(d => d.name === payload.value);
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} textAnchor="middle" fill="#666666" fontSize={11} fontFamily="var(--font-mono)" letterSpacing="0.05em">
        {payload.value}
      </text>
      <text x={0} y={0} dy={22} textAnchor="middle" fill="#444444" fontSize={9} fontFamily="var(--font-mono)">
        [ {data?.xAxisPeriod} ]
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#F4F4F0] border-[2px] border-[#050505] p-4 font-mono shadow-[4px_4px_0px_#050505]">
        <p className="text-[12px] font-bold text-[#050505] mb-3 border-b-[2px] border-[#050505] pb-2 uppercase">
          [ DATA: {data.period} ]
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6 mb-2">
            <span className="text-[12px] text-[#444] uppercase font-bold">{entry.name}</span>
            <span className={cn("text-[14px] font-bold", entry.name === 'ROAS' ? "text-[#34A853]" : "text-[#050505]")}>
               {entry.name === 'ROAS' 
                 ? `${entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}X` 
                 : `R$ ${entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- Tactical Telemetry Components ---

const SwissCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  className,
  isCritical = false
}: {
  title: string;
  value: string | React.ReactNode;
  subtext?: string;
  icon?: React.ElementType;
  className?: string;
  isCritical?: boolean;
}) => {
  return (
    <div className={cn(
      "relative border-[2px] border-[#050505] bg-[#F4F4F0] p-6 md:p-8 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#050505]",
      className
    )}>
      <div className="flex justify-between items-start mb-8 z-10">
        <div className="text-[13px] font-bold tracking-[0.05em] text-[#050505] uppercase font-mono">
           {title}
        </div>
        {Icon && <Icon size={24} weight="bold" className={cn(isCritical ? "text-[#34A853]" : "text-[#050505]")} />}
      </div>
      
      <div className={cn(
        "font-sans font-black tracking-tight z-10",
        isCritical ? "text-[#34A853] text-5xl md:text-7xl" : "text-[#050505] text-4xl md:text-5xl"
      )}>
        {value}
      </div>

      {subtext && (
        <div className="mt-6 text-[14px] text-[#444] font-bold uppercase tracking-wider z-10 font-mono">
          {subtext}
        </div>
      )}
    </div>
  );
};


function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRevealRef = useRef<HTMLDivElement>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // Text Reveal Scrubbing
      if (textRevealRef.current) {
        const words = textRevealRef.current.querySelectorAll('.reveal-word');
        gsap.fromTo(words, 
          { opacity: 0.1 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: textRevealRef.current,
              start: "top 80%",
              end: "bottom 50%",
              scrub: true,
            }
          }
        );
      }

      // Chart element enter animation
      if (chartWrapperRef.current) {
        gsap.fromTo(chartWrapperRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chartWrapperRef.current,
              start: "top 85%",
            }
          }
        );
      }

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="w-full min-h-screen bg-[#F4F4F0] text-[#050505] selection:bg-[#34A853] selection:text-[#F4F4F0] overflow-x-hidden">
      <div className="noise-bg mix-blend-multiply" />
      
      {/* Swiss Nav */}
      <nav className="w-full flex justify-between items-center p-6 border-b-[2px] border-[#050505] font-mono text-[13px] font-bold tracking-widest text-[#050505] uppercase relative z-10 bg-[#F4F4F0]">
        <div className="flex gap-6">
          <span>V4 COMPANY</span>
        </div>
        <div className="flex gap-6">
          <span>STATUS: ATIVO</span>
          <span className="text-[#34A853] animate-pulse">REC</span>
        </div>
      </nav>

      {/* AIDA: Attention (Hero) */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center py-24 md:py-32 border-b-[2px] border-[#050505] relative z-10 bg-[#F4F4F0]">
        <h1 className="font-sans font-black uppercase leading-[0.9] tracking-tight w-full max-w-6xl mb-12 text-[#050505]"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 9.5rem)' }}>
          Análise de<br/>
          Funil
        </h1>

        <div className="max-w-3xl px-6 text-[#444] font-mono text-xs md:text-sm tracking-widest leading-relaxed font-bold uppercase text-balance">
          PERÍODO ADEQUADO PARA ANÁLISE: 01 MAR - 08 MAI 2026. <br/> DADOS REPRESENTAM MÉTRICAS CONSOLIDADAS DE FUNIL, EFICIÊNCIA GERAL DA OPERAÇÃO DE RECEITA (ROAS) E DISTRIBUIÇÃO E EFICIÊNCIA DE TRÁFEGO E CAPTAÇÃO.
        </div>
      </section>

      {/* Infinite Marquee Strip */}
      <div className="w-full border-b-[2px] border-[#050505] py-4 overflow-hidden flex whitespace-nowrap bg-[#1B5E20] relative z-10">
        <div className="animate-marquee font-mono text-[13px] tracking-widest text-[#F4F4F0] font-bold uppercase flex gap-12 md:gap-16">
          <span>INTEGRIDADE DE DADOS: VERIFICADA</span>
          <span>MÉTRICAS DE ROAS ATIVAS</span>
          <span>TELEMETRIA DE FUNIL: ESTÁVEL</span>
          <span>INTEGRIDADE DE DADOS: VERIFICADA</span>
          <span>MÉTRICAS DE ROAS ATIVAS</span>
          <span>TELEMETRIA DE FUNIL: ESTÁVEL</span>
          <span>INTEGRIDADE DE DADOS: VERIFICADA</span>
          <span>MÉTRICAS DE ROAS ATIVAS</span>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1800px] mx-auto pb-32">
        
        {/* AIDA: Interest (Gapless Bento Grid) */}
        <section className="py-24">
          <div className="flex items-center gap-4 mb-16 border-l-[12px] border-[#34A853] pl-6">
            <h2 className="font-mono text-2xl font-black tracking-widest uppercase text-[#050505]">Visão Global</h2>
            <div className="h-[2px] bg-[#050505] flex-grow mx-4"></div>
            <span className="font-mono font-bold text-[#444] uppercase hidden md:block whitespace-nowrap">01 de Março até 08 de Maio - 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-flow-dense gap-[2px] bg-[#050505] border-[2px] border-[#050505] shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:shadow-[8px_8px_0px_#050505] transition-shadow duration-500">
            
            <SwissCard 
              title="ROAS GERAL"
              value={<AnimatedCounter value={2.17} suffix="X" />}
              subtext="Eficiência Cumulativa do Período"
              icon={Target}
              isCritical={true}
              className="lg:col-span-2 lg:row-span-2"
            />
            
            <SwissCard 
              title="INVESTIMENTO TOTAL"
              value={<AnimatedCounter value={2742.09} prefix="R$ " />}
              icon={CurrencyDollar}
              className="lg:col-span-1"
            />
            
            <SwissCard 
              title="RECEITA TOTAL"
              value={<AnimatedCounter value={5945.59} prefix="R$ " />}
              icon={TrendUp}
              className="lg:col-span-1"
            />

            <SwissCard 
              title="TOTAL DE COMPRAS"
              value={<AnimatedCounter value={36} />}
              icon={ShoppingCart}
              className="lg:col-span-1"
            />
            
            <SwissCard 
              title="CPA MÉDIO GERAL"
              value="R$ 76.17"
              icon={Users}
              className="lg:col-span-1"
            />
            
          </div>
        </section>

        {/* Funnel Section - Brutalist Architecture */}
        <section className="py-24 border-t-[2px] border-[#050505]">
           <div className="flex items-center gap-4 mb-16 border-l-[12px] border-[#34A853] pl-6">
            <h2 className="font-mono text-2xl font-black tracking-widest uppercase text-[#050505]">Funil</h2>
            <div className="h-[2px] bg-[#050505] flex-grow ml-4"></div>
          </div>

          <div className="w-full flex justify-between gap-[2px] bg-[#050505] border-[2px] border-[#050505] overflow-x-auto overflow-y-hidden shadow-[8px_8px_0px_#050505]">
            {funnelData.map((step, idx) => (
              <div key={step.id} className="min-w-[240px] flex-1 bg-[#F4F4F0] p-6 lg:p-8 flex flex-col relative group">
                <div className="text-[#050505] mb-6 block lg:hidden group-hover:block transition-all">
                  <step.icon size={32} weight="bold" />
                </div>
                <div className="mt-auto">
                  <div className="text-[12px] font-mono tracking-widest text-[#34A853] font-bold mb-2 uppercase">L{idx + 1}. {step.label}</div>
                  <div className="text-4xl md:text-5xl font-sans font-black tracking-tight text-[#050505] mb-4">
                    {step.value.toLocaleString()}
                  </div>
                  <div className="bg-[#050505] text-[#F4F4F0] font-mono text-[11px] uppercase tracking-wider py-1 px-2 inline-block mb-3">
                    {step.rate}
                  </div>
                  <div className="text-[13px] font-mono font-bold text-[#444] uppercase">{step.subtext}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AIDA: Desire (GSAP Scrolling / Text Reveal & Matrix) */}
        <section className="py-24 md:py-32 flex flex-col items-start border-t-[2px] border-[#050505]">
          <div className="w-full mb-16">
             <div className="text-[14px] font-mono tracking-widest text-[#34A853] font-bold mb-8">TELEMETRIA_01</div>
             <p ref={textRevealRef} className="font-sans font-black text-3xl md:text-5xl leading-[1.1] uppercase tracking-tight text-[#050505] max-w-5xl">
               {'Em abril, aumentamos o investimento para atrair novos clientes, e muitos ainda estão nos conhecendo. Estamos focando em educar e filtrar esse público para aumentar suas vendas nos próximos meses.'.split(' ').map((word, i) => (
                 <span key={i} className="reveal-word inline-block mr-3 mb-2">{word}</span>
               ))}
             </p>
          </div>
          
          <div className="w-full" ref={chartWrapperRef}>
             <div className="border-[2px] border-[#050505] bg-[#F4F4F0] p-4 lg:p-8 hover:shadow-[12px_12px_0px_#050505] transition-shadow duration-300">
                <div className="border-b-[2px] border-[#050505] pb-6 mb-8 flex justify-between items-center">
                  <span className="font-mono text-[16px] tracking-widest text-[#050505] font-bold uppercase">Matrizes de Evolução (Mar-Mai)</span>
                </div>
                
                {/* 3 Charts Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
                  
                  {/* Investigment Bar Chart */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-mono text-[14px] font-bold tracking-widest text-[#050505]">INVESTIMENTO</div>
                      <span className="w-3 h-3 bg-[#050505]"></span>
                    </div>
                    <div className="h-[250px] w-full border-[2px] border-[#050505] p-2 bg-[#FBFBFA]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CCC" />
                          <XAxis dataKey="name" axisLine={{ stroke: '#050505', strokeWidth: 2 }} tickLine={false} tick={{ fill: '#050505', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 'bold' }} dy={10} />
                          <YAxis axisLine={{ stroke: '#050505', strokeWidth: 2 }} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toLocaleString('pt-BR')}k`} tick={{ fill: '#050505', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 'bold' }} />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                          <Bar dataKey="Investimento" fill="#050505" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue Bar Chart */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-mono text-[14px] font-bold tracking-widest text-[#050505]">RECEITA GERADA</div>
                      <span className="w-3 h-3 bg-[#050505]"></span>
                    </div>
                    <div className="h-[250px] w-full border-[2px] border-[#050505] p-2 bg-[#FBFBFA]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CCC" />
                          <XAxis dataKey="name" axisLine={{ stroke: '#050505', strokeWidth: 2 }} tickLine={false} tick={{ fill: '#050505', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 'bold' }} dy={10} />
                          <YAxis axisLine={{ stroke: '#050505', strokeWidth: 2 }} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toLocaleString('pt-BR')}k`} tick={{ fill: '#050505', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 'bold' }} />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                          <Bar dataKey="Receita" fill="#050505" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* ROAS Line Chart */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-mono text-[14px] font-bold tracking-widest text-[#34A853]">ROAS</div>
                      <span className="w-3 h-3 bg-[#267336]"></span>
                    </div>
                    <div className="h-[250px] w-full border-[2px] border-[#34A853] p-2 bg-[#E8F5E9]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#A5D6A7" />
                          <XAxis dataKey="name" axisLine={{ stroke: '#34A853', strokeWidth: 2 }} tickLine={false} tick={{ fill: '#34A853', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 'bold' }} dy={10} />
                          <YAxis axisLine={{ stroke: '#34A853', strokeWidth: 2 }} tickLine={false} tickFormatter={(v) => `${v}X`} tick={{ fill: '#34A853', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 'bold' }} />
                          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#34A853', strokeWidth: 2, strokeDasharray: '4 4' }} />
                          <Line type="monotone" dataKey="ROAS" stroke="#34A853" strokeWidth={4} dot={{ r: 6, fill: '#E8F5E9', stroke: '#34A853', strokeWidth: 3 }} activeDot={{ r: 8, fill: '#34A853' }} isAnimationActive={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
                
                {/* Insights section below graphs */}
                <div className="border-t-[2px] border-[#050505] pt-8 flex flex-col lg:flex-row justify-between gap-12">
                   <div className="flex-1">
                      <div className="text-[14px] font-mono text-[#34A853] font-bold uppercase mb-4 tracking-widest">[ DIAGNÓSTICO E INSIGHTS ]</div>
                      <div className="text-sm md:text-base font-sans font-bold text-[#050505] leading-relaxed uppercase mb-4">
                        TIVE UM GRANDE AUMENTO DE NOVOS POTENCIAIS CLIENTES EM ABRIL, O QUE É ÓTIMO. COMO SÃO PESSOAS NOVAS, ELES AINDA ESTÃO NOS CONHECENDO. POR ISSO, ESTAMOS TRABALHANDO PARA ELES ENTENDEREM MELHOR NOSSO VALOR E COMPRAREM COM MAIS FACILIDADE NOS PRÓXIMOS MESES.
                      </div>
                      <div className="text-[13px] font-mono text-[#050505] font-bold tracking-tight uppercase px-4 py-3 bg-[#EAE8E3] border-[2px] border-[#050505]">
                        <span className="text-[#34A853]">MAR: 2.83X</span> &gt;&gt; ABR: 1.63X &gt;&gt; MAI (01-08): 1.98X
                      </div>
                   </div>
                   
                   <div className="flex-1 border-t-[2px] border-[#050505] lg:border-t-0 lg:border-l-[2px] lg:border-[#050505] pt-8 lg:pt-0 lg:pl-10">
                      <div className="text-[14px] font-mono text-[#34A853] font-bold uppercase mb-4 tracking-widest">[ PLANO DE AÇÃO ESTRATÉGICA ]</div>
                      <ul className="list-none space-y-5 font-sans font-bold text-[#050505] uppercase text-xs md:text-[13px] leading-relaxed">
                        <li className="relative pl-6">
                           <span className="absolute left-0 top-1 w-2 h-2 bg-[#050505]"></span>
                           <span className="text-[#34A853]">MATURAÇÃO MEIO DE FUNIL (MOFU):</span> Subida de novos vídeos e criativos direcionados para audiência engajada. Precisamos aguardar a maturação das campanhas.
                        </li>
                        <li className="relative pl-6">
                           <span className="absolute left-0 top-1 w-2 h-2 bg-[#050505]"></span>
                           <span className="text-[#34A853]">RETENÇÃO (REPEDIU):</span> Implementação finalizada na ferramenta Repediu atuando de forma aprofundada na retenção de clientes.
                        </li>
                        <li className="relative pl-6">
                           <span className="absolute left-0 top-1 w-2 h-2 bg-[#050505]"></span>
                           <span className="text-[#34A853]">RECUPERAÇÃO (CardápioWeb):</span> Implementação completa; já apresentou excelente melhoria real no faturamento do período mitigando abandono.
                        </li>
                        <li className="relative pl-6">
                           <span className="absolute left-0 top-1 w-2 h-2 bg-[#050505]"></span>
                           <span className="text-[#34A853]">DATAS COMERCIAIS:</span> Mapeamento de datas racionais/sazonais para concentrar picos artificiais e programados de faturamento com novas ofertas.
                        </li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
        </section>

      </div>
      
      {/* AIDA: Action (Footer) */}
      <footer className="w-full pb-32 px-4 md:px-8 border-t-[2px] border-[#050505] bg-[#F4F4F0] relative z-10">
        <div className="max-w-[1600px] mx-auto pt-32 text-center">
            <h2 className="font-sans font-black text-6xl md:text-8xl tracking-tighter uppercase text-[#050505] mb-8">
              Fim de <span className="text-[#34A853]">Relatório</span>
            </h2>
            <div className="w-32 h-[4px] bg-[#050505] mx-auto mt-12"></div>
        </div>
      </footer>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </main>
  );
}

export default App;

