import React, { useState } from 'react';
import { Search, Sparkles, HelpCircle, Flame, Swords } from 'lucide-react';
import { PRESET_MATCHES } from '../data/dotaConstants';

interface MatchInputProps {
  onSearch: (matchId: string) => void;
  onSelectPreset: (preset: typeof PRESET_MATCHES[0]) => void;
  isLoading: boolean;
  currentMatchId?: string;
}

export const MatchInput: React.FC<MatchInputProps> = ({
  onSearch,
  onSelectPreset,
  isLoading,
  currentMatchId = '',
}) => {
  const [matchIdInput, setMatchIdInput] = useState(currentMatchId);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = matchIdInput.trim();
    if (cleanId) {
      onSearch(cleanId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="bg-[#10141d]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Swords className="w-5 h-5 text-red-400" />
            </div>
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={matchIdInput}
              onChange={(e) => setMatchIdInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Digite o Match ID (ex: 6227289873)..."
              disabled={isLoading}
              className="w-full pl-12 pr-10 py-3.5 bg-[#0b0e14] border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 font-mono text-base focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all disabled:opacity-50"
            />
            {matchIdInput && (
              <button
                type="button"
                onClick={() => setMatchIdInput('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 text-xs font-semibold"
              >
                Limpar
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !matchIdInput.trim()}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Carregando Dados...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Buscar Partida</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Presets / Demos */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Partidas Famosas para Testar Imediatamente:
            </span>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Onde achar meu Match ID?</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PRESET_MATCHES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setMatchIdInput(preset.id);
                  onSelectPreset(preset);
                }}
                disabled={isLoading}
                className="group text-left p-2.5 rounded-lg bg-[#0b0e14]/70 hover:bg-slate-800/90 border border-slate-800 hover:border-red-500/40 transition-all flex flex-col cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                  <span className="truncate">{preset.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{preset.duration}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  Herói: <span className="text-red-400 font-medium">{preset.heroName}</span> • {preset.sublabel}
                </div>
              </button>
            ))}
          </div>

          {/* Help Accordion */}
          {showHelp && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Como encontrar o Match ID da sua partida no Dota 2:
              </div>
              <p>
                1. Abra o <strong>Dota 2</strong> e clique no seu perfil.
              </p>
              <p>
                2. Vá na aba <strong>Histórico de Partidas (Match History)</strong> e selecione a partida desejada.
              </p>
              <p>
                3. No canto inferior ou superior direito da tela de estatísticas, copie o número de 10 dígitos (ex: <code className="bg-black/50 px-1 py-0.5 rounded text-amber-200 font-mono">7864321980</code>).
              </p>
              <p className="text-[11px] text-slate-400">
                * Importante: Sua opção "Expor Dados Públicos de Partidas" (Expose Public Match Data) nas configurações de conta do Dota 2 deve estar ativada para que a OpenDota consiga ler seus detalhes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
