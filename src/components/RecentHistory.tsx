import React from 'react';
import { History, Trash2, ArrowRight, Trophy } from 'lucide-react';
import { getHero, getHeroImageUrl } from '../data/dotaConstants';

export interface SavedAnalysis {
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
  tacticalMoments?: any[];
  report: string;
  generatedAt: string;
}

interface RecentHistoryProps {
  history: SavedAnalysis[];
  onSelect: (item: SavedAnalysis) => void;
  onClear: () => void;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 font-bold">
          <History className="w-4 h-4 text-amber-400" />
          <span>Histórico de Análises Salvas ({history.length})</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {history.map((item, idx) => {
          const hero = getHero(item.heroId);
          return (
            <button
              key={`${item.matchId}-${item.heroId}-${idx}`}
              type="button"
              onClick={() => onSelect(item)}
              className="text-left p-3 rounded-xl bg-[#0e131d] hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                  <img
                    src={getHeroImageUrl(hero.id)}
                    alt={hero.localized_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 truncate">
                      {hero.localized_name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1 rounded ${
                        item.playerWon ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {item.playerWon ? 'V' : 'D'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    #{item.matchId} • KDA: {item.kda}
                  </div>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
