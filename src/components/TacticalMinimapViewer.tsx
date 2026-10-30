import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Navigation,
  Compass,
  Crosshair,
  ShieldAlert,
  ArrowRight,
  Users,
  User,
  Zap,
  Sparkles
} from 'lucide-react';

export interface TacticalMoment {
  id: number;
  time: string; // e.g. "06:15"
  category: string;
  title: string;
  locationName: string;
  urgency: 'Crítico' | 'Grave' | 'Moderado';
  goldImpact: string;
  playerCoords: { x: number; y: number }; // 0 to 100 percentage
  recommendedCoords: { x: number; y: number }; // 0 to 100 percentage
  threatCoords?: { x: number; y: number; label: string };
  whatHappened: string;
  whatShouldHaveDone: string;
  coachTip: string;
  actionImprovement?: string;
  mapAdvancementTip?: string; // Como e quando avançar: solo vs grupo
}

interface TacticalMinimapViewerProps {
  moments: TacticalMoment[];
  heroName: string;
}

export const TacticalMinimapViewer: React.FC<TacticalMinimapViewerProps> = ({
  moments,
  heroName,
}) => {
  const [selectedMomentId, setSelectedMomentId] = useState<number>(
    moments.length > 0 ? moments[0].id : 1
  );
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showThreats, setShowThreats] = useState<boolean>(true);

  if (!moments || moments.length === 0) return null;

  const activeMoment = moments.find((m) => m.id === selectedMomentId) || moments[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8">
      {/* Header Banner */}
      <div className="bg-[#0f1420] border border-amber-500/30 rounded-2xl p-4 md:p-6 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5" /> DOTAREVEW AI • Mapeamento Cartográfico
              </span>
              <span className="text-xs text-amber-400 font-mono font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Análise Automatizada por IA
              </span>
            </div>
            <h3 className="font-['Cinzel',serif] text-xl md:text-2xl font-black text-slate-100 mt-1">
              Falhas no Mapa & Momentos Críticos ({moments.length} Momentos Mapeados)
            </h3>
            <p className="text-xs md:text-sm text-slate-400">
              Momentos exatos onde posicionamento, avanço solo desprotegido ou falta de agrupamento impactaram o {heroName}.
            </p>
          </div>

          {/* Timeline Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {moments.map((moment) => {
              const isSelected = moment.id === activeMoment.id;
              return (
                <button
                  key={moment.id}
                  type="button"
                  onClick={() => setSelectedMomentId(moment.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                  <span>{moment.time}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      moment.urgency === 'Crítico'
                        ? isSelected ? 'bg-red-950 text-red-200' : 'bg-red-500/20 text-red-400'
                        : isSelected ? 'bg-amber-950 text-amber-200' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    #{moment.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Detailed Breakdown Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tactical Minimap (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-black select-none">
            {/* Real Dota 2 Minimap Background */}
            <img
              src="/minimap.jpg"
              alt="Dota 2 Tactical Minimap"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />

            {/* Darker contrast vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />

            {/* SVG Tactical Vector Overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="arrow-green"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#22c55e" />
                </marker>
              </defs>

              {/* Grid Lines if toggled */}
              {showGrid && (
                <g stroke="#ffffff15" strokeWidth="0.3">
                  <line x1="25" y1="0" x2="25" y2="100" />
                  <line x1="50" y1="0" x2="50" y2="100" />
                  <line x1="75" y1="0" x2="75" y2="100" />
                  <line x1="0" y1="25" x2="100" y2="25" />
                  <line x1="0" y1="50" x2="100" y2="50" />
                  <line x1="0" y1="75" x2="100" y2="75" />
                </g>
              )}

              {/* Trajectory Arrow from Player (Error) to Recommended Position */}
              <line
                x1={activeMoment.playerCoords.x}
                y1={activeMoment.playerCoords.y}
                x2={activeMoment.recommendedCoords.x}
                y2={activeMoment.recommendedCoords.y}
                stroke="#22c55e"
                strokeWidth="1.2"
                strokeDasharray="2.5 1.5"
                markerEnd="url(#arrow-green)"
                className="animate-pulse"
              />

              {/* Enemy Threat Circle (if available) */}
              {showThreats && activeMoment.threatCoords && (
                <g>
                  <circle
                    cx={activeMoment.threatCoords.x}
                    cy={activeMoment.threatCoords.y}
                    r="6.5"
                    fill="#ef444425"
                    stroke="#ef4444"
                    strokeWidth="0.6"
                    strokeDasharray="1.5 1"
                  />
                  <line
                    x1={activeMoment.threatCoords.x}
                    y1={activeMoment.threatCoords.y}
                    x2={activeMoment.playerCoords.x}
                    y2={activeMoment.playerCoords.y}
                    stroke="#ef444480"
                    strokeWidth="0.8"
                    strokeDasharray="1 1"
                  />
                </g>
              )}

              {/* Inactive moment markers */}
              {moments
                .filter((m) => m.id !== activeMoment.id)
                .map((m) => (
                  <g key={`inactive-${m.id}`} opacity="0.4">
                    <circle
                      cx={m.playerCoords.x}
                      cy={m.playerCoords.y}
                      r="2"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="0.4"
                    />
                  </g>
                ))}
            </svg>

            {/* HTML Pin 1: Player Error Position (Red Marker) */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              style={{
                left: `${activeMoment.playerCoords.x}%`,
                top: `${activeMoment.playerCoords.y}%`,
              }}
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-500 opacity-75" />
                <div className="relative w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-[10px]">
                  ✕
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/95 text-red-200 text-[10px] font-bold px-2 py-1 rounded shadow-xl border border-red-500/60 whitespace-nowrap pointer-events-none">
                Sua Posição (Falha)
              </div>
            </div>

            {/* HTML Pin 2: Recommended Position (Green Marker) */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              style={{
                left: `${activeMoment.recommendedCoords.x}%`,
                top: `${activeMoment.recommendedCoords.y}%`,
              }}
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75" />
                <div className="relative w-7 h-7 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-black font-extrabold text-[10px]">
                  ✓
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/95 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded shadow-xl border border-emerald-500/60 whitespace-nowrap pointer-events-none">
                Posição Ideal (Correta)
              </div>
            </div>

            {/* HTML Pin 3: Enemy Threat / Gank (if available) */}
            {showThreats && activeMoment.threatCoords && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{
                  left: `${activeMoment.threatCoords.x}%`,
                  top: `${activeMoment.threatCoords.y}%`,
                }}
              >
                <div className="px-1.5 py-0.5 rounded bg-red-950/90 border border-red-500 text-red-300 text-[9px] font-bold shadow-md whitespace-nowrap flex items-center gap-1">
                  <ShieldAlert className="w-2.5 h-2.5" />
                  <span>{activeMoment.threatCoords.label || 'Ameaça / Inimigos'}</span>
                </div>
              </div>
            )}

            {/* Map Orientation Tag */}
            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-emerald-400 border border-emerald-900/60 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Base Radiant</span>
            </div>
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-red-400 border border-red-900/60 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Base Dire</span>
            </div>
          </div>

          {/* Map Controls */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 border border-white inline-block" />
                <span className="text-slate-300">Falha / Morte</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white inline-block" />
                <span className="text-slate-300">Jogada Correta</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded text-[11px] font-semibold cursor-pointer border transition-colors ${
                  showGrid
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Alternar grade tática"
              >
                Grade
              </button>
              <button
                type="button"
                onClick={() => setShowThreats(!showThreats)}
                className={`p-1.5 rounded text-[11px] font-semibold cursor-pointer border transition-colors ${
                  showThreats
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Alternar vetores de ameaça"
              >
                Ameaças
              </button>
            </div>
          </div>
        </div>

        {/* Right: Detailed Moment Tactical Breakdown (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#0f1420] border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Top Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500 text-black">
                  Minuto {activeMoment.time}
                </span>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  {activeMoment.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    activeMoment.urgency === 'Crítico'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  Erro {activeMoment.urgency}
                </span>
              </div>
            </div>

            {/* Moment Title & Location */}
            <div className="mt-4">
              <h4 className="text-xl font-bold font-['Cinzel',serif] text-slate-100 flex items-center gap-2">
                {activeMoment.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-mono mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Local no Mapa: {activeMoment.locationName}</span>
              </div>
            </div>

            {/* Dual Cards: What Happened (Red) vs What Should Have Done (Green) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
              {/* Error Box */}
              <div className="p-4 rounded-xl bg-red-950/25 border border-red-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>O que Aconteceu (Falha)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeMoment.whatHappened}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-red-900/40 flex items-center gap-1.5 text-[11px] font-mono text-red-300">
                  <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Impacto: {activeMoment.goldImpact}</span>
                </div>
              </div>

              {/* Recommended Box */}
              <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>O que Deveria ter Feito</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {activeMoment.whatShouldHaveDone}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-900/40 flex items-center gap-1.5 text-[11px] font-mono text-emerald-300">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Posicionamento Ideal Recomendado</span>
                </div>
              </div>
            </div>

            {/* Ação de Melhoria Concreta (Actionable Improvement) */}
            {activeMoment.actionImprovement && (
              <div className="mt-3.5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 block mb-0.5">
                    Ação de Melhoria Concreta para Aplicar
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeMoment.actionImprovement}
                  </p>
                </div>
              </div>
            )}

            {/* Diretriz de Avanço no Mapa: Grupo vs Solo */}
            {activeMoment.mapAdvancementTip && (
              <div className="mt-3.5 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-cyan-300 block mb-0.5">
                    Como Avançar no Mapa (Andar em Grupo vs Solo)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeMoment.mapAdvancementTip}
                  </p>
                </div>
              </div>
            )}

            {/* Pro Coach Tactical Tip */}
            <div className="mt-3.5 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 block mb-0.5">
                  Diretriz Tática da IA
                </span>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{activeMoment.coachTip}"
                </p>
              </div>
            </div>

            {/* Moment Carousel Navigation */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Momento {activeMoment.id} de {moments.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeMoment.id === 1}
                  onClick={() => setSelectedMomentId(activeMoment.id - 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={activeMoment.id === moments.length}
                  onClick={() => setSelectedMomentId(activeMoment.id + 1)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-xs text-white font-bold cursor-pointer disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <span>Próximo Momento</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
