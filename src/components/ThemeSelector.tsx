import React from 'react';
import { Palette, Check, Sparkles, Sun, Snowflake, Trophy, Moon, Compass } from 'lucide-react';
import { HUD_THEMES, HudTheme } from '../data/hudThemes';

interface ThemeSelectorProps {
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeId,
  onSelectTheme,
}) => {
  const themeList = Object.values(HUD_THEMES);

  const getThemeIcon = (id: string) => {
    switch (id) {
      case 'cold':
        return <Snowflake className="w-4 h-4 text-cyan-400" />;
      case 'classic':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'void':
        return <Moon className="w-4 h-4 text-purple-400" />;
      case 'radiant':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sun className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Temas de HUD do Treinador (Cores & Gradientes)
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Variáveis CSS Dinâmicas</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {themeList.map((theme) => {
          const isSelected = theme.id === currentThemeId;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isSelected
                  ? 'border-white shadow-lg ring-2 ring-white/20 scale-[1.02]'
                  : 'border-slate-800 hover:border-slate-600 bg-black/40'
              }`}
              style={{
                backgroundColor: theme.colors.cardBg,
                borderColor: isSelected ? theme.colors.accent : theme.colors.border,
              }}
            >
              {/* Color Swatch Header */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    {getThemeIcon(theme.id)}
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {theme.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-black">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                  {theme.description}
                </p>
              </div>

              {/* Palette Preview Swatches */}
              <div className="flex items-center gap-1 pt-2 border-t border-white/10">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Cor de Destaque"
                />
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.colors.radarBorder }}
                  title="Cor da Borda"
                />
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm border border-white/20"
                  style={{ backgroundColor: theme.colors.cardBg }}
                  title="Fundo dos Painéis"
                />
                <span className="text-[9px] text-slate-400 ml-auto font-mono">
                  {theme.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
