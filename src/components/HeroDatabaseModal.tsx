import React, { useState } from 'react';
import {
  Search,
  Shield,
  Zap,
  Target,
  Swords,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  X
} from 'lucide-react';
import { HEROES_MAP, getHeroImageUrl, getItemImageUrl } from '../data/dotaConstants';
import { HERO_DATABASE, HeroCounterInfo } from '../data/dotaKnowledgeBase';

interface HeroDatabaseModalProps {
  currentHeroId: number;
  onSelectHero: (heroId: number, heroName: string) => void;
  onClose?: () => void;
}

export const HeroDatabaseModal: React.FC<HeroDatabaseModalProps> = ({
  currentHeroId,
  onSelectHero,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAttr, setSelectedAttr] = useState<string>('all');
  const [activeHeroId, setActiveHeroId] = useState<number>(currentHeroId);

  const heroList = Object.values(HEROES_MAP);

  const filteredHeroes = heroList.filter((h) => {
    const matchesSearch = h.localized_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAttr = selectedAttr === 'all' || h.primary_attr === selectedAttr;
    return matchesSearch && matchesAttr;
  });

  const activeHero = HEROES_MAP[activeHeroId] || heroList[0];
  const counterInfo: HeroCounterInfo | undefined = HERO_DATABASE[activeHero.localized_name];

  return (
    <div className="bg-[#0f1420] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Enciclopédia de Dota 2
            </span>
            <span className="text-xs text-slate-400 font-mono">125+ Heróis Catalogados</span>
          </div>
          <h3 className="font-['Cinzel',serif] text-xl md:text-2xl font-bold text-slate-100 mt-1">
            Banco de Dados de Heróis & Guia de Counters
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hero Selector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar herói (ex: Anti-Mage, Axe, Pudge)..."
              className="w-full pl-9 pr-3 py-2 bg-[#090c12] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Attribute Filters */}
          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'str', 'agi', 'int'].map((attr) => (
              <button
                key={attr}
                type="button"
                onClick={() => setSelectedAttr(attr)}
                className={`flex-1 py-1.5 rounded-lg font-bold uppercase text-[10px] cursor-pointer transition-all ${
                  selectedAttr === attr
                    ? attr === 'str'
                      ? 'bg-red-500 text-white'
                      : attr === 'agi'
                      ? 'bg-emerald-500 text-black'
                      : attr === 'int'
                      ? 'bg-cyan-500 text-black'
                      : 'bg-amber-500 text-black'
                    : 'bg-[#090c12] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {attr === 'all' ? 'Todos' : attr}
              </button>
            ))}
          </div>

          {/* Scrollable Hero Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-96 overflow-y-auto p-1 bg-[#090c12] rounded-xl border border-slate-800/80">
            {filteredHeroes.map((h) => {
              const isSelected = h.id === activeHeroId;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveHeroId(h.id)}
                  className={`relative aspect-[16/9] rounded-lg overflow-hidden border transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 z-10'
                      : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                  }`}
                  title={h.localized_name}
                >
                  <img
                    src={getHeroImageUrl(h.id)}
                    alt={h.localized_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 px-1 py-0.5 text-[8px] font-bold text-slate-300 truncate text-center">
                    {h.localized_name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Counter & Synergy Dossier (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 bg-[#0a0d14] border border-slate-800 rounded-xl p-5">
          {/* Active Hero Profile Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-16 h-12 rounded-lg overflow-hidden border-2 border-amber-400 shrink-0">
                <img
                  src={getHeroImageUrl(activeHero.id)}
                  alt={activeHero.localized_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-['Cinzel',serif] text-xl font-bold text-slate-100">
                  {activeHero.localized_name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="capitalize font-semibold text-amber-300">
                    Atributo: {activeHero.primary_attr}
                  </span>
                  <span>•</span>
                  <span>{activeHero.attack_type}</span>
                  <span>•</span>
                  <span className="text-slate-300">{activeHero.roles.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Set as Active Coach Hero */}
            <button
              type="button"
              onClick={() => onSelectHero(activeHero.id, activeHero.localized_name)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all"
            >
              Definir no Live Coach
            </button>
          </div>

          {/* Counters Breakdown */}
          {counterInfo ? (
            <div className="space-y-4">
              {/* Who counters this hero (Threats) */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-2 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-red-400" />
                  Counters Perigosos (Quem anula o {activeHero.localized_name}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {counterInfo.counteredBy.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 text-xs">
                      <div className="font-bold text-red-300">{c.hero}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{c.why}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Situational Item Counters */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Itens Situacionais Essenciais:
                </span>
                <div className="space-y-1.5">
                  {counterInfo.situationalCounters.map((s, i) => (
                    <div key={i} className="p-2 rounded-lg bg-[#090c12] border border-slate-800 text-xs flex items-start gap-2.5">
                      <strong className="text-amber-300 shrink-0">{s.item}</strong>
                      <span className="text-slate-400 text-[11px] leading-relaxed">
                        Contra {s.target}: {s.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Power Spikes */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  Picos de Força (Power Spikes):
                </span>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                  {counterInfo.powerSpikes.map((spike, i) => (
                    <li key={i}>{spike}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              <p>Este herói está registrado no banco de dados de estatísticas.</p>
              <p className="text-slate-500 mt-1">
                Ao iniciar o Live Coach, a IA Gemini processará a visão em tempo real adaptada para {activeHero.localized_name}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
