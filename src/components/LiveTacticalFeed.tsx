import React from 'react';
import {
  Volume2,
  AlertTriangle,
  Flame,
  Shield,
  Zap,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  Bot,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { cvEngine } from '../utils/cvEngine';

export interface LiveCoachingCallout {
  id: string;
  timestamp: string;
  voiceCallout: string;
  urgency: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY' | 'SAFE';
  tacticalDirective: string;
  enemyThreatSummary?: string;
  powerSpikeAlert?: string;
}

interface LiveTacticalFeedProps {
  currentCallout: LiveCoachingCallout | null;
  calloutHistory: LiveCoachingCallout[];
  voiceEnabled: boolean;
  onReplayVoice: (text: string) => void;
  heroName: string;
}

export const LiveTacticalFeed: React.FC<LiveTacticalFeedProps> = ({
  currentCallout,
  calloutHistory,
  voiceEnabled,
  onReplayVoice,
  heroName,
}) => {
  const urgencyStyles = {
    CRITICAL: {
      badge: 'bg-red-500 text-black font-black',
      border: 'border-red-500/50 bg-red-950/20',
      iconColor: 'text-red-400',
      label: 'ALERTA CRÍTICO',
    },
    WARNING: {
      badge: 'bg-amber-500 text-black font-black',
      border: 'border-amber-500/50 bg-amber-950/20',
      iconColor: 'text-amber-400',
      label: 'ATENÇÃO TÁTICA',
    },
    OPPORTUNITY: {
      badge: 'bg-emerald-400 text-black font-black',
      border: 'border-emerald-500/50 bg-emerald-950/20',
      iconColor: 'text-emerald-400',
      label: 'OPORTUNIDADE',
    },
    SAFE: {
      badge: 'bg-slate-600 text-white font-bold',
      border: 'border-slate-800 bg-[#0a0d14]',
      iconColor: 'text-slate-400',
      label: 'ROTA SEGURA',
    },
  };

  const urgency = currentCallout?.urgency || 'SAFE';
  const uStyle = urgencyStyles[urgency];

  return (
    <div className="flex flex-col gap-4">
      {/* Active Coach Voice Broadcast Card */}
      <div className={`p-5 rounded-2xl border ${uStyle.border} shadow-xl relative overflow-hidden transition-all duration-300`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Voz do Treinador de IA ao Vivo
              </span>
              <span className="text-xs font-bold text-slate-200">
                Instrução Auditiva para {heroName}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${uStyle.badge}`}>
              {uStyle.label}
            </span>
            <button
              type="button"
              onClick={() => onReplayVoice(currentCallout?.voiceCallout || '')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors"
              title="Repetir áudio do callout"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Big Speech Quote */}
        <div className="p-4 rounded-xl bg-black/60 border border-slate-800/80 my-2">
          <p className="text-base md:text-lg font-bold font-['Rajdhani',sans-serif] tracking-wide text-amber-200 italic leading-snug">
            "{currentCallout?.voiceCallout || 'Coach monitorando sua tela ao vivo... Seus timings e rotações serão narrados aqui.'}"
          </p>
        </div>

        {/* Tactical Directive (Next 30 seconds) */}
        {currentCallout?.tacticalDirective && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#090c12]/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Diretriz Tática para os Próximos 30s:</span>
            </div>
            <p className="leading-relaxed">
              {currentCallout.tacticalDirective}
            </p>
          </div>
        )}

        {/* Sub-cards: Threat & Power Spike */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
          {currentCallout?.enemyThreatSummary && (
            <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 text-[11px] text-red-200">
              <span className="font-bold flex items-center gap-1 text-red-400 mb-0.5">
                <AlertTriangle className="w-3 h-3" /> Ameaça Inimiga
              </span>
              <span>{currentCallout.enemyThreatSummary}</span>
            </div>
          )}

          {currentCallout?.powerSpikeAlert && (
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-emerald-200">
              <span className="font-bold flex items-center gap-1 text-emerald-400 mb-0.5">
                <Zap className="w-3 h-3" /> Janela de Pico de Força
              </span>
              <span>{currentCallout.powerSpikeAlert}</span>
            </div>
          )}
        </div>
      </div>

      {/* History of Past Callouts in this Session */}
      <div className="bg-[#0f1420] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Feed de Callouts da Sessão ({calloutHistory.length})</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {voiceEnabled ? 'Áudio Ativado' : 'Áudio Mudo'}
          </span>
        </div>

        {calloutHistory.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 font-medium">
            Nenhum callout registrado ainda. Inicie a captura de tela ou teste um cenário demo.
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {calloutHistory.map((item) => {
              const style = urgencyStyles[item.urgency] || urgencyStyles.SAFE;
              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-[#090c12] border border-slate-800/80 hover:border-slate-700 transition-colors flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-slate-500">{item.timestamp}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${style.badge}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="text-slate-200 font-medium leading-relaxed truncate">
                      "{item.voiceCallout}"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onReplayVoice(item.voiceCallout)}
                    className="p-1 rounded text-slate-500 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
                    title="Repetir voz"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
