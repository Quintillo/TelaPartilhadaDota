import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Swords,
  Coins,
  Sparkles,
  TrendingUp,
  Volume2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Info,
  Check,
  Plus
} from 'lucide-react';
import { SMART_COUNTER_ITEMS, SmartCounterItem } from '../data/dotaKnowledgeBase';
import { getItemImageUrl, HEROES_MAP, getHeroImageUrl } from '../data/dotaConstants';
import { cvEngine } from '../utils/cvEngine';

interface SmartBuildAdvisorProps {
  currentHeroName: string;
  enemyHeroes: string[];
  onUpdateEnemyHeroes: (heroes: string[]) => void;
  voiceEnabled: boolean;
}

export const SmartBuildAdvisor: React.FC<SmartBuildAdvisorProps> = ({
  currentHeroName,
  enemyHeroes,
  onUpdateEnemyHeroes,
  voiceEnabled,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'defensive' | 'offensive' | 'utility'>('all');
  const [selectedItem, setSelectedItem] = useState<SmartCounterItem>(SMART_COUNTER_ITEMS[0]);
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);

  // Top popular enemy counter picks to quickly swap
  const quickEnemyOptions = [
    'Axe', 'Lion', 'Lina', 'Storm Spirit', 'Ursa', 'Bristleback',
    'Necrophos', 'Alchemist', 'Morphling', 'Silencer', 'Phantom Assassin',
    'Faceless Void', 'Legion Commander', 'Pudge', 'Sniper', 'Tidehunter'
  ];

  // Calculate matchup score & relevant counter items based on current enemy heroes
  const scoredItems = SMART_COUNTER_ITEMS.map((item) => {
    // Count how many enemies on screen are countered by this item
    const matchedEnemies = item.targetHeroes.filter((target) =>
      enemyHeroes.some((enemy) => target.toLowerCase().includes(enemy.toLowerCase()) || enemy.toLowerCase().includes(target.toLowerCase()))
    );

    const relevanceScore = matchedEnemies.length * 25 + (item.priorityTier === 'ESSENTIAL' ? 30 : item.priorityTier === 'RECOMMENDED' ? 15 : 0);

    return {
      ...item,
      matchedEnemies,
      relevanceScore,
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);

  const filteredItems = scoredItems.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  const handleSwapEnemy = (index: number, newHero: string) => {
    const updated = [...enemyHeroes];
    updated[index] = newHero;
    onUpdateEnemyHeroes(updated);
    setEditingSlotIndex(null);
  };

  const handleSpeakItemAdvice = (item: SmartCounterItem) => {
    cvEngine.speakCallout(
      `Sugestão de build: Compre ${item.name}. ${item.whyDescription}`,
      { enabled: true, rate: 1.15, lang: 'pt-BR' }
    );
  };

  return (
    <div className="hud-card border rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Algoritmo de Counter-Build por Win-Rate
            </span>
            <span className="text-xs text-slate-400 font-mono">Dota 2 Meta Analytics</span>
          </div>
          <h3 className="font-['Cinzel',serif] text-xl md:text-2xl font-bold text-slate-100 mt-1">
            Sugestão Inteligente de Builds & Counters
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Itens calculados para anular os heróis inimigos visíveis na sua tela com base em taxas de vitória e impacto em lutas.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-[#090c12] p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'defensive', label: 'Defensivos' },
            { id: 'offensive', label: 'Ofensivos' },
            { id: 'utility', label: 'Utilidade' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enemy Team Lineup Bar (Clickable Slots to Adapt Build) */}
      <div className="bg-[#090c12] border border-slate-800/90 rounded-xl p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-red-400" />
            Time Inimigo Detectado na Tela (Clique para alterar o herói):
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">Clique no slot para trocar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {enemyHeroes.slice(0, 5).map((enemy, idx) => {
            const isEditing = editingSlotIndex === idx;
            return (
              <div key={idx} className="relative">
                <button
                  type="button"
                  onClick={() => setEditingSlotIndex(isEditing ? null : idx)}
                  className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    isEditing
                      ? 'border-amber-400 bg-amber-500/15'
                      : 'border-slate-800 hover:border-slate-600 bg-black/60'
                  }`}
                >
                  <div className="w-7 h-7 rounded overflow-hidden bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center font-bold text-xs text-red-400">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Inimigo {idx + 1}</div>
                    <div className="text-xs font-bold text-slate-200 truncate">{enemy}</div>
                  </div>
                </button>

                {/* Quick Hero Selector Dropdown */}
                {isEditing && (
                  <div className="absolute top-full left-0 mt-1 z-30 w-48 bg-[#0f1420] border border-amber-500/50 rounded-xl p-2 shadow-2xl space-y-1 max-h-48 overflow-y-auto">
                    <div className="text-[10px] font-bold text-amber-300 px-1 mb-1">Escolha o Inimigo:</div>
                    {quickEnemyOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSwapEnemy(idx, opt)}
                        className="w-full text-left px-2 py-1 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout: Ranked Items List (Left 6 cols) + Deep Item Intelligence Card (Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Ranked Counter Items List (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-2.5 max-h-[520px] overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const isSelected = selectedItem.id === item.id;
            const imgUrl = getItemImageUrl(item.icon);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg ring-1 ring-amber-400/40'
                    : 'border-slate-800 hover:border-slate-700 bg-[#090c12]/80'
                }`}
              >
                {/* Item Icon & Identity */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-9 rounded-lg overflow-hidden border border-slate-700 bg-black shrink-0 group-hover:scale-105 transition-transform">
                    {imgUrl ? (
                      <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[10px]">
                        Item
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-200 truncate">
                        {item.name}
                      </h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          item.priorityTier === 'ESSENTIAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.priorityTier === 'ESSENTIAL' ? 'CRÍTICO' : 'RECOMENDADO'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      Contra: <span className="text-cyan-300 font-semibold">{item.targetEnemyTypes.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Win Rate Delta Badge & Gold */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end font-mono font-bold text-xs text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{item.winRateDelta}</span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-300 font-semibold flex items-center gap-0.5 justify-end mt-0.5">
                    <Coins className="w-3 h-3 text-amber-400" />
                    <span>{item.cost.toLocaleString()}g</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Deep Dive Card (6 cols) */}
        <div className="lg:col-span-6 bg-[#0a0d14] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          {/* Item Spotlight Header */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-14 h-11 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-black">
                {getItemImageUrl(selectedItem.icon) && (
                  <img
                    src={getItemImageUrl(selectedItem.icon)!}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h4 className="text-lg font-bold font-['Cinzel',serif] text-slate-100">
                  {selectedItem.name}
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> {selectedItem.cost.toLocaleString()} de Ouro
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{selectedItem.winRateDelta}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSpeakItemAdvice(selectedItem)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              title="Ouvir conselho tático do item no fone"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Statistical Win Rate Impact Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/40 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                Vantagem Estatística Estimada (Dota2ProTracker)
              </span>
              <p className="text-slate-200 mt-0.5">
                Taxa de vitória média de <strong>{selectedItem.winRateBase}%</strong> ao completar este item contra a composição adversária.
              </p>
            </div>
            <div className="text-xl font-black font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              {selectedItem.winRateDelta}
            </div>
          </div>

          {/* Why it Counters the Enemy Team */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Por Que Este Item é o Counter Perfeito:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0f1420] p-3.5 rounded-xl border border-slate-800">
              {selectedItem.whyDescription}
            </p>
          </div>

          {/* Specific Enemies Targeted */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              Alvos Inimigos que Este Item Anula:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedItem.targetHeroes.map((heroTarget, hIdx) => {
                const isPresent = enemyHeroes.some((e) => heroTarget.toLowerCase().includes(e.toLowerCase()));
                return (
                  <span
                    key={hIdx}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                      isPresent
                        ? 'bg-red-500/20 text-red-200 border-red-500/50 ring-1 ring-red-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {isPresent && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />}
                    <span>{heroTarget}</span>
                    {isPresent && <span className="text-[9px] text-red-300 font-mono">(Na Partida)</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Components List */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Receita / Componentes de Compra:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedItem.components.map((comp, cIdx) => (
                <span
                  key={cIdx}
                  className="px-2.5 py-1 rounded-lg bg-[#090c12] border border-slate-800 text-[11px] font-mono text-slate-300"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Pro In-Game Execution Tip */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-slate-300 leading-relaxed italic">
            <strong className="text-amber-300 not-italic block mb-0.5">Dica de Execução pelo Coach:</strong>
            "{selectedItem.inGameTip}"
          </div>
        </div>
      </div>
    </div>
  );
};
