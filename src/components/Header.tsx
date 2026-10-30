import React from 'react';
import {
  Monitor,
  Database,
  History,
  Sparkles,
  Volume2,
  VolumeX,
  Radio,
  Flame,
  Bot,
  Keyboard,
  MessageSquare,
  Globe,
  Minimize2,
  Zap,
  Bell,
  Swords
} from 'lucide-react';

export type AppTab = 'live' | 'builds' | 'spawns' | 'database' | 'replay';

interface HeaderProps {
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isCapturingScreen: boolean;
  onOpenShortcuts: () => void;
  onOpenChat: () => void;
  isFloatingMini: boolean;
  onToggleFloatingMini: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  voiceEnabled,
  onToggleVoice,
  isCapturingScreen,
  onOpenShortcuts,
  onOpenChat,
  isFloatingMini,
  onToggleFloatingMini,
}) => {
  return (
    <header className="relative border-b border-red-950/40 bg-gradient-to-b from-[#111622] to-[#0a0d14] px-4 py-4 md:py-5 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-4 relative z-10">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-xl shadow-red-950/50 border-2 border-amber-500/50 group bg-slate-900 shrink-0">
            <img
              src="/logo.png"
              alt="Dota AI Coach Logo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a0d14] flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-black" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-['Cinzel',serif] text-xl md:text-2xl font-black tracking-wider bg-gradient-to-r from-red-400 via-amber-200 to-red-100 bg-clip-text text-transparent">
                DOTA AI LIVE COACH
              </h1>
              <span className="px-2 py-0.5 text-[9px] md:text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Radio className={`w-3 h-3 ${isCapturingScreen ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                {isCapturingScreen ? 'TELA AO VIVO' : 'SISTEMA PRONTO'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Acompanhamento de Tela em Tempo Real, Visão Computacional (OpenCV) e Callouts Táticos por Voz
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-[#090c12] p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => onChangeTab('live')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'live'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Treinador de Tela</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('builds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'builds'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Sugestão de Builds</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('spawns')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'spawns'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-purple-400" />
            <span>Alertas de Spawns</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Counters</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('replay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'replay'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>

        {/* Actions: Shortcuts, Chat & Voice Controls */}
        <div className="flex items-center gap-2">
          {/* Ask AI / Chat Button */}
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 shadow transition-all cursor-pointer"
            title="Abrir chat para tirar dúvidas com busca na web (Alt+Q)"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Dúvidas (Web)</span>
            <kbd className="hidden md:inline px-1 bg-black/50 text-[10px] text-cyan-200 rounded font-mono">Alt+Q</kbd>
          </button>

          {/* Floating Mini Overlay Button */}
          <button
            type="button"
            onClick={onToggleFloatingMini}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isFloatingMini
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md ring-1 ring-amber-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80'
            }`}
            title="Ativar/desativar janela miniatura flutuante sobre o jogo (Alt+O)"
          >
            <Minimize2 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Mini PIP</span>
            <kbd className="hidden md:inline px-1 bg-black/50 text-[10px] text-amber-300 rounded font-mono">Alt+O</kbd>
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all cursor-pointer"
            title="Configurar atalhos de teclado (Alt+H)"
          >
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Atalhos</span>
            <kbd className="hidden md:inline px-1 bg-black/50 text-[10px] text-amber-300 rounded font-mono">Alt+H</kbd>
          </button>

          {/* Global Voice Toggle Button */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              voiceEnabled
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Ativar/desativar voz do coach (Tecla M ou Alt+M)"
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="hidden xl:inline">Voz Ativa</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span className="hidden xl:inline">Mudo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
