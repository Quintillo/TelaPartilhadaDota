import React, { useState, useEffect, useCallback } from 'react';
import { Header, AppTab } from './components/Header';
import { LiveScreenMonitor } from './components/LiveScreenMonitor';
import { LiveTacticalFeed, LiveCoachingCallout } from './components/LiveTacticalFeed';
import { LiveRadarMap, MinimapPing } from './components/LiveRadarMap';
import { LiveItemAdvisor, RecommendedItemData } from './components/LiveItemAdvisor';
import { SpawnsAndTimersAlert } from './components/SpawnsAndTimersAlert';
import { SmartBuildAdvisor } from './components/SmartBuildAdvisor';
import { HeroDatabaseModal } from './components/HeroDatabaseModal';
import { GlobalShortcutsModal } from './components/GlobalShortcutsModal';
import { CoachChatDrawer } from './components/CoachChatDrawer';
import { FloatingMiniCoach } from './components/FloatingMiniCoach';
import { ThemeSelector } from './components/ThemeSelector';
import { MatchInput } from './components/MatchInput';
import { Scoreboard } from './components/Scoreboard';
import { CoachPanel } from './components/CoachPanel';
import { ReportViewer } from './components/ReportViewer';
import { RecentHistory, SavedAnalysis } from './components/RecentHistory';
import { AboutSection } from './components/AboutSection';
import { cvEngine } from './utils/cvEngine';
import { DEMO_SCENARIOS, DemoScenario } from './data/dotaKnowledgeBase';
import { applyHudTheme, HUD_THEMES } from './data/hudThemes';
import {
  Monitor,
  Database,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
  Keyboard,
  MessageSquare,
  AlertCircle,
  X,
  Palette,
  CheckCircle2,
  Tv
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('live');

  // HUD Theme State
  const [currentThemeId, setCurrentThemeId] = useState<string>('incandescent');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Initialize theme from localStorage or default
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('dota_coach_hud_theme');
      if (savedTheme && HUD_THEMES[savedTheme]) {
        setCurrentThemeId(savedTheme);
        applyHudTheme(savedTheme);
      } else {
        applyHudTheme('incandescent');
      }
    } catch (_) {
      applyHudTheme('incandescent');
    }
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    applyHudTheme(themeId);
    try {
      localStorage.setItem('dota_coach_hud_theme', themeId);
    } catch (_) {}
    showToast(`Tema do HUD alterado para: ${HUD_THEMES[themeId]?.name || themeId}`);
  };

  // Modals & Drawers
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isFloatingMiniOpen, setIsFloatingMiniOpen] = useState<boolean>(false);

  // Shortcut Toast Overlay
  const [shortcutToast, setShortcutToast] = useState<{ message: string; visible: boolean } | null>(null);

  // --- Live Coach State ---
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [activeHeroId, setActiveHeroId] = useState<number>(8); // Juggernaut default
  const [activeHeroName, setActiveHeroName] = useState<string>('Juggernaut');
  const [playerRole, setPlayerRole] = useState<string>('Carry (Pos 1)');
  const [enemyHeroes, setEnemyHeroes] = useState<string[]>(DEMO_SCENARIOS[0].enemyHeroes);
  const [coachStyle, setCoachStyle] = useState<'pro' | 'aggressive' | 'didactic'>('pro');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [voiceRate, setVoiceRate] = useState<number>(1.1);
  const [autoAnalyze, setAutoAnalyze] = useState<boolean>(true);
  const [analysisIntervalSec, setAnalysisIntervalSec] = useState<number>(5);
  const [isAnalyzingFrame, setIsAnalyzingFrame] = useState<boolean>(false);
  const [isRealLiveCapturing, setIsRealLiveCapturing] = useState<boolean>(false);

  // Live Coaching Output from Gemini
  const [currentCallout, setCurrentCallout] = useState<LiveCoachingCallout | null>({
    id: 'initial_live_coach',
    timestamp: '00:00',
    voiceCallout: 'Treinador de IA pronto! Conecte sua tela do Dota 2 para começar o acompanhamento ao vivo.',
    urgency: 'SAFE',
    tacticalDirective: 'Clique no botão verde "Conectar Tela do Jogo ao Vivo" para compartilhar sua janela do Dota 2. A IA analisará seus movimentos, minimapa e inventário em tempo real.',
    enemyThreatSummary: 'Aguardando início da captura de tela ao vivo do jogador.',
    powerSpikeAlert: 'Priorize farm seguro nos primeiros minutos de jogo.',
  });

  const [calloutHistory, setCalloutHistory] = useState<LiveCoachingCallout[]>([]);
  const [radarPings, setRadarPings] = useState<MinimapPing[]>(DEMO_SCENARIOS[0].minimapPings);
  const [currentZone, setCurrentZone] = useState<string>('Rota / Base');
  const [recommendedZone, setRecommendedZone] = useState<string>('Rota Segura');
  const [safetyRating, setSafetyRating] = useState<number>(90);
  const [movementAdvice, setMovementAdvice] = useState<string>('Inicie o jogo sob a proteção da sua torre.');
  const [recommendedItem, setRecommendedItem] = useState<RecommendedItemData>(DEMO_SCENARIOS[0].recommendedItem);
  const [currentItems, setCurrentItems] = useState<string[]>(['Phase Boots', 'Magic Wand', 'Quelling Blade']);

  // --- Replay Analysis State ---
  const [currentMatchId, setCurrentMatchId] = useState<string>('');
  const [matchData, setMatchData] = useState<any>(null);
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<SavedAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedAnalysis[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dota_ai_coach_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveToHistory = (newAnalysis: SavedAnalysis) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (h) => !(h.matchId === newAnalysis.matchId && h.heroId === newAnalysis.heroId)
      );
      const updated = [newAnalysis, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('dota_ai_coach_history', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Toast feedback helper
  const showToast = useCallback((message: string) => {
    setShortcutToast({ message, visible: true });
    cvEngine.playAlertTone('ping');
    const timer = setTimeout(() => {
      setShortcutToast(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Speaks callouts whenever currentCallout changes
  const triggerVoiceCallout = useCallback(
    (text: string, urgencyLevel: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY' | 'SAFE' = 'WARNING') => {
      if (!voiceEnabled || !text) return;

      if (urgencyLevel === 'CRITICAL') {
        cvEngine.playAlertTone('critical');
      } else if (urgencyLevel === 'WARNING') {
        cvEngine.playAlertTone('warning');
      } else {
        cvEngine.playAlertTone('objective');
      }

      cvEngine.speakCallout(text, {
        enabled: voiceEnabled,
        rate: voiceRate,
        pitch: 1.0,
        lang: 'pt-BR',
      });
    },
    [voiceEnabled, voiceRate]
  );

  // Toggle voice with shortcut feedback
  const handleToggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      showToast(next ? 'Voz do Coach ATIVADA' : 'Voz do Coach SILENCIADA (Mudo)');
      if (next) {
        cvEngine.speakCallout('Voz ativada', { enabled: true, rate: 1.2, lang: 'pt-BR' });
      }
      return next;
    });
  }, [showToast]);

  // Toggle auto analyze with shortcut feedback
  const handleToggleAutoAnalyze = useCallback(() => {
    setAutoAnalyze((prev) => {
      const next = !prev;
      showToast(next ? 'Loop de Monitoramento RETOMADO' : 'Loop de Monitoramento PAUSADO');
      return next;
    });
  }, [showToast]);

  // Select demo scenario
  const handleSelectScenario = (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    setActiveHeroId(scenario.heroId);
    setActiveHeroName(scenario.heroName);
    setEnemyHeroes(scenario.enemyHeroes);
    setCurrentItems(scenario.currentItems);
    setRadarPings(scenario.minimapPings);
    setCurrentZone(scenario.mapNavigation.currentZone);
    setRecommendedZone(scenario.mapNavigation.recommendedZone);
    setSafetyRating(scenario.mapNavigation.safetyRating);
    setMovementAdvice(scenario.mapNavigation.movementAdvice);
    setRecommendedItem(scenario.recommendedItem);

    const newCallout: LiveCoachingCallout = {
      id: `callout_${Date.now()}`,
      timestamp: scenario.gameTime,
      voiceCallout: scenario.expectedCallout,
      urgency: scenario.urgency,
      tacticalDirective: scenario.expectedDirective,
    };
    setCurrentCallout(newCallout);
    setCalloutHistory((prev) => [newCallout, ...prev.slice(0, 15)]);

    triggerVoiceCallout(scenario.expectedCallout, scenario.urgency);
  };

  // Send Frame to Server (Gemini 3.8 Flash Vision)
  const handleFrameCaptured = useCallback(async (base64Frame: string, isRealLive: boolean) => {
    setIsAnalyzingFrame(true);
    try {
      const response = await fetch('/api/coach/analyze-live-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Frame,
          isRealLiveScreen: isRealLive,
          heroName: activeHeroName,
          heroId: activeHeroId,
          playerRole,
          enemyHeroes: enemyHeroes,
          alliedHeroes: selectedScenario.alliedHeroes,
          gameTime: selectedScenario.gameTime,
          currentItems,
          currentNetWorth: selectedScenario.currentNetWorth,
          coachStyle,
          language: 'pt-BR',
        }),
      });

      const result = await response.json();
      if (result && result.success && result.data) {
        const d = result.data;
        const now = new Date();
        const timeStr = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        const newCallout: LiveCoachingCallout = {
          id: `callout_${Date.now()}`,
          timestamp: timeStr,
          voiceCallout: d.voiceCallout || 'Continue farmando seguro e acompanhe os timers.',
          urgency: d.urgency || 'SAFE',
          tacticalDirective: d.tacticalDirective || '',
          enemyThreatSummary: d.enemyThreatSummary,
          powerSpikeAlert: d.powerSpikeAlert,
        };

        setCurrentCallout(newCallout);
        setCalloutHistory((prev) => [newCallout, ...prev.slice(0, 20)]);

        if (d.mapNavigation) {
          setCurrentZone(d.mapNavigation.currentZone);
          setRecommendedZone(d.mapNavigation.recommendedZone);
          setSafetyRating(d.mapNavigation.safetyRating ?? 75);
          setMovementAdvice(d.mapNavigation.movementAdvice ?? '');
        }

        if (Array.isArray(d.minimapPings) && d.minimapPings.length > 0) {
          setRadarPings(d.minimapPings);
        }

        if (d.recommendedItem) {
          setRecommendedItem(d.recommendedItem);
        }

        triggerVoiceCallout(newCallout.voiceCallout, newCallout.urgency);
      }
    } catch (err: any) {
      console.warn('Frame analysis error:', err.message);
    } finally {
      setIsAnalyzingFrame(false);
    }
  }, [activeHeroName, activeHeroId, playerRole, selectedScenario, currentItems, coachStyle, triggerVoiceCallout]);

  // Request instant callout
  const handleTriggerInstantCallout = useCallback(() => {
    showToast('Solicitando Análise Imediata da Tela...');
    const canvas = document.querySelector('canvas');
    if (canvas) {
      try {
        const base64 = canvas.toDataURL('image/jpeg', 0.82);
        handleFrameCaptured(base64, isRealLiveCapturing);
      } catch (_) {}
    }
  }, [handleFrameCaptured, isRealLiveCapturing, showToast]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (e.key === 'Escape') {
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (isChatOpen) setIsChatOpen(false);
        if (isThemeModalOpen) setIsThemeModalOpen(false);
        return;
      }

      if (isInput && !e.altKey && !e.ctrlKey) {
        return;
      }

      const keyUpper = e.key.toUpperCase();

      if (keyUpper === 'M' || (e.altKey && keyUpper === 'M')) {
        e.preventDefault();
        handleToggleVoice();
        return;
      }

      if (keyUpper === 'P' || (e.altKey && keyUpper === 'P')) {
        e.preventDefault();
        handleToggleAutoAnalyze();
        return;
      }

      if (keyUpper === 'C' || (e.altKey && keyUpper === 'C')) {
        e.preventDefault();
        handleTriggerInstantCallout();
        return;
      }

      if (keyUpper === 'Q' || (e.altKey && keyUpper === 'Q')) {
        e.preventDefault();
        setIsChatOpen((prev) => !prev);
        showToast('Chat do Coach IA Aberto');
        return;
      }

      if (keyUpper === 'O' || (e.altKey && keyUpper === 'O')) {
        e.preventDefault();
        setIsFloatingMiniOpen((prev) => {
          const next = !prev;
          showToast(next ? 'Modo Miniatura Flutuante ATIVADO' : 'Modo Miniatura Flutuante FECHADO');
          return next;
        });
        return;
      }

      if (keyUpper === 'H' || (e.altKey && keyUpper === 'H')) {
        e.preventDefault();
        setIsShortcutsOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isShortcutsOpen,
    isChatOpen,
    isFloatingMiniOpen,
    isThemeModalOpen,
    handleToggleVoice,
    handleToggleAutoAnalyze,
    handleTriggerInstantCallout,
    showToast,
  ]);

  // Replay Search Match
  const handleSearchMatch = async (matchId: string) => {
    setErrorMessage(null);
    setIsLoadingMatch(true);
    setCurrentMatchId(matchId);
    try {
      const response = await fetch(`/api/match/${matchId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar dados da partida');
      }
      setMatchData(data.match);
      if (data.match.players && data.match.players.length > 0) {
        setSelectedHeroId(data.match.players[0].hero_id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Partida não encontrada na OpenDota.');
    } finally {
      setIsLoadingMatch(false);
    }
  };

  const handleGenerateReport = async ({
    style,
    language,
  }: {
    style: 'pro' | 'constructive' | 'roast';
    language: string;
  }) => {
    if (!matchData || !selectedHeroId) {
      setErrorMessage('Selecione um herói no placar antes de gerar a análise.');
      return;
    }
    setErrorMessage(null);
    setIsGeneratingReport(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: matchData.match_id.toString(),
          heroId: selectedHeroId,
          style,
          language,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao gerar relatório de coaching');
      }
      const newAnalysis: SavedAnalysis = {
        matchId: data.matchId,
        heroId: data.heroId,
        playerWon: data.playerWon,
        duration: data.duration,
        kda: data.kda,
        kp: data.kp,
        gpm: data.gpm,
        xpm: data.xpm,
        netWorth: data.netWorth,
        performanceGrade: data.performanceGrade,
        executiveVerdict: data.executiveVerdict,
        radarSkills: data.radarSkills,
        tacticalMoments: data.tacticalMoments,
        report: data.report,
        generatedAt: data.generatedAt,
      };
      setCurrentAnalysis(newAnalysis);
      saveToHistory(newAnalysis);
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar com a IA Gemini.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Global In-Game Overlay Toast Notification for Keybindings */}
      {shortcutToast && (
        <div className="fixed top-20 right-6 z-50 pointer-events-none animate-fadeIn">
          <div className="px-4 py-2.5 rounded-xl bg-black/95 border hud-border text-amber-200 text-xs font-mono font-bold shadow-2xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>{shortcutToast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        isCapturingScreen={isRealLiveCapturing}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        isFloatingMini={isFloatingMiniOpen}
        onToggleFloatingMini={() => setIsFloatingMiniOpen((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {/* Error Alert */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 flex items-start justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-red-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 1: LIVE SCREEN COACH */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'live' && (
          <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
            {/* Quick Hero, Role, HUD Theme & Hotkey Bar */}
            <div className="hud-card border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-slate-400">Herói no Live Coach:</span>
                  <div className="flex items-center gap-2 bg-[#090c12] px-3 py-1.5 rounded-xl border border-slate-700">
                    <span className="text-sm font-bold text-amber-300">{activeHeroName}</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('database')}
                      className="text-[10px] uppercase font-bold text-cyan-400 hover:underline cursor-pointer"
                    >
                      (Trocar)
                    </button>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-slate-400">Função:</span>
                  <select
                    value={playerRole}
                    onChange={(e) => setPlayerRole(e.target.value)}
                    className="bg-[#090c12] border border-slate-700 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-200 focus:outline-none"
                  >
                    <option value="Carry (Pos 1)">Carry (Pos 1)</option>
                    <option value="Mid Laner (Pos 2)">Mid Laner (Pos 2)</option>
                    <option value="Offlaner (Pos 3)">Offlaner (Pos 3)</option>
                    <option value="Soft Support (Pos 4)">Soft Support (Pos 4)</option>
                    <option value="Hard Support (Pos 5)">Hard Support (Pos 5)</option>
                  </select>
                </div>
              </div>

              {/* HUD Theme Selector Pill & In-Game Hotkeys */}
              <div className="flex items-center gap-2 text-xs">
                {/* HUD Theme Trigger */}
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(!isThemeModalOpen)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold border border-slate-700/80 flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Alterar tema de HUD (Cores e Bordas dinâmicas)"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tema: <strong className="text-amber-300 capitalize">{HUD_THEMES[currentThemeId]?.name || currentThemeId}</strong></span>
                </button>

                {/* Hotkeys Ribbon */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-400">
                  <span>Atalhos:</span>
                  <span><kbd className="px-1 bg-slate-800 text-amber-300 rounded font-bold">M</kbd> Mudo</span>
                  <span><kbd className="px-1 bg-slate-800 text-amber-300 rounded font-bold">P</kbd> Pausar</span>
                  <span><kbd className="px-1 bg-slate-800 text-amber-300 rounded font-bold">C</kbd> Callout</span>
                  <span><kbd className="px-1 bg-slate-800 text-cyan-300 rounded font-bold">Q</kbd> Chat</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsShortcutsOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Configurar e ver atalhos"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Teclas</span>
                </button>
              </div>
            </div>

            {/* Expandable Theme Selection Bar */}
            {isThemeModalOpen && (
              <div className="hud-card border rounded-2xl p-5 shadow-2xl animate-fadeIn">
                <ThemeSelector
                  currentThemeId={currentThemeId}
                  onSelectTheme={handleSelectTheme}
                />
              </div>
            )}

            {/* Split Layout: Screen Monitor (Left 7 cols) + Live Tactical Intelligence (Right 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (7 cols): Live Screen & OpenCV Canvas */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <LiveScreenMonitor
                  onFrameCaptured={handleFrameCaptured}
                  isAnalyzing={isAnalyzingFrame}
                  latestCallout={currentCallout?.voiceCallout || ''}
                  urgency={currentCallout?.urgency || 'SAFE'}
                  selectedScenario={selectedScenario}
                  onSelectScenario={handleSelectScenario}
                  voiceEnabled={voiceEnabled}
                  onToggleVoice={handleToggleVoice}
                  analysisIntervalSec={analysisIntervalSec}
                  autoAnalyze={autoAnalyze}
                  onToggleAutoAnalyze={handleToggleAutoAnalyze}
                  isRealLiveCapturing={isRealLiveCapturing}
                  setIsRealLiveCapturing={setIsRealLiveCapturing}
                />

                {/* Objective Timers on bottom left */}
                <SpawnsAndTimersAlert
                  voiceEnabled={voiceEnabled}
                  onVoiceCallout={(t) => triggerVoiceCallout(t, 'WARNING')}
                />
              </div>

              {/* Right Column (5 cols): Live Callouts, Minimap Radar & Items */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Voice Callout & Tactical Directives */}
                <LiveTacticalFeed
                  currentCallout={currentCallout}
                  calloutHistory={calloutHistory}
                  voiceEnabled={voiceEnabled}
                  onReplayVoice={(text) => triggerVoiceCallout(text, currentCallout?.urgency || 'WARNING')}
                  heroName={activeHeroName}
                />

                {/* Minimap Tactical Radar */}
                <LiveRadarMap
                  pings={radarPings}
                  currentZone={currentZone}
                  recommendedZone={recommendedZone}
                  safetyRating={safetyRating}
                  movementAdvice={movementAdvice}
                  heroName={activeHeroName}
                />

                {/* Itemization Advisor */}
                <LiveItemAdvisor
                  currentItems={currentItems}
                  recommendedItem={recommendedItem}
                  heroName={activeHeroName}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: SMART COUNTER-BUILDS (Counter-Itemization Matrix) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'builds' && (
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <SmartBuildAdvisor
              currentHeroName={activeHeroName}
              enemyHeroes={enemyHeroes}
              onUpdateEnemyHeroes={setEnemyHeroes}
              voiceEnabled={voiceEnabled}
            />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: SPAWN TIMERS & CREEP STACK ALERTS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'spawns' && (
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <SpawnsAndTimersAlert
              voiceEnabled={voiceEnabled}
              onVoiceCallout={(t) => triggerVoiceCallout(t, 'WARNING')}
            />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: HERO DATABASE & COUNTERS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'database' && (
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <HeroDatabaseModal
              currentHeroId={activeHeroId}
              onSelectHero={(id, name) => {
                setActiveHeroId(id);
                setActiveHeroName(name);
                setActiveTab('live');
                triggerVoiceCallout(`Herói configurado para ${name}. O Live Coach analisará suas rotas e itens para esta partida.`, 'SAFE');
              }}
            />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: REPLAY ANALYSIS (Match ID from OpenDota) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'replay' && (
          <div className="space-y-6">
            <MatchInput
              onSearch={handleSearchMatch}
              onSelectPreset={(preset) => {
                handleSearchMatch(preset.id);
                setSelectedHeroId(preset.heroId);
              }}
              isLoading={isLoadingMatch}
              currentMatchId={currentMatchId}
            />

            <RecentHistory
              history={history}
              onSelect={(item) => {
                setCurrentAnalysis(item);
                setCurrentMatchId(item.matchId);
                setSelectedHeroId(item.heroId);
                if (!matchData || String(matchData.match_id) !== item.matchId) {
                  handleSearchMatch(item.matchId);
                }
              }}
              onClear={() => setHistory([])}
            />

            {matchData && (
              <>
                <Scoreboard
                  match={matchData}
                  selectedHeroId={selectedHeroId}
                  onSelectHero={(id) => setSelectedHeroId(id)}
                />
                <CoachPanel
                  selectedHeroId={selectedHeroId}
                  match={matchData}
                  onGenerateReport={handleGenerateReport}
                  isGenerating={isGeneratingReport}
                />
              </>
            )}

            {currentAnalysis && (
              <ReportViewer
                analysis={currentAnalysis}
                onReset={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
              />
            )}
          </div>
        )}

        {/* Global Shortcuts Modal */}
        <GlobalShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
          voiceEnabled={voiceEnabled}
          autoAnalyze={autoAnalyze}
          onToggleVoice={handleToggleVoice}
          onToggleAutoAnalyze={handleToggleAutoAnalyze}
          onTriggerInstantCallout={handleTriggerInstantCallout}
          onOpenChat={() => setIsChatOpen(true)}
          isFloatingMini={isFloatingMiniOpen}
          onToggleMini={() => setIsFloatingMiniOpen((prev) => !prev)}
        />

        {/* Conversational Coach Chat Drawer (AI + Google Search Grounding) */}
        <CoachChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          heroName={activeHeroName}
          playerRole={playerRole}
          voiceEnabled={voiceEnabled}
        />

        {/* Floating Mini Coach HUD Overlay (Picture-in-Picture / Over-Game Mode) */}
        <FloatingMiniCoach
          isOpen={isFloatingMiniOpen}
          onClose={() => setIsFloatingMiniOpen(false)}
          currentCallout={currentCallout}
          recommendedItem={recommendedItem}
          heroName={activeHeroName}
          isCapturingScreen={isRealLiveCapturing}
          voiceEnabled={voiceEnabled}
          onToggleVoice={handleToggleVoice}
          onTriggerInstantCallout={handleTriggerInstantCallout}
          isAnalyzing={isAnalyzingFrame}
          safetyRating={safetyRating}
        />

        {/* Architecture & AI Engine Specs */}
        <AboutSection />
      </main>
    </div>
  );
}
