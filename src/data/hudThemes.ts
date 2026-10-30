export interface HudTheme {
  id: string;
  name: string;
  description: string;
  tag: string;
  colors: {
    border: string;
    borderGlow: string;
    bgGradient: string;
    cardBg: string;
    accent: string;
    accentHover: string;
    badgeBg: string;
    badgeText: string;
    radarBorder: string;
  };
}

export const HUD_THEMES: Record<string, HudTheme> = {
  incandescent: {
    id: 'incandescent',
    name: 'Incandescente',
    description: 'Fogo e brasas, inspirado em Lina, Doom e Ember Spirit (Vermelho e Âmbar)',
    tag: 'Fogo / Fúria',
    colors: {
      border: 'rgba(239, 68, 68, 0.45)',
      borderGlow: 'rgba(239, 68, 68, 0.2)',
      bgGradient: 'radial-gradient(ellipse at top, #2b0b0b 0%, #0d0f17 55%, #06070a 100%)',
      cardBg: '#111624',
      accent: '#f59e0b',
      accentHover: '#fbbf24',
      badgeBg: 'rgba(239, 68, 68, 0.2)',
      badgeText: '#f87171',
      radarBorder: '#ef4444',
    },
  },
  cold: {
    id: 'cold',
    name: 'Frio / Glacial',
    description: 'Gelo e geada mística, inspirado em Crystal Maiden e Ancient Apparition (Ciano e Azul)',
    tag: 'Gelo / Glacial',
    colors: {
      border: 'rgba(6, 182, 212, 0.5)',
      borderGlow: 'rgba(6, 182, 212, 0.25)',
      bgGradient: 'radial-gradient(ellipse at top, #06233b 0%, #081220 55%, #040810 100%)',
      cardBg: '#0b1626',
      accent: '#06b6d4',
      accentHover: '#22d3ee',
      badgeBg: 'rgba(6, 182, 212, 0.2)',
      badgeText: '#38bdf8',
      radarBorder: '#06b6d4',
    },
  },
  classic: {
    id: 'classic',
    name: 'Clássico / The International',
    description: 'Ouro lendário da Égide e obsidiana de torneio competitivo (Dourado e Grafite)',
    tag: 'Dourado TI',
    colors: {
      border: 'rgba(234, 179, 8, 0.5)',
      borderGlow: 'rgba(234, 179, 8, 0.25)',
      bgGradient: 'radial-gradient(ellipse at top, #261f0a 0%, #0f1218 55%, #06070a 100%)',
      cardBg: '#12161f',
      accent: '#eab308',
      accentHover: '#facc15',
      badgeBg: 'rgba(234, 179, 8, 0.2)',
      badgeText: '#fde047',
      radarBorder: '#eab308',
    },
  },
  void: {
    id: 'void',
    name: 'Abissal / Void',
    description: 'Energia do vácuo astral, inspirado em Enigma e Void Spirit (Roxo e Violeta)',
    tag: 'Astral / Vácuo',
    colors: {
      border: 'rgba(168, 85, 247, 0.5)',
      borderGlow: 'rgba(168, 85, 247, 0.25)',
      bgGradient: 'radial-gradient(ellipse at top, #260c3d 0%, #0f0d1c 55%, #06060c 100%)',
      cardBg: '#141126',
      accent: '#a855f7',
      accentHover: '#c084fc',
      badgeBg: 'rgba(168, 85, 247, 0.2)',
      badgeText: '#d8b4fe',
      radarBorder: '#a855f7',
    },
  },
  radiant: {
    id: 'radiant',
    name: 'Esmeralda / Radiant',
    description: 'Vitalidade dos bosques do Radiant, inspirado em Treant e Windranger (Esmeralda)',
    tag: 'Natureza Radiant',
    colors: {
      border: 'rgba(16, 185, 129, 0.5)',
      borderGlow: 'rgba(16, 185, 129, 0.25)',
      bgGradient: 'radial-gradient(ellipse at top, #062b1b 0%, #091511 55%, #040907 100%)',
      cardBg: '#0c1a14',
      accent: '#10b981',
      accentHover: '#34d399',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      badgeText: '#6ee7b7',
      radarBorder: '#10b981',
    },
  },
};

/**
 * Applies dynamic CSS variables to :root / document.documentElement
 */
export function applyHudTheme(themeId: string): void {
  const theme = HUD_THEMES[themeId] || HUD_THEMES.incandescent;
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--hud-border', theme.colors.border);
  root.style.setProperty('--hud-border-glow', theme.colors.borderGlow);
  root.style.setProperty('--hud-bg-gradient', theme.colors.bgGradient);
  root.style.setProperty('--hud-card-bg', theme.colors.cardBg);
  root.style.setProperty('--hud-accent', theme.colors.accent);
  root.style.setProperty('--hud-accent-hover', theme.colors.accentHover);
  root.style.setProperty('--hud-badge-bg', theme.colors.badgeBg);
  root.style.setProperty('--hud-badge-text', theme.colors.badgeText);
  root.style.setProperty('--hud-radar-border', theme.colors.radarBorder);
}
