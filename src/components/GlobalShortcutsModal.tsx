import React from 'react';
import {
  Keyboard,
  Volume2,
  Play,
  Sparkles,
  MessageSquare,
  Eye,
  Sliders,
  X,
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';

export interface ShortcutConfig {
  id: string;
  label: string;
  description: string;
  primaryKey: string;
  altKeyCombo: string;
  category: 'voice' | 'monitor' | 'chat';
}

export const DEFAULT_SHORTCUTS: ShortcutConfig[] = [
  {
    id: 'toggle_voice',
    label: 'Silenciar / Desmutar Voz',
    description: 'Ativa ou silencia instantaneamente a voz do treinador no seu headset.',
    primaryKey: 'M',
    altKeyCombo: 'Alt + M',
    category: 'voice',
  },
  {
    id: 'toggle_auto',
    label: 'Pausar / Retomar Monitoramento',
    description: 'Pausa temporariamente o loop de captura de tela para economizar recursos.',
    primaryKey: 'P',
    altKeyCombo: 'Alt + P',
    category: 'monitor',
  },
  {
    id: 'instant_callout',
    label: 'Pedir Callout Imediato',
    description: 'Força a IA a analisar o frame da sua tela agora e dar uma instrução urgente.',
    primaryKey: 'C',
    altKeyCombo: 'Alt + C',
    category: 'monitor',
  },
  {
    id: 'open_chat',
    label: 'Conversar / Tirar Dúvidas (IA + Web)',
    description: 'Abre a central de chat do treinador para perguntar sobre itens, patch e rotas.',
    primaryKey: 'Q',
    altKeyCombo: 'Alt + Q',
    category: 'chat',
  },
  {
    id: 'toggle_mini',
    label: 'Miniatura Flutuante (Overlay PIP)',
    description: 'Transforma o coach em uma janela flutuante transparente que se posiciona sobre o jogo sem cobrir o HUD.',
    primaryKey: 'O',
    altKeyCombo: 'Alt + O',
    category: 'monitor',
  },
  {
    id: 'cycle_opencv',
    label: 'Alternar Filtros OpenCV',
    description: 'Alterna entre visualização Normal, Bordas Sobel e Máscara de Cores.',
    primaryKey: 'V',
    altKeyCombo: 'Alt + V',
    category: 'monitor',
  },
];

interface GlobalShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceEnabled: boolean;
  autoAnalyze: boolean;
  onToggleVoice: () => void;
  onToggleAutoAnalyze: () => void;
  onTriggerInstantCallout: () => void;
  onOpenChat: () => void;
  isFloatingMini?: boolean;
  onToggleMini?: () => void;
}

export const GlobalShortcutsModal: React.FC<GlobalShortcutsModalProps> = ({
  isOpen,
  onClose,
  voiceEnabled,
  autoAnalyze,
  onToggleVoice,
  onToggleAutoAnalyze,
  onTriggerInstantCallout,
  onOpenChat,
  isFloatingMini,
  onToggleMini,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0f1420] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Cinzel',serif] text-lg font-bold text-slate-100 flex items-center gap-2">
                Atalhos de Teclado Globais do Coach
              </h3>
              <p className="text-xs text-slate-400">
                Controle o treinador sem precisar sair do jogo ou alternar janelas (Alt-Tab).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto relative z-10">
          <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-500/30 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Os atalhos funcionam em qualquer tela da aplicação. Para jogadores em tela cheia com dois monitores ou modo janela, pressione as teclas para receber feedback sonoro imediato no seu fone!
            </p>
          </div>

          <div className="space-y-2.5">
            {DEFAULT_SHORTCUTS.map((shortcut) => {
              return (
                <div
                  key={shortcut.id}
                  className="p-3.5 rounded-xl bg-[#090c12] border border-slate-800/90 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-amber-300 text-xs font-bold rounded-lg shadow-sm">
                        {shortcut.primaryKey}
                      </kbd>
                      <span className="text-slate-500 text-xs">ou</span>
                      <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold rounded-lg shadow-sm">
                        {shortcut.altKeyCombo}
                      </kbd>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        {shortcut.label}
                        {shortcut.id === 'toggle_voice' && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                              voiceEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {voiceEnabled ? 'Ligada' : 'Mudo'}
                          </span>
                        )}
                        {shortcut.id === 'toggle_auto' && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                              autoAnalyze ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {autoAnalyze ? 'Ativo' : 'Pausado'}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                        {shortcut.description}
                      </p>
                    </div>
                  </div>

                  {/* Test button */}
                  <div>
                    {shortcut.id === 'toggle_voice' && (
                      <button
                        type="button"
                        onClick={onToggleVoice}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {voiceEnabled ? 'Silenciar' : 'Ativar'}
                      </button>
                    )}
                    {shortcut.id === 'toggle_auto' && (
                      <button
                        type="button"
                        onClick={onToggleAutoAnalyze}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {autoAnalyze ? 'Pausar' : 'Retomar'}
                      </button>
                    )}
                    {shortcut.id === 'instant_callout' && (
                      <button
                        type="button"
                        onClick={() => {
                          onTriggerInstantCallout();
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Testar
                      </button>
                    )}
                    {shortcut.id === 'open_chat' && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenChat();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Abrir
                      </button>
                    )}
                    {shortcut.id === 'toggle_mini' && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onToggleMini) onToggleMini();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {isFloatingMini ? 'Fechar Mini' : 'Ativar Mini'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#090c12] flex items-center justify-between text-xs text-slate-400">
          <span>Pressione <strong>ESC</strong> para fechar este painel.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl cursor-pointer shadow"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
