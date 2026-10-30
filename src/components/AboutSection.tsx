import React from 'react';
import { Database, Monitor, Cpu, Layers, ShieldCheck, Zap, Bot, Eye, Volume2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-16 mb-20">
      <div className="text-center mb-8">
        <h3 className="font-['Cinzel',serif] text-xl md:text-2xl font-bold text-slate-100">
          Arquitetura do Dota AI Live Coach
        </h3>
        <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
          Sistema híbrido de Visão Computacional (OpenCV/Canvas), banco de dados tático de heróis e o modelo multimodal Gemini 3.8 Flash para acompanhamento de tela ao vivo sem latência.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Live Capture & CV */}
        <div className="p-5 rounded-xl bg-[#0e131d] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-200 text-sm mb-1.5 flex items-center gap-1.5">
            1. Visão Computacional (OpenCV & Canvas)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Captura contínua de tela do jogo via <code className="text-cyan-300">getDisplayMedia</code>. Processamento em tempo real com segmentação de ROIs (Minimapa, Relógio do jogo e HUD de HP/Mana/Itens), filtros Sobel de bordas e cálculo de atividade de teamfight.
          </p>
        </div>

        {/* Step 2: Database & Statistics */}
        <div className="p-5 rounded-xl bg-[#0e131d] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-200 text-sm mb-1.5 flex items-center gap-1.5">
            2. Banco de Dados Tático de Dota 2
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Catálogo completo com mais de 125 heróis, matriz de counters (quem countera quem), sinergias de itens situacionais (BKB, Nullifier, Halberd, Silver Edge, Spirit Vessel) e cronômetros exatos de Roshan, Runas e Tormentor.
          </p>
        </div>

        {/* Step 3: Multimodal Vision AI & Voice */}
        <div className="p-5 rounded-xl bg-[#0e131d] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3">
            <Volume2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-200 text-sm mb-1.5 flex items-center gap-1.5">
            3. Gemini Multimodal & Callouts por Voz
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            A IA Gemini 3.8 Flash analisa o frame visual + contexto do banco de dados para gerar diretrizes táticas instantâneas narradas em voz alta no fone do jogador via Speech Synthesis: alertas de gank, rotas seguras e timings de itens.
          </p>
        </div>
      </div>

      {/* Free Tier Guarantee */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#0e131d] to-[#0e131d] border border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>100% Funcional e Gratuito:</strong> Compatível com qualquer partida ao vivo de Dota 2 ou clips gravados, sem necessidade de plugins ou modificação dos arquivos do jogo.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-300 font-semibold shrink-0">
          <Zap className="w-4 h-4" />
          <span>Detecção Segura & Anti-Ban</span>
        </div>
      </div>
    </div>
  );
};
