import React, { useState, useRef, useEffect } from 'react';
import {
  Move,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  Radio,
  Sliders,
  X,
  Zap,
  Compass,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Eye,
  Tv
} from 'lucide-react';
import { LiveCoachingCallout } from './LiveTacticalFeed';
import { RecommendedItemData } from './LiveItemAdvisor';

interface FloatingMiniCoachProps {
  isOpen: boolean;
  onClose: () => void;
  currentCallout: LiveCoachingCallout | null;
  recommendedItem: RecommendedItemData | null;
  heroName: string;
  isCapturingScreen: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onTriggerInstantCallout: () => void;
  isAnalyzing: boolean;
  safetyRating: number;
}

export const FloatingMiniCoach: React.FC<FloatingMiniCoachProps> = ({
  isOpen,
  onClose,
  currentCallout,
  recommendedItem,
  heroName,
  isCapturingScreen,
  voiceEnabled,
  onToggleVoice,
  onTriggerInstantCallout,
  isAnalyzing,
  safetyRating,
}) => {
  // Floating Window Coordinates & Size
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 24, y: 80 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0.88); // 0.3 to 1.0
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isNativePipSupported, setIsNativePipSupported] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check Document Picture-in-Picture API support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'documentPictureInPicture' in window) {
      setIsNativePipSupported(true);
    }
  }, []);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag when clicking the drag handle or header
    if ((e.target as HTMLElement).closest('button, input, select')) return;

    setIsDragging(true);
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 380, e.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 150, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Preset Safe Positions for Dota 2 HUD
  const applyDotaPresetPosition = (preset: 'top-right' | 'top-left' | 'center-right') => {
    if (preset === 'top-right') {
      setPosition({ x: window.innerWidth - 410, y: 20 });
    } else if (preset === 'top-left') {
      setPosition({ x: 20, y: 20 });
    } else {
      setPosition({ x: window.innerWidth - 410, y: window.innerHeight / 2 - 120 });
    }
  };

  // Launch Native OS Document Picture-in-Picture window if supported
  const openNativePictureInPicture = async () => {
    if ('documentPictureInPicture' in window) {
      try {
        const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
          width: 380,
          height: 260,
        });

        // Copy styles
        document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
          pipWindow.document.head.appendChild(node.cloneNode(true));
        });

        // Set body styling
        pipWindow.document.body.className = 'bg-[#0a0d14] text-slate-100 p-3 select-none';
        pipWindow.document.body.innerHTML = `
          <div style="font-family: sans-serif; font-size: 13px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px;">
              <span style="font-weight:bold; color:#f59e0b;">DOTA AI COACH (PIP)</span>
              <span style="font-size:10px; background:#ef444430; color:#f87171; padding:2px 6px; border-radius:4px; font-weight:bold;">${currentCallout?.urgency || 'AO VIVO'}</span>
            </div>
            <p style="font-weight:bold; font-size:14px; color:#fef08a; margin: 6px 0;">"${currentCallout?.voiceCallout || 'Monitorando o jogo ao vivo...'}"</p>
            <p style="font-size:11px; color:#94a3b8; line-height:1.4;">${currentCallout?.tacticalDirective || ''}</p>
          </div>
        `;
      } catch (err: any) {
        console.warn('Document Picture-in-Picture not available:', err.message);
      }
    }
  };

  if (!isOpen) return null;

  const urgencyStyles = {
    CRITICAL: {
      bg: 'bg-red-950/90 border-red-500 text-red-200',
      badge: 'bg-red-500 text-black font-black animate-pulse',
      label: 'PERIGO',
    },
    WARNING: {
      bg: 'bg-amber-950/90 border-amber-500 text-amber-200',
      badge: 'bg-amber-500 text-black font-black',
      label: 'ATENÇÃO',
    },
    OPPORTUNITY: {
      bg: 'bg-emerald-950/90 border-emerald-500 text-emerald-200',
      badge: 'bg-emerald-400 text-black font-black',
      label: 'PICO DE LUTA',
    },
    SAFE: {
      bg: 'bg-slate-900/90 border-slate-700 text-slate-200',
      badge: 'bg-slate-700 text-white font-bold',
      label: 'SEGURO',
    },
  };

  const urgency = currentCallout?.urgency || 'SAFE';
  const uStyle = urgencyStyles[urgency];

  return (
    <div
      ref={containerRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity,
      }}
      className={`fixed z-[9999] transition-opacity duration-150 rounded-2xl border-2 hud-border shadow-2xl backdrop-blur-md overflow-hidden select-none ${
        isCollapsed ? 'w-80' : 'w-96'
      }`}
    >
      {/* Draggable Header */}
      <div
        onMouseDown={handleMouseDown}
        className={`px-3.5 py-2.5 flex items-center justify-between gap-2 border-b border-slate-800/80 cursor-grab active:cursor-grabbing bg-gradient-to-r from-black/90 via-[#101420]/95 to-black/90`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Move className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] font-bold font-['Cinzel',serif] text-slate-100 truncate">
            COACH PIP ({heroName})
          </span>
          <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${uStyle.badge}`}>
            {uStyle.label}
          </span>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Voice Mute */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              voiceEnabled ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Mudo / Ativar Voz (M)"
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Trigger Snapshot */}
          <button
            type="button"
            onClick={onTriggerInstantCallout}
            disabled={isAnalyzing}
            className="p-1 rounded text-amber-400 hover:text-amber-300 cursor-pointer transition-colors"
            title="Pedir Callout Agora (C)"
          >
            {isAnalyzing ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Picture in Picture Window button if supported */}
          {isNativePipSupported && (
            <button
              type="button"
              onClick={openNativePictureInPicture}
              className="p-1 rounded text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
              title="Abrir como Janela Flutuante do Windows (Sobre o jogo)"
            >
              <Tv className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Collapse/Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            title={isCollapsed ? 'Expandir' : 'Recolher'}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Maximize Back to Normal Mode */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            title="Voltar ao modo completo"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Mini Coach Body */}
      <div className="p-3.5 bg-black/85 flex flex-col gap-2.5">
        {/* Main Voice Callout Speech Bubble */}
        <div className={`p-2.5 rounded-xl border ${uStyle.bg} shadow-md`}>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Radio className={`w-2.5 h-2.5 ${isCapturingScreen ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
              <span>{isCapturingScreen ? 'AO VIVO NA TELA' : 'CALLOUT IA'}</span>
            </span>
            <span className="font-bold text-amber-300">
              Segurança: {safetyRating}%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-100 leading-snug italic">
            "{currentCallout?.voiceCallout || 'Coach monitorando sua tela ao vivo...'}"
          </p>
        </div>

        {/* Compact Directive when expanded */}
        {!isCollapsed && currentCallout?.tacticalDirective && (
          <div className="p-2 rounded-lg bg-[#090c12]/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            <strong className="text-cyan-400 block mb-0.5">Diretriz:</strong>
            {currentCallout.tacticalDirective}
          </div>
        )}

        {/* Quick Item Counter Target */}
        {!isCollapsed && recommendedItem && (
          <div className="px-2.5 py-1.5 rounded-lg bg-[#0e131d] border border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">
              Counter Item: <strong className="text-amber-300">{recommendedItem.name}</strong>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {recommendedItem.cost}g ({recommendedItem.currentProgress}%)
            </span>
          </div>
        )}

        {/* Live Spawns Quick Bar (Runes, Lotus, Stack :53) */}
        {!isCollapsed && (
          <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono text-center">
            <div className="p-1 rounded bg-[#090c12] border border-slate-800/80">
              <span className="text-slate-500 block">RUNAS (RIO)</span>
              <strong className="text-amber-400">A CADA 2M</strong>
            </div>
            <div className="p-1 rounded bg-[#090c12] border border-slate-800/80">
              <span className="text-slate-500 block">LÓTUS</span>
              <strong className="text-cyan-400">A CADA 3M</strong>
            </div>
            <div className="p-1 rounded bg-[#090c12] border border-slate-800/80">
              <span className="text-slate-500 block">STACK</span>
              <strong className="text-emerald-400">AOS :53S</strong>
            </div>
          </div>
        )}

        {/* Bottom Control Bar: Opacity & Dota Position Presets */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400">
          {/* Opacity Slider */}
          <div className="flex items-center gap-1.5">
            <span>Opacidade:</span>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-16 h-1 accent-amber-500 cursor-pointer"
              title="Ajustar transparência para não cobrir o jogo"
            />
            <span className="font-mono text-[9px] text-slate-300">{Math.round(opacity * 100)}%</span>
          </div>

          {/* Quick HUD Presets */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-slate-500 hidden sm:inline">Posicionar:</span>
            <button
              type="button"
              onClick={() => applyDotaPresetPosition('top-right')}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[9px] cursor-pointer"
              title="Posicionar no canto superior direito (livre de minimapa e inventário)"
            >
              Sup. Dir
            </button>
            <button
              type="button"
              onClick={() => applyDotaPresetPosition('center-right')}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[9px] cursor-pointer"
              title="Posicionar na lateral direita"
            >
              Meio Dir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
