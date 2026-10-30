import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sun,
  Moon,
  Sparkles,
  Shield,
  Zap,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { OBJECTIVE_TIMINGS } from '../data/dotaKnowledgeBase';

interface ObjectiveTimersProps {
  initialSeconds?: number;
  onTimerAlarm?: (alarmText: string) => void;
}

export const ObjectiveTimers: React.FC<ObjectiveTimersProps> = ({
  initialSeconds = 765, // ~12:45 default demo
  onTimerAlarm,
}) => {
  const [gameSeconds, setGameSeconds] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [customMinutes, setCustomMinutes] = useState<string>('');

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

  // Day / Night cycle in Dota 2: 5 minutes each
  // 00:00 to 05:00 = Day
  // 05:00 to 10:00 = Night
  // 10:00 to 15:00 = Day, etc.
  const isDay = Math.floor(mins / 5) % 2 === 0;
  const secondsIntoCycle = (mins % 5) * 60 + secs;
  const secondsLeftInCycle = 300 - secondsIntoCycle;
  const cycleMinsLeft = Math.floor(secondsLeftInCycle / 60);
  const cycleSecsLeft = secondsLeftInCycle % 60;

  // Next Wisdom Rune (7, 14, 21, 28, 35...)
  const nextWisdomMin = Math.ceil((mins + 0.01) / 7) * 7;
  const secondsToWisdom = nextWisdomMin * 60 - gameSeconds;

  // Next Power Rune (6, 8, 10, 12, 14...)
  let nextPowerMin = 6;
  if (mins >= 6) {
    nextPowerMin = Math.ceil((mins + 0.01) / 2) * 2;
  }
  const secondsToPower = Math.max(0, nextPowerMin * 60 - gameSeconds);

  // Next Lotus Pool (3, 6, 9, 12...)
  const nextLotusMin = Math.ceil((mins + 0.01) / 3) * 3;
  const secondsToLotus = Math.max(0, nextLotusMin * 60 - gameSeconds);

  // Tormentor (20:00)
  const isTormentorAlive = mins >= 20;

  const handleSetTime = (m: number, s: number = 0) => {
    setGameSeconds(m * 60 + s);
    setCustomMinutes('');
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#0f1420] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header & Clock Sync */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="font-['Cinzel',serif] text-sm md:text-base font-bold text-slate-100">
            Relógio de Objetivos & Timers do Mapa
          </h3>
        </div>

        {/* Live Game Clock Display */}
        <div className="flex items-center gap-2">
          <div className="bg-[#090c12] border border-slate-700 px-3 py-1 rounded-lg font-mono text-base font-extrabold text-amber-300">
            {timeFormatted}
          </div>
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
        </div>
      </div>

      {/* Day / Night & Roshan Pit Tracker */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#121824] to-[#0a0d14] border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isDay
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
            }`}
          >
            {isDay ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>{isDay ? 'Ciclo Diurno (Dia)' : 'Ciclo Noturno (Noite)'}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({cycleMinsLeft}:{cycleSecsLeft < 10 ? '0' : ''}{cycleSecsLeft} restantes)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Local de Roshan: <strong className={isDay ? 'text-emerald-400' : 'text-red-400'}>
                {isDay ? 'Covil Sudeste (Radiant)' : 'Covil Noroeste (Dire)'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Objective Countdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Wisdom Rune */}
        <div className="p-3 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Runa da Sabedoria</span>
            <span className="font-mono font-bold text-purple-400 text-sm">
              {formatCountdown(secondsToWisdom)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Próxima: aos <strong>{nextWisdomMin}:00</strong> (Bordas do mapa)
          </div>
        </div>

        {/* Power Rune */}
        <div className="p-3 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Runa de Poder (Rio)</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {formatCountdown(secondsToPower)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Próxima: aos <strong>{nextPowerMin}:00</strong> (Rio Top/Bot)
          </div>
        </div>

        {/* Tormentor */}
        <div className="p-3 rounded-xl bg-[#090c12] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Tormentor (Shard)</span>
            <span
              className={`font-mono font-bold text-sm ${
                isTormentorAlive ? 'text-emerald-400 animate-pulse' : 'text-slate-400'
              }`}
            >
              {isTormentorAlive ? 'DISPONÍVEL!' : formatCountdown(Math.max(0, 1200 - gameSeconds))}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Spawn inicial: aos <strong>20:00</strong>
          </div>
        </div>
      </div>

      {/* Quick Time Sync Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
        <span className="font-semibold">Sincronizar com seu jogo:</span>
        {[0, 5, 10, 15, 20, 25, 30, 35].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleSetTime(m)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer transition-colors"
          >
            {m}:00
          </button>
        ))}
      </div>
    </div>
  );
};
