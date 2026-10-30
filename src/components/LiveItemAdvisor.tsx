import React from 'react';
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  Coins,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Info
} from 'lucide-react';
import { getItemImageUrl } from '../data/dotaConstants';

export interface RecommendedItemData {
  name: string;
  reason: string;
  cost: number;
  currentProgress: number; // 0 to 100
}

interface LiveItemAdvisorProps {
  currentItems: string[];
  recommendedItem: RecommendedItemData | null;
  heroName: string;
}

export const LiveItemAdvisor: React.FC<LiveItemAdvisorProps> = ({
  currentItems,
  recommendedItem,
  heroName,
}) => {
  const item = recommendedItem || {
    name: 'Black King Bar',
    reason: 'Essencial para sobreviver ao burst mágico e stuns em cadeia do time inimigo.',
    cost: 4050,
    currentProgress: 70,
  };

  const situationalMatrix = [
    {
      item: "Black King Bar (BKB)",
      counterTo: "Burst Mágico & Stuns (Lion, Lina, Invoker)",
      icon: "black_king_bar",
    },
    {
      item: "Nullifier",
      counterTo: "Ghost Scepter, Glimmer, Aeon Disk, Eul",
      icon: "nullifier",
    },
    {
      item: "Silver Edge",
      counterTo: "Passivas defensivas (Bristleback, Spectre, PA)",
      icon: "silver_edge",
    },
    {
      item: "Heaven's Halberd",
      counterTo: "Carries físicos sem BKB (Ursa, Sven, Sniper)",
      icon: "heavens_halberd",
    },
    {
      item: "Spirit Vessel",
      counterTo: "Alta regeneração de HP (Alchemist, Morphling)",
      icon: "spirit_vessel",
    },
  ];

  return (
    <div className="bg-[#0f1420] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="font-['Cinzel',serif] text-sm md:text-base font-bold text-slate-100">
            Orientação de Itemização & Counters
          </h3>
        </div>
        <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
          Recomendado pela IA
        </span>
      </div>

      {/* Hero Current Inventory Bar */}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">
          Inventário Atual do {heroName}:
        </div>
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#090c12] rounded-xl border border-slate-800">
          {currentItems.map((itemName, idx) => {
            const cleanKey = itemName.toLowerCase().replace(/\s+/g, '_').replace(/'/g, '');
            const imgUrl = getItemImageUrl(cleanKey) || getItemImageUrl(itemName);
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
              >
                {imgUrl ? (
                  <img src={imgUrl} alt={itemName} className="w-5 h-4 object-cover rounded shrink-0" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                )}
                <span className="truncate max-w-[110px]">{itemName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Recommended Item Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-[#121824] to-[#0c1017] border border-amber-500/40 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
              Próxima Compra Crítica
            </span>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2 mt-0.5">
              <span>{item.name}</span>
              <span className="text-xs font-mono text-amber-300 font-bold flex items-center gap-0.5">
                <Coins className="w-3.5 h-3.5" /> {item.cost.toLocaleString()} gold
              </span>
            </h4>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-400">
              Progresso: {item.currentProgress}%
            </span>
          </div>
        </div>

        {/* Gold Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden my-2">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${item.currentProgress}%` }}
          />
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
          <strong className="text-amber-300">Justificativa Tática:</strong> {item.reason}
        </p>
      </div>

      {/* Situational Counter Matrix Cheat Sheet */}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>Matriz Rápida de Counters do Banco de Dados:</span>
        </div>
        <div className="space-y-1.5">
          {situationalMatrix.map((matrix, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-[#090c12] border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
            >
              <span className="font-bold text-slate-200 truncate">{matrix.item}</span>
              <span className="text-[11px] text-slate-400 truncate text-right">
                Anula: <strong className="text-cyan-300">{matrix.counterTo}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
