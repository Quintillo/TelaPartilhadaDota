import React, { useState } from 'react';
import {
  MapPin,
  Shield,
  AlertTriangle,
  Eye,
  Crosshair,
  Compass,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

export interface MinimapPing {
  x: number; // 0 to 100
  y: number; // 0 to 100
  type: 'player' | 'danger' | 'safe_move' | 'objective' | 'ward';
  label: string;
}

interface LiveRadarMapProps {
  pings: MinimapPing[];
  currentZone: string;
  recommendedZone: string;
  safetyRating: number;
  movementAdvice: string;
  heroName: string;
}

export const LiveRadarMap: React.FC<LiveRadarMapProps> = ({
  pings,
  currentZone,
  recommendedZone,
  safetyRating,
  movementAdvice,
  heroName,
}) => {
  const [showWards, setShowWards] = useState<boolean>(true);
  const [showDangerZones, setShowDangerZones] = useState<boolean>(true);

  // Key map landmarks
  const playerPing = pings.find((p) => p.type === 'player') || { x: 35, y: 75, label: heroName, type: 'player' };
  const safeMovePing = pings.find((p) => p.type === 'safe_move');
  const dangerPing = pings.find((p) => p.type === 'danger');

  return (
    <div className="bg-[#0f1420] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <h3 className="font-['Cinzel',serif] text-sm md:text-base font-bold text-slate-100">
            Radar Tático de Rotas & Minimapa
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              safetyRating >= 70
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : safetyRating >= 40
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
            }`}
          >
            Segurança da Zona: {safetyRating}%
          </span>
        </div>
      </div>

      {/* Minimap Viewport */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-700 bg-black select-none shadow-inner">
        <img
          src="/minimap.jpg"
          alt="Minimap Radar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* SVG Navigation Vector lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <marker
              id="radar-arrow-green"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#22c55e" />
            </marker>
          </defs>

          {/* Recommended Movement Path */}
          {safeMovePing && (
            <line
              x1={playerPing.x}
              y1={playerPing.y}
              x2={safeMovePing.x}
              y2={safeMovePing.y}
              stroke="#22c55e"
              strokeWidth="1.4"
              strokeDasharray="2.5 1.5"
              markerEnd="url(#radar-arrow-green)"
              className="animate-pulse"
            />
          )}

          {/* Danger Threat Vector */}
          {showDangerZones && dangerPing && (
            <g>
              <circle
                cx={dangerPing.x}
                cy={dangerPing.y}
                r="7"
                fill="#ef444425"
                stroke="#ef4444"
                strokeWidth="0.8"
                strokeDasharray="1.5 1"
              />
              <line
                x1={dangerPing.x}
                y1={dangerPing.y}
                x2={playerPing.x}
                y2={playerPing.y}
                stroke="#ef444460"
                strokeWidth="1"
                strokeDasharray="1 1"
              />
            </g>
          )}
        </svg>

        {/* Render HTML Pings on Radar */}
        {pings.map((ping, idx) => {
          if (ping.type === 'ward' && !showWards) return null;
          if (ping.type === 'danger' && !showDangerZones) return null;

          if (ping.type === 'player') {
            return (
              <div
                key={`ping-${idx}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-cyan-400 opacity-75" />
                  <div className="relative w-6 h-6 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-black font-extrabold text-[9px]">
                    VOCÊ
                  </div>
                </div>
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-black/90 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg border border-cyan-500/50 whitespace-nowrap pointer-events-none">
                  {ping.label || heroName}
                </div>
              </div>
            );
          }

          if (ping.type === 'safe_move') {
            return (
              <div
                key={`ping-${idx}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
                style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-black font-extrabold text-[9px]">
                  ✓
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/50 whitespace-nowrap pointer-events-none">
                  {ping.label}
                </div>
              </div>
            );
          }

          if (ping.type === 'danger') {
            return (
              <div
                key={`ping-${idx}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
                style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
              >
                <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-extrabold text-[9px] animate-bounce">
                  !
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-red-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-500/50 whitespace-nowrap pointer-events-none">
                  {ping.label}
                </div>
              </div>
            );
          }

          if (ping.type === 'objective') {
            return (
              <div
                key={`ping-${idx}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
                style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-black shadow-lg flex items-center justify-center text-black font-extrabold text-[9px]">
                  ★
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/50 whitespace-nowrap pointer-events-none">
                  {ping.label}
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* Base markers */}
        <div className="absolute bottom-1.5 left-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-400 border border-emerald-900/60">
          Base Radiant
        </div>
        <div className="absolute top-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-red-400 border border-red-900/60">
          Base Dire
        </div>
      </div>

      {/* Movement Advice Callout */}
      <div className="flex flex-col gap-2 bg-[#090c12] p-3.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800/80">
          <div>
            Zona Atual: <strong className="text-slate-200">{currentZone || 'Deadlane / Rota'}</strong>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div>
            Destino Seguro: <strong className="text-emerald-400">{recommendedZone || 'Triângulo'}</strong>
          </div>
        </div>

        <div className="text-slate-300 leading-relaxed font-medium">
          <strong className="text-cyan-400">Instrução de Deslocamento:</strong> {movementAdvice || 'Avanço solo cuidadoso; recue assim que 3 inimigos sumirem do minimapa.'}
        </div>
      </div>
    </div>
  );
};
