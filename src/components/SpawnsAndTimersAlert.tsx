import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Sparkles,
  Droplet,
  Layers,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Bell,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { CAMP_STACK_TIMINGS, CampStackTiming } from '../data/dotaKnowledgeBase';
import { cvEngine } from '../utils/cvEngine';

interface SpawnsAndTimersAlertProps {
  initialSeconds?: number;
  voiceEnabled: boolean;
  onVoiceCallout?: (text: string) => void;
}

export const SpawnsAndTimersAlert: React.FC<SpawnsAndTimersAlertProps> = ({
  initialSeconds = 765, // 12:45 default demo time
  voiceEnabled,
  onVoiceCallout,
}) => {
  const [gameSeconds, setGameSeconds] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState<boolean>(true);
  const [lastAlertFired, setLastAlertFired] = useState<string>('');

  const lastNotifiedRef = useRef<{ [key: string]: number }>({});

  // Clock runner
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setGameSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const mins = Math.floor(gameSeconds / 60);
  const secs = gameSeconds % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  // ----------------------------------------------------
  // CALCULATE NEXT OBJECTIVES TIMINGS
  // ----------------------------------------------------

  // 1. Power Runes (Every 2 mins starting at 06:00: 06:00, 08:00, 10:00...)
  let nextPowerMin = 6;
  if (mins >= 6) {
    nextPowerMin = Math.ceil((mins + (secs > 0 ? 0.01 : 0)) / 2) * 2;
  }
  const secondsToPowerRune = Math.max(0, nextPowerMin * 60 - gameSeconds);

  // 2. Wisdom Runes (Every 7 mins: 07:00, 14:00, 21:00, 28:00...)
  const nextWisdomMin = Math.ceil((mins + (secs > 0 ? 0.01 : 0)) / 7) * 7;
  const secondsToWisdomRune = Math.max(0, nextWisdomMin * 60 - gameSeconds);

  // 3. Lotus Pools (Every 3 mins: 03:00, 06:00, 09:00, 12:00, 15:00...)
  const nextLotusMin = Math.ceil((mins + (secs > 0 ? 0.01 : 0)) / 3) * 3;
  const secondsToLotus = Math.max(0, nextLotusMin * 60 - gameSeconds);

  // 4. Creep Camp Respawn & Stacking
  // Camps respawn at :00 every minute starting at 01:00.
  // Stack pull window is between :53s and :55s of each minute!
  const secondsIntoMinute = secs;
  const secondsToStackWindow = secondsIntoMinute <= 53 ? 53 - secondsIntoMinute : (60 - secondsIntoMinute) + 53;
  const isInsideStackWindow = secondsIntoMinute >= 53 && secondsIntoMinute <= 55;
  const isStackWarning10s = secondsIntoMinute >= 45 && secondsIntoMinute < 53;

  // Day/Night Cycle (Every 5 mins)
  const isDay = Math.floor(mins / 5) % 2 === 0;
  const secondsIntoDayNight = (mins % 5) * 60 + secs;
  const secondsToDayNightSwitch = 300 - secondsIntoDayNight;

  // ----------------------------------------------------
  // AUTOMATIC AUDIO & VOICE PRE-SPAWN ALERTS
  // ----------------------------------------------------
  useEffect(() => {
    if (!voiceAlertsEnabled) return;

    const fireAlert = (key: string, text: string, type: 'critical' | 'warning' | 'objective' = 'objective') => {
      // Prevent duplicate firing within 30 seconds for the same event
      const now = Date.now();
      if (lastNotifiedRef.current[key] && now - lastNotifiedRef.current[key] < 30000) return;

      lastNotifiedRef.current[key] = now;
      setLastAlertFired(text);

      cvEngine.playAlertTone(type);
      if (voiceEnabled) {
        cvEngine.speakCallout(text, { enabled: true, rate: 1.15, lang: 'pt-BR' });
      }
      if (onVoiceCallout) {
        onVoiceCallout(text);
      }
    };

    // Alert 15 seconds before Power Runes
    if (mins >= 5 && secondsToPowerRune === 15) {
      fireAlert('power_rune', 'Atenção: Runas de Poder surgem no rio em 15 segundos! Posicione-se!', 'warning');
    }

    // Alert 20 seconds before Wisdom Rune
    if (secondsToWisdomRune === 20) {
      fireAlert('wisdom_rune', 'Runa de Sabedoria surge em 20 segundos nas bordas do mapa! Garanta o XP!', 'critical');
    }

    // Alert 15 seconds before Lotus Pool
    if (secondsToLotus === 15) {
      fireAlert('lotus_pool', 'Lótus surgindo na piscina lateral em 15 segundos!', 'objective');
    }

    // Alert at second :48 for Creep Camp Stacking (5 seconds before :53 pull window)
    if (mins >= 1 && secondsIntoMinute === 48) {
      fireAlert('camp_stack', 'Atenção suporte: Prepare o stack dos campos neutros! Puxe aos 53 segundos!', 'objective');
    }

    // Alert at second :53 (Stack now!)
    if (mins >= 1 && secondsIntoMinute === 53) {
      fireAlert('camp_stack_now', 'PUXE O CAMPO AGORA aos 53 para stackar!', 'critical');
    }
  }, [gameSeconds, secondsToPowerRune, secondsToWisdomRune, secondsToLotus, secondsIntoMinute, mins, voiceAlertsEnabled, voiceEnabled, onVoiceCallout]);

  const formatCountdown = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSyncTime = (m: number) => {
    setGameSeconds(m * 60);
  };

  return (
    <div className="hud-card border rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
      {/* Header & Clock Display */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-purple-400" />
              Monitoramento Automático de Spawns
            </span>
            <span className="text-xs text-slate-400 font-mono">Runas • Lótus • Acampamentos</span>
          </div>
          <h3 className="font-['Cinzel',serif] text-xl font-bold text-slate-100 mt-1">
            Alertas de Spawns & Cronômetro do Mapa
          </h3>
        </div>

        {/* Live Synchronized Game Clock Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#090c12] border-2 border-amber-500/50 px-4 py-2 rounded-xl shadow-lg">
            <Clock className="w-5 h-5 text-amber-400" />
            <div className="font-mono text-xl font-black text-amber-300 tracking-wider">
              {timeFormatted}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors"
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>

          <button
            type="button"
            onClick={() => setVoiceAlertsEnabled(!voiceAlertsEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              voiceAlertsEnabled
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Ativar/desativar avisos por voz 15s antes de cada spawn"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Avisos de Voz: {voiceAlertsEnabled ? 'Ligados' : 'Desligados'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Alert Active Ribbon */}
      {lastAlertFired && (
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/50 text-xs text-purple-200 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping shrink-0" />
            <span>Último Alerta do Coach: <strong className="text-white">"{lastAlertFired}"</strong></span>
          </div>
          <span className="text-[10px] text-purple-400 font-mono shrink-0">Alerta emitido</span>
        </div>
      )}

      {/* Grid: 4 Core Objective Spawns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Runas de Poder (Rio) */}
        <div className="p-4 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Runas do Rio (Poder)
              </span>
              <h4 className="text-sm font-bold text-slate-200 mt-0.5">Haste / DD / Arcana / Invis</h4>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-black font-mono text-amber-300">
              {formatCountdown(secondsToPowerRune)}
            </div>
            <span className="text-[10px] text-slate-400">
              Próxima aos <strong className="text-slate-200">{nextPowerMin}:00</strong> (A cada 2m)
            </span>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Aviso sonoro disparado aos <strong className="text-amber-400">15s antes</strong> para contestações.
          </div>
        </div>

        {/* 2. Runa da Sabedoria (Wisdom) */}
        <div className="p-4 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">
                Runa da Sabedoria
              </span>
              <h4 className="text-sm font-bold text-slate-200 mt-0.5">XP Crítico em Equipe</h4>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-black font-mono text-purple-300">
              {formatCountdown(secondsToWisdomRune)}
            </div>
            <span className="text-[10px] text-slate-400">
              Próxima aos <strong className="text-slate-200">{nextWisdomMin}:00</strong> (A cada 7m)
            </span>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Concede XP aos dois heróis com menor nível do time.
          </div>
        </div>

        {/* 3. Piscina de Lótus (Lotus Pool) */}
        <div className="p-4 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                Piscina de Lótus
              </span>
              <h4 className="text-sm font-bold text-slate-200 mt-0.5">Cura de HP & Mana</h4>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Droplet className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-black font-mono text-cyan-300">
              {formatCountdown(secondsToLotus)}
            </div>
            <span className="text-[10px] text-slate-400">
              Próxima aos <strong className="text-slate-200">{nextLotusMin}:00</strong> (A cada 3m)
            </span>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Spawn nas bordas das rotas. 3 lótus = Grande Lótus (400 HP/Mana).
          </div>
        </div>

        {/* 4. Janela de Stacking de Acampamentos */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
            isInsideStackWindow
              ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
              : isStackWarning10s
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-[#090c12] border-slate-800'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                Acampamentos & Stacking
              </span>
              <h4 className="text-sm font-bold text-slate-200 mt-0.5">Puxada aos :53-:55s</h4>
            </div>
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
              isInsideStackWindow
                ? 'bg-amber-500 text-black border-amber-300 animate-bounce'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className={`text-2xl font-black font-mono ${
              isInsideStackWindow ? 'text-amber-300 animate-pulse' : 'text-emerald-300'
            }`}>
              {isInsideStackWindow ? 'PUXE AGORA! (:53)' : `${secondsToStackWindow}s`}
            </div>
            <span className="text-[10px] text-slate-400">
              {isInsideStackWindow
                ? 'Ataque os creeps e corra em linha reta!'
                : `Próximo stack ao segundo :53`}
            </span>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Respawn geral de campos: a cada minuto (:00).
          </div>
        </div>
      </div>

      {/* Camp Stacking Guides & Pull Timings Card */}
      <div className="bg-[#090c12] border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Guia de Segundos Exatos para Puxada (Stack & Pull):
          </span>
          <span className="text-[11px] text-amber-300 font-mono">Janela Universal: :53 a :55 segundos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {CAMP_STACK_TIMINGS.map((camp, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-black/60 border border-slate-800 flex flex-col justify-between text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <strong className="text-slate-200 truncate">{camp.label}</strong>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300">
                    :{camp.stackSecondStart}-:{camp.stackSecondEnd}s
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mb-2">
                  {camp.pullDirection}
                </p>
              </div>

              {camp.pullSecondStart && (
                <div className="text-[10px] text-cyan-300 font-mono pt-1.5 border-t border-slate-800/80">
                  Pull de Rota: aos <strong>:{camp.pullSecondStart}s</strong> e <strong>:{camp.pullSecondEnd}s</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fast Clock Synchronizer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span>Sincronizar Relógio:</span>
          {[0, 2, 4, 6, 7, 10, 14, 20, 25, 30].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleSyncTime(m)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer transition-colors"
            >
              {m}:00
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-500 italic">
          O coach narra no fone 15s antes de cada objetivo.
        </span>
      </div>
    </div>
  );
};
