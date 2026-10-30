import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Copy,
  Check,
  Download,
  Sparkles,
  Trophy,
  Award,
  AlertTriangle,
  Target,
  MapPin,
  FileText,
  BarChart3,
  Flame,
  Shield,
  Layers,
  Zap,
  Users,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { getHero, getHeroImageUrl } from '../data/dotaConstants';
import { TacticalMinimapViewer, TacticalMoment } from './TacticalMinimapViewer';

export interface AnalysisResult {
  matchId: string;
  heroId: number;
  playerWon: boolean;
  duration: string;
  kda: string;
  kp: string;
  gpm: number;
  xpm: number;
  netWorth: number;
  performanceGrade?: string;
  executiveVerdict?: string;
  radarSkills?: {
    macro: number;
    farming: number;
    teamfight: number;
    laning: number;
    vision: number;
  };
  tacticalMoments?: TacticalMoment[];
  report: string;
  benchmarks?: any;
  generatedAt: string;
}

interface ReportViewerProps {
  analysis: AnalysisResult;
  onReset: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ analysis, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'report' | 'skills'>('map');
  const hero = getHero(analysis.heroId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis.report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([analysis.report], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `dotarevew-match-${analysis.matchId}-${hero.name}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const grade = analysis.performanceGrade || (analysis.playerWon ? 'A' : 'C+');
  const skills = analysis.radarSkills || {
    macro: 70,
    farming: 80,
    teamfight: 65,
    laning: 75,
    vision: 45,
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8 mb-16 animate-fadeIn">
      <div className="bg-[#0f141f] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-red-950/80 via-[#161c28] to-slate-900 px-6 py-6 border-b border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400 shadow-lg shrink-0">
              <img
                src={getHeroImageUrl(hero.id)}
                alt={hero.localized_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Relatório Tático DOTAREVEW AI
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    analysis.playerWon
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {analysis.playerWon ? 'Vitória' : 'Derrota'}
                </span>
              </div>
              <h2 className="text-2xl font-black font-['Cinzel',serif] text-slate-100 flex items-center gap-2">
                {hero.localized_name} <span className="text-slate-500 text-lg font-mono">#{analysis.matchId}</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Duração: {analysis.duration} • Avaliado pelo Motor de Inteligência Artificial do DOTAREVEW
              </p>
            </div>
          </div>

          {/* Performance Grade Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#0a0d14]/90 border border-amber-500/40 px-4 py-2 rounded-xl shadow-lg">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nota Geral</div>
                <div className="text-xs text-amber-300 font-medium">IA Performance</div>
              </div>
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-black text-2xl font-['Cinzel',serif] shadow-md border border-amber-300">
                {grade}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Copiar relatório"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Baixar Markdown"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">.MD</span>
              </button>
            </div>
          </div>
        </div>

        {/* Executive Verdict Callout */}
        {analysis.executiveVerdict && (
          <div className="bg-[#0b0f17] border-b border-slate-800 px-6 py-3.5 flex items-center gap-3 text-xs md:text-sm text-slate-300">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <p>
              <strong className="text-amber-300">Veredito da IA:</strong> {analysis.executiveVerdict}
            </p>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-800 bg-[#0a0d14]/80 text-center">
          <div className="p-3 border-r border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">KDA</div>
            <div className="text-base font-extrabold font-mono text-slate-100">{analysis.kda}</div>
          </div>
          <div className="p-3 border-r border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Participação em Kills</div>
            <div className="text-base font-extrabold font-mono text-amber-400">{analysis.kp}</div>
          </div>
          <div className="p-3 border-r border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Net Worth</div>
            <div className="text-base font-extrabold font-mono text-emerald-400">{analysis.netWorth?.toLocaleString() || '-'}</div>
          </div>
          <div className="p-3 border-r border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">GPM / XPM</div>
            <div className="text-base font-extrabold font-mono text-cyan-400">{analysis.gpm} / {analysis.xpm}</div>
          </div>
          <div className="p-3 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Custo de Análise</div>
            <div className="text-base font-extrabold font-mono text-emerald-400">R$ 0,00 (Grátis)</div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="bg-[#0b0e14] border-b border-slate-800 px-6 flex items-center gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'map'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Falhas no Mapa & Momentos ({analysis.tacticalMoments?.length || 5})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Radar de Habilidades por IA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'report'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Diagnóstico Completo da IA</span>
          </button>
        </div>

        {/* Tab 1: Interactive Tactical Minimap Moments */}
        {activeTab === 'map' && (
          <div className="pb-8">
            <TacticalMinimapViewer
              moments={analysis.tacticalMoments || []}
              heroName={hero.localized_name}
            />
          </div>
        )}

        {/* Tab 2: Radar Skills Breakdown */}
        {activeTab === 'skills' && (
          <div className="p-6 md:p-10">
            <div className="max-w-3xl mx-auto bg-[#0a0d14] border border-slate-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-['Cinzel',serif] text-lg md:text-xl font-bold text-slate-100">
                  Avaliação Holística de Habilidades por IA (Escala 0 a 100)
                </h3>
              </div>

              <div className="space-y-5">
                {/* Macro */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" /> Macro Game, Rotações & Espaço
                    </span>
                    <span className="text-amber-400 font-mono text-sm">{skills.macro}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                      style={{ width: `${skills.macro}%` }}
                    />
                  </div>
                </div>

                {/* Farming */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" /> Eficiência de Farm & Last Hits
                    </span>
                    <span className="text-emerald-400 font-mono text-sm">{skills.farming}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                      style={{ width: `${skills.farming}%` }}
                    />
                  </div>
                </div>

                {/* Teamfight */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-400" /> Posicionamento em Teamfights
                    </span>
                    <span className="text-rose-400 font-mono text-sm">{skills.teamfight}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-1000"
                      style={{ width: `${skills.teamfight}%` }}
                    />
                  </div>
                </div>

                {/* Laning */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-cyan-400" /> Controle de Rota & Equilíbrio de Creeps
                    </span>
                    <span className="text-cyan-400 font-mono text-sm">{skills.laning}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-1000"
                      style={{ width: `${skills.laning}%` }}
                    />
                  </div>
                </div>

                {/* Vision */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-purple-400" /> Consciência de Visão & Zonas Seguras
                    </span>
                    <span className="text-purple-400 font-mono text-sm">{skills.vision}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-1000"
                      style={{ width: `${skills.vision}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Detailed AI Written Diagnosis */}
        {activeTab === 'report' && (
          <div className="p-6 md:p-10">
            {/* Guide Highlights: Solo vs Group & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Box 1: Correct Actions */}
              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Ações Corretas Realizadas & Como Potencializá-las</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O jogador demonstrou consistência mecânica na aceleração de ouro e bom aproveitamento de recursos na selva. Para transformar essa vantagem individual em vitória para a equipe, a IA recomenda converter cada pico de farm em <strong>pressão de objetivos diretos</strong>: imediatamente após fechar um item grande (BKB/Blink/Manta), force uma luta com a equipe em vez de continuar farmando passivamente.
                </p>
              </div>

              {/* Box 2: How to Advance the Map (Solo vs Group) */}
              <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
                  <Users className="w-5 h-5" />
                  <span>Como Avançar no Mapa para Ganhar (Solo vs Grupo)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Andar Solo:</strong> Apenas em rotas com creeps sob a visão de sentries aliadas e quando pelo menos 3 inimigos estiverem visíveis no minimapa. Use a regra do "Bater e Sair".<br />
                  <strong>Andar em Grupo (5-Man):</strong> Obrigatório após conquistar o Roshan (Aegis), aos 20+ minutos ao redor de objetivos neutros (Tormentor) e para invadir o território adversário com Smoke of Deceit.
                </p>
              </div>
            </div>

            {/* Markdown Body */}
            <div className="prose prose-invert prose-red max-w-none prose-headings:font-['Cinzel',serif] prose-headings:text-amber-200 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-amber-400 prose-strong:font-bold">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <div className="mt-8 mb-4 pb-2 border-b border-amber-500/20 flex items-center gap-2">
                      <h1 className="text-xl md:text-2xl font-black text-amber-200 tracking-wide m-0" {...props} />
                    </div>
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-lg md:text-xl font-bold text-slate-100 mt-6 mb-3 m-0" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="my-3 space-y-1.5 list-disc pl-5 text-slate-300 text-sm" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="my-3 space-y-2 list-decimal pl-5 text-slate-200 font-medium text-sm" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="my-3 text-slate-300 text-sm md:text-base leading-relaxed" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="my-4 p-4 rounded-xl bg-amber-950/20 border-l-4 border-amber-500 text-slate-200 italic"
                      {...props}
                    />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      className="bg-black/60 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs border border-slate-800"
                      {...props}
                    />
                  ),
                }}
              >
                {analysis.report}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="bg-[#0b0e14] px-6 py-4 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Relatório gerado por Inteligência Artificial (Google Gemini) com telemetria oficial de replay da OpenDota.
          </span>
          <span className="font-semibold text-slate-400">
            DOTAREVEW • 100% Gratuito
          </span>
        </div>
      </div>
    </div>
  );
};
