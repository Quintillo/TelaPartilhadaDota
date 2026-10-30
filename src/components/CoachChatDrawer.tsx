import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Globe,
  Bot,
  User,
  Volume2,
  VolumeX,
  ExternalLink,
  X,
  RefreshCw,
  Search,
  Zap,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cvEngine } from '../utils/cvEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  audioSummary?: string;
  sources?: { title: string; url: string }[];
  webSearchQueries?: string[];
  timestamp: string;
}

interface CoachChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  heroName: string;
  playerRole: string;
  voiceEnabled: boolean;
}

export const CoachChatDrawer: React.FC<CoachChatDrawerProps> = ({
  isOpen,
  onClose,
  heroName,
  playerRole,
  voiceEnabled,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Olá! Sou seu **Treinador de IA Oficial**. Estou acompanhando seu jogo como **${heroName}** (${playerRole}).\n\nVocê pode me fazer qualquer pergunta sobre **itens ideais**, **rotas**, **mecânicas de matchup**, ou sobre o **patch atual de Dota 2**. Minha busca na internet está ativada para consultar builds do Dota2ProTracker e estratégias do meta!`,
      audioSummary: `Olá! Sou seu treinador de Dota 2. Como posso ajudar com seu ${heroName}?`,
      timestamp: 'Agora',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enableWebSearch, setEnableWebSearch] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    `Qual o melhor item contra BKB do carry inimigo no patch atual?`,
    `Como jogar a rota do ${heroName} contra heróis com muito stun?`,
    `Qual a build de ${heroName} mais usada no Dota2ProTracker agora?`,
    `Quando devo comprar Nullifier versus Silver Edge?`,
    `Como contestar o Tormentor aos 20 minutos com segurança?`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          heroContext: heroName,
          playerRole,
          conversationHistory: messages.map((m) => ({ role: m.role, text: m.text })),
          enableWebSearch,
          language: 'pt-BR',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro na resposta da IA.');
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: data.text,
        audioSummary: data.audioSummary,
        sources: data.sources || [],
        webSearchQueries: data.webSearchQueries || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // If voice enabled, speak the audio summary
      if (voiceEnabled && botMsg.audioSummary) {
        cvEngine.speakCallout(botMsg.audioSummary, {
          enabled: true,
          rate: 1.1,
          lang: 'pt-BR',
        });
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'model',
        text: `Ocorreu um erro ao consultar o Coach: ${err.message}. Tente novamente em instantes.`,
        timestamp: 'Agora',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVoice = (text: string) => {
    cvEngine.speakCallout(text, {
      enabled: true,
      rate: 1.1,
      lang: 'pt-BR',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl h-full bg-[#0d121c] border-l border-amber-500/40 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-gradient-to-r from-[#141a29] to-[#0a0d14] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Cinzel',serif] text-base font-bold text-slate-100">
                  Conversar com o Coach de IA
                </h3>
                <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Herói: <strong className="text-amber-300">{heroName}</strong> ({playerRole})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Web Search Grounding Toggle */}
            <button
              type="button"
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                enableWebSearch
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
              title="Pesquisar patch e meta no Google Search"
            >
              <Globe className={`w-3.5 h-3.5 ${enableWebSearch ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Busca Web: {enableWebSearch ? 'Ativa' : 'Desligada'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 md:p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium'
                    : 'bg-[#121824] border border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px] text-slate-400 font-mono">
                  <span>{msg.role === 'user' ? 'Você' : 'Coach IA'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-strong:text-amber-300">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {/* Google Search Grounding Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1 mb-1.5">
                      <Globe className="w-3 h-3" /> Fontes Pesquisadas na Internet:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.slice(0, 4).map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[10px] text-slate-300 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                        >
                          <span className="truncate max-w-[140px]">{source.title || 'Referência Web'}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio Readout Button */}
                {msg.role === 'model' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 italic">
                      {msg.audioSummary ? `Voz: "${msg.audioSummary}"` : 'Ouvir resposta'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayVoice(msg.audioSummary || msg.text)}
                      className="p-1 rounded text-slate-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                      title="Ouvir no headset"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Ouvir</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#121824] border border-slate-800 text-xs text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Coach pesquisando no meta e formulando resposta...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#090c12] border-t border-slate-800/80 overflow-x-auto flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Dúvidas Frequentes:
          </span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-[10px] text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t border-slate-800 bg-[#0a0d14] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Pergunte ao Coach sobre itens, rotas ou counters para ${heroName}...`}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
