import React, { useState, useEffect } from 'react';
import { getHero, getHeroImageUrl } from '../data/dotaConstants';
import { Bot, Sparkles, Flame, GraduationCap, Trophy, Globe, Target } from 'lucide-react';

interface CoachPanelProps {
  selectedHeroId: number | null;
  match: any;
  onGenerateReport: (options: { style: 'pro' | 'constructive' | 'roast'; language: string }) => void;
  isGenerating: boolean;
}

export const CoachPanel: React.FC<CoachPanelProps> = ({
  selectedHeroId,
  match,
  onGenerateReport,
  isGenerating,
}) => {
  const [coachStyle, setCoachStyle] = useState<'pro' | 'constructive' | 'roast'>('pro');
  const [language, setLanguage] = useState<'pt-BR' | 'en'>('pt-BR');
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);

  const loadingTips = [
    'Filtrando dados de KDA e timeline de Net Worth...',
    'Consultando benchmarks de percentil da OpenDota...',
    'Analisando timings de itens cruciais e power spikes...',
    'Calculando participação em lutas e mortes evitáveis...',
    'Gemini 3.8 Flash estruturando plano de ação profissional...',
  ];

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadingTipIndex((prev) => (prev + 1) % loadingTips.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!match) return null;

  const targetPlayer = match.players?.find(
    (p: any) => p.hero_id === selectedHeroId
  ) || match.players?.[0];

  const hero = targetPlayer ? getHero(targetPlayer.hero_id) : null;
  const isRadiant = targetPlayer ? targetPlayer.player_slot < 128 : true;
  const playerWon = targetPlayer ? (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win) : false;

  const handleSubmit = () => {
    onGenerateReport({ style: coachStyle, language });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8">
      <div className="relative rounded-2xl p-6 md:p-8 bg-gradient-to-b from-[#141a29] to-[#0c1017] border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Hero in Focus Profile Card */}
          {hero && targetPlayer ? (
            <div className="flex items-center gap-4 bg-[#0a0d14]/80 p-3.5 pr-6 rounded-xl border border-slate-700/60 w-full lg:w-auto">
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0">
                <img
                  src={getHeroImageUrl(hero.id)}
                  alt={hero.localized_name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/90 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-amber-300">
                  Lvl {targetPlayer.level || 1}
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Herói Selecionado
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      playerWon
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {playerWon ? 'Vitória' : 'Derrota'}
                  </span>
                </div>
                <h4 className="text-lg md:text-xl font-bold font-['Cinzel',serif] text-slate-100">
                  {hero.localized_name}
                </h4>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300 mt-0.5">
                  <span>
                    KDA: <strong className="text-emerald-400">{targetPlayer.kills}</strong>/
                    <strong className="text-red-400">{targetPlayer.deaths}</strong>/
                    <strong className="text-slate-200">{targetPlayer.assists}</strong>
                  </span>
                  <span>•</span>
                  <span>NW: <strong className="text-amber-300">{targetPlayer.net_worth?.toLocaleString() || '-'}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">
              Clique em qualquer herói no placar acima para focar a análise.
            </div>
          )}

          {/* Coach Persona & Settings */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Style Selector */}
            <div className="flex bg-[#090c12] p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCoachStyle('pro')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  coachStyle === 'pro'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>TI Coach</span>
              </button>

              <button
                type="button"
                onClick={() => setCoachStyle('constructive')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  coachStyle === 'constructive'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Pedagógico</span>
              </button>

              <button
                type="button"
                onClick={() => setCoachStyle('roast')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  coachStyle === 'roast'
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Modo Roast</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-[#090c12] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setLanguage('pt-BR')}
                className={`px-2.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  language === 'pt-BR'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PT-BR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  language === 'en'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
            </div>

            {/* Submit Analysis Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 hover:from-amber-400 hover:via-red-500 hover:to-amber-500 text-white font-extrabold rounded-xl shadow-lg shadow-amber-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wide"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Gerando Coaching...</span>
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  <span>Analisar Replay com IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Animated Tips */}
        {isGenerating && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col items-center justify-center gap-2 text-center animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{loadingTips[loadingTipIndex]}</span>
            </div>
            <div className="w-full max-w-md h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
