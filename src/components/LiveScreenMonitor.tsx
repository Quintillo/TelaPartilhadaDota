import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Monitor,
  Video,
  Play,
  Square,
  Sparkles,
  Camera,
  Layers,
  Eye,
  Activity,
  AlertTriangle,
  Volume2,
  VolumeX,
  Maximize2,
  RefreshCw,
  Compass,
  CheckCircle2,
  Radio,
  Tv,
  HelpCircle
} from 'lucide-react';
import { cvEngine, VisionFilter } from '../utils/cvEngine';
import { DEMO_SCENARIOS, DemoScenario } from '../data/dotaKnowledgeBase';

interface LiveScreenMonitorProps {
  onFrameCaptured: (base64Frame: string, isRealLive: boolean) => void;
  isAnalyzing: boolean;
  latestCallout: string;
  urgency: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY' | 'SAFE';
  selectedScenario: DemoScenario;
  onSelectScenario: (scenario: DemoScenario) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  analysisIntervalSec: number;
  autoAnalyze: boolean;
  onToggleAutoAnalyze: () => void;
  isRealLiveCapturing: boolean;
  setIsRealLiveCapturing: (val: boolean) => void;
}

export const LiveScreenMonitor: React.FC<LiveScreenMonitorProps> = ({
  onFrameCaptured,
  isAnalyzing,
  latestCallout,
  urgency,
  selectedScenario,
  onSelectScenario,
  voiceEnabled,
  onToggleVoice,
  analysisIntervalSec,
  autoAnalyze,
  onToggleAutoAnalyze,
  isRealLiveCapturing,
  setIsRealLiveCapturing,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [streamSource, setStreamSource] = useState<'standby' | 'screen' | 'demo'>('standby');
  const [visionFilter, setVisionFilter] = useState<VisionFilter>('normal');
  const [showHudBoxes, setShowHudBoxes] = useState<boolean>(true);
  const [motionActivity, setMotionActivity] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);
  const [lastAnalysisCountdown, setLastAnalysisCountdown] = useState<number>(analysisIntervalSec);
  const [captureNotice, setCaptureNotice] = useState<string | null>(null);

  // Setup offscreen canvas simulation for Demo Scenarios when user explicitly tests a scenario
  useEffect(() => {
    if (streamSource === 'demo') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = selectedScenario.sampleImageUrl;
      img.onload = () => {
        canvas.width = 1280;
        canvas.height = 720;
        ctx.drawImage(img, 0, 0, 1280, 720);

        if (showHudBoxes) {
          const regions = cvEngine.getHudRegions(1280, 720);
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(regions.minimap.x, regions.minimap.y, regions.minimap.width, regions.minimap.height);
          ctx.fillStyle = '#06b6d4';
          ctx.font = 'bold 13px "JetBrains Mono", monospace';
          ctx.fillText('ROI 1: MINIMAP & TRACKING', regions.minimap.x + 8, regions.minimap.y + 20);

          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(regions.topClock.x, regions.topClock.y, regions.topClock.width, regions.topClock.height);
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('ROI 2: GAME CLOCK / SCORE', regions.topClock.x + 8, regions.topClock.y + 20);

          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(regions.heroHud.x, regions.heroHud.y, regions.heroHud.width, regions.heroHud.height);
          ctx.fillStyle = '#10b981';
          ctx.fillText('ROI 3: HP/MANA & INVENTÁRIO', regions.heroHud.x + 8, regions.heroHud.y + 20);
        }
      };
    }
  }, [selectedScenario, streamSource, showHudBoxes]);

  // Screen Capture using getDisplayMedia
  const startScreenCapture = async () => {
    try {
      setCaptureNotice(null);
      const stream = await cvEngine.requestScreenStream();
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsRealLiveCapturing(true);
      setStreamSource('screen');

      // Welcoming message spoken like a real human coach sitting next to you
      cvEngine.speakCallout('Treinador conectado! Estou de olho na sua partida de Dota 2 ao vivo. Boa sorte!', {
        enabled: voiceEnabled,
        rate: 1.15,
        lang: 'pt-BR',
      });

      // Listen for when user stops screen share from native browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopScreenCapture();
      };

      // Trigger initial real live frame capture after short delay
      setTimeout(() => {
        triggerInstantCapture(true);
      }, 1500);
    } catch (err: any) {
      console.warn('Screen capture cancelled or error:', err.message);
      if (err.name === 'NotAllowedError') {
        setCaptureNotice('Permissão de captura de tela cancelada. Quando estiver pronto com o Dota 2 aberto, clique novamente em "Conectar Tela do Jogo ao Vivo".');
      } else {
        setCaptureNotice(`Aviso de captura: ${err.message || 'Verifique as permissões de vídeo do seu navegador.'}`);
      }
    }
  };

  const stopScreenCapture = () => {
    cvEngine.stopSpeaking();
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsRealLiveCapturing(false);
    setStreamSource('standby');
    setMotionActivity(0);
    setFps(0);
  };

  const lastTelemetryUpdateRef = useRef<number>(0);
  const countdownRef = useRef<number>(analysisIntervalSec);

  // Keep countdownRef in sync with prop changes
  useEffect(() => {
    countdownRef.current = analysisIntervalSec;
    setLastAnalysisCountdown(analysisIntervalSec);
  }, [analysisIntervalSec]);

  // Continuous loop rendering screen or video to canvas
  const renderFrameLoop = useCallback(() => {
    if (streamSource === 'screen' && videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (canvas.width !== 1280) canvas.width = 1280;
      if (canvas.height !== 720) canvas.height = 720;

      const { motionScore } = cvEngine.processFrame(video, canvas, visionFilter, showHudBoxes);
      const now = performance.now();
      if (now - lastTelemetryUpdateRef.current > 600) {
        lastTelemetryUpdateRef.current = now;
        setMotionActivity(motionScore);
        setFps(30);
      }
    }
    animationFrameRef.current = requestAnimationFrame(renderFrameLoop);
  }, [streamSource, visionFilter, showHudBoxes]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(renderFrameLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderFrameLoop]);

  // Periodic Auto-Analysis Interval Timer:
  // CRITICAL: ONLY runs when the player is actively sharing their live Dota 2 screen!
  // No loops, no countdowns, and no speech when screen is not shared.
  useEffect(() => {
    if (!isRealLiveCapturing || !autoAnalyze) {
      countdownRef.current = analysisIntervalSec;
      setLastAnalysisCountdown(analysisIntervalSec);
      return;
    }

    countdownRef.current = analysisIntervalSec;
    setLastAnalysisCountdown(analysisIntervalSec);

    const timer = setInterval(() => {
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        countdownRef.current = analysisIntervalSec;
        setLastAnalysisCountdown(analysisIntervalSec);
        triggerInstantCapture(true);
      } else {
        setLastAnalysisCountdown(countdownRef.current);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRealLiveCapturing, autoAnalyze, analysisIntervalSec]);

  // Trigger snapshot and send to Gemini Vision Coach
  const triggerInstantCapture = (isRealLive?: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let base64 = '';
    try {
      base64 = canvas.toDataURL('image/jpeg', 0.82);
    } catch (e) {
      console.warn('Canvas export error:', e);
    }
    onFrameCaptured(base64, Boolean(isRealLive ?? (streamSource === 'screen')));
  };

  // Urgency Color Configs
  const urgencyStyles = {
    CRITICAL: {
      bg: 'bg-red-950/85 border-red-500 text-red-100',
      badge: 'bg-red-500 text-black font-black animate-pulse',
      label: 'PERIGO IMINENTE AO VIVO',
    },
    WARNING: {
      bg: 'bg-amber-950/85 border-amber-500 text-amber-100',
      badge: 'bg-amber-500 text-black font-black',
      label: 'ATENÇÃO TÁTICA AO VIVO',
    },
    OPPORTUNITY: {
      bg: 'bg-emerald-950/85 border-emerald-500 text-emerald-100',
      badge: 'bg-emerald-400 text-black font-black',
      label: 'OPORTUNIDADE AO VIVO',
    },
    SAFE: {
      bg: 'bg-slate-900/85 border-slate-700 text-slate-100',
      badge: 'bg-slate-600 text-white font-bold',
      label: 'FARMING SEGURO',
    },
  };

  const currentUrgencyStyle = urgencyStyles[urgency] || urgencyStyles.SAFE;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Banner Live Monitor Controls */}
      <div className="hud-card rounded-2xl p-4 shadow-xl border flex flex-wrap items-center justify-between gap-3">
        {/* Stream Source Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isRealLiveCapturing) {
                stopScreenCapture();
              } else {
                startScreenCapture();
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all shadow-lg ${
              isRealLiveCapturing
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 animate-pulse'
                : 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-900/30'
            }`}
          >
            {isRealLiveCapturing ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Parar Partilha de Tela</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4 animate-pulse text-white" />
                <span>Conectar Tela do Jogo ao Vivo (Dota 2)</span>
              </>
            )}
          </button>

          {/* Trigger Snapshot Button */}
          <button
            type="button"
            onClick={() => triggerInstantCapture(isRealLiveCapturing)}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black cursor-pointer transition-all disabled:opacity-50 shadow-md shadow-amber-900/30"
            title="Analisar a tela agora com a IA"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Analisando Frame...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analisar Agora (C)</span>
              </>
            )}
          </button>
        </div>

        {/* Live Audio & Auto-Loop Switches */}
        <div className="flex items-center gap-2 text-xs">
          {/* Auto Loop Toggle */}
          <button
            type="button"
            onClick={onToggleAutoAnalyze}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
              autoAnalyze && isRealLiveCapturing
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Análise contínua da tela (Tecla P) — Ativa apenas com tela compartilhada"
          >
            <Radio className={`w-3.5 h-3.5 ${autoAnalyze && isRealLiveCapturing ? 'text-amber-400 animate-pulse' : ''}`} />
            <span>
              {isRealLiveCapturing
                ? `Loop Ativo (${lastAnalysisCountdown}s)`
                : 'Loop: Aguardando Tela'}
            </span>
          </button>

          {/* Voice Coach Sound Toggle */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
              voiceEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Ativar/Desativar narração em voz alta pelo Coach (Tecla M)"
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voz: Ligada</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>Voz: Mudo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real Live Screen Streaming Indicator */}
      {isRealLiveCapturing && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-between text-xs text-red-200 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <strong className="text-white uppercase font-bold tracking-wider">
              Monitorando sua Tela ao Vivo em Tempo Real
            </strong>
            <span className="hidden md:inline text-red-300">
              — A IA está assistindo suas ações, minimapa e inventário durante a partida.
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-300 bg-black/60 px-2 py-0.5 rounded">
            Loop ativo: a cada {analysisIntervalSec}s
          </span>
        </div>
      )}

      {/* Screen Capture Notice or Error */}
      {captureNotice && (
        <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-between text-xs text-amber-200 shadow-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{captureNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setCaptureNotice(null)}
            className="text-amber-400 hover:text-amber-200 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Video / Screen Canvas Frame Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 hud-border shadow-2xl bg-[#07090e] group select-none">
        {/* Hidden video element receiving getDisplayMedia stream */}
        <video
          ref={videoRef}
          className="hidden"
          playsInline
          muted
        />

        {/* The Live Render Canvas with OpenCV / Vision overlay */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain block ${streamSource === 'standby' ? 'opacity-10' : 'opacity-100'}`}
        />

        {/* Live Standby Screen Prompt when not sharing yet */}
        {streamSource === 'standby' && !isRealLiveCapturing && (
          <div className="absolute inset-0 bg-[#07090e]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="relative mb-3">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-2xl">
                <Monitor className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono text-emerald-400 mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>TREINADOR EM ESPERA (SILENCIOSO)</span>
            </div>

            <h3 className="text-lg md:text-2xl font-black font-['Cinzel',serif] text-white tracking-wide">
              Pronto para Assistir sua Partida de Dota 2
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-lg mt-1.5 leading-relaxed">
              O Treinador só fala quando a tela do jogo estiver conectada. A IA assistirá seus movimentos, minimapa e inventário, dando callouts táticos como um amigo experiente ao seu lado.
            </p>

            {/* Main Action Button */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startScreenCapture}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs md:text-sm font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black shadow-xl shadow-emerald-950/60 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Radio className="w-4 h-4 text-black animate-pulse" />
                <span>INICIAR TREINADOR (COMPARTILHAR JANELA DO DOTA 2)</span>
              </button>
            </div>

            {/* Quick 3-Step Guide */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl text-left w-full">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-0.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-black">1</span>
                  Abra o Dota 2
                </div>
                <div className="text-slate-400 text-[10px] leading-tight">
                  No modo Janela Sem Bordas (Borderless Windowed).
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-0.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black">2</span>
                  Conecte a Tela
                </div>
                <div className="text-slate-400 text-[10px] leading-tight">
                  Clique no botão verde acima e escolha a janela.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-0.5">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black">3</span>
                  Receba Dicas
                </div>
                <div className="text-slate-400 text-[10px] leading-tight">
                  O Coach falará alertas de gank, runas e builds!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode Notice Banner inside frame */}
        {streamSource === 'demo' && !isRealLiveCapturing && (
          <div className="absolute top-16 left-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 backdrop-blur-md z-25 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <Camera className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Modo Demonstração (Frame Simulado):</strong> Teste pontual estático. Loop de voz automático desativado.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStreamSource('standby')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[10px] cursor-pointer"
            >
              Voltar ao Modo ao Vivo
            </button>
          </div>
        )}

        {/* Floating Urgency Coach Alert Bar at Top */}
        <div
          className={`absolute top-3 left-3 right-3 p-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 z-30 flex items-center justify-between gap-3 ${currentUrgencyStyle.bg}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0 ${currentUrgencyStyle.badge}`}>
              {isRealLiveCapturing ? currentUrgencyStyle.label : 'EM ESPERA'}
            </span>
            <p className="text-xs md:text-sm font-bold truncate">
              "{isRealLiveCapturing ? (latestCallout || 'Coach monitorando sua tela ao vivo...') : 'Treinador pronto em espera. Conecte sua tela do Dota 2.'}"
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isAnalyzing && (
              <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> IA Analisando Tela...
              </span>
            )}
          </div>
        </div>

        {/* Floating Live Telemetry Badge (Bottom-Right) */}
        {isRealLiveCapturing && (
          <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-3 text-[11px] font-mono text-slate-300 z-20">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>TELA AO VIVO</span>
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center gap-1 text-cyan-300">
              <Activity className="w-3.5 h-3.5" />
              <span>Atividade: {motionActivity}%</span>
            </div>
          </div>
        )}

        {/* Floating Vision Filter Switcher (Bottom-Left) */}
        {isRealLiveCapturing && (
          <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md border border-slate-800 p-1 rounded-xl flex items-center gap-1 z-20 text-[11px]">
            <span className="px-2 text-slate-400 font-semibold flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> OpenCV:
            </span>
            <button
              type="button"
              onClick={() => setVisionFilter('normal')}
              className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                visionFilter === 'normal'
                  ? 'bg-cyan-500 text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setVisionFilter('edges')}
              className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                visionFilter === 'edges'
                  ? 'bg-cyan-500 text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bordas
            </button>
            <button
              type="button"
              onClick={() => setVisionFilter('color_mask')}
              className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                visionFilter === 'color_mask'
                  ? 'bg-cyan-500 text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cores
            </button>
            <button
              type="button"
              onClick={() => setShowHudBoxes(!showHudBoxes)}
              className={`px-2 py-1 rounded-lg font-bold cursor-pointer border transition-colors ${
                showHudBoxes
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'border-slate-800 text-slate-500'
              }`}
              title="Caixas de detecção de HUD (Minimap, HP/Mana, Relógio)"
            >
              ROIs
            </button>
          </div>
        )}
      </div>

      {/* Demo Gameplay Scenarios (For Quick Tests without Dota 2 open) */}
      <div className="hud-card border rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            Cenários de Teste (Simular Frame sem abrir o Dota 2):
          </span>
          <span className="text-[11px] text-slate-400">
            {isRealLiveCapturing ? 'Captura de tela real ativa' : 'Clique para carregar e testar um frame estático'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {DEMO_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenario.id === scenario.id && streamSource === 'demo' && !isRealLiveCapturing;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  stopScreenCapture();
                  setStreamSource('demo');
                  onSelectScenario(scenario);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-[#0a0d14] border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {scenario.title}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        scenario.urgency === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400'
                          : scenario.urgency === 'OPPORTUNITY'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {scenario.gameTime}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {scenario.description}
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Herói: <strong className="text-amber-300">{scenario.heroName}</strong></span>
                  <span className="text-cyan-400">Testar Cenário →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
