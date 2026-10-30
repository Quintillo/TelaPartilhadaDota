import React from 'react';
import { getHero, getHeroImageUrl, getItemImageUrl } from '../data/dotaConstants';
import { Crown, Sparkles, Swords, Shield, Target } from 'lucide-react';

interface ScoreboardProps {
  match: any;
  selectedHeroId: number | null;
  onSelectHero: (heroId: number) => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  match,
  selectedHeroId,
  onSelectHero,
}) => {
  if (!match || !match.players) return null;

  const radiantWin = Boolean(match.radiant_win);
  const durationMins = Math.floor((match.duration || 0) / 60);
  const durationSecs = (match.duration || 0) % 60;
  const formattedDuration = `${durationMins}:${durationSecs < 10 ? '0' : ''}${durationSecs}`;

  const radiantPlayers = match.players.filter((p: any) => p.player_slot < 128);
  const direPlayers = match.players.filter((p: any) => p.player_slot >= 128);

  const radiantScore = match.radiant_score ?? radiantPlayers.reduce((acc: number, p: any) => acc + (p.kills || 0), 0);
  const direScore = match.dire_score ?? direPlayers.reduce((acc: number, p: any) => acc + (p.kills || 0), 0);

  const renderPlayerRow = (player: any, isRadiant: boolean) => {
    const hero = getHero(player.hero_id);
    const isSelected = selectedHeroId === player.hero_id;
    const items = [
      player.item_0, player.item_1, player.item_2,
      player.item_3, player.item_4, player.item_5,
    ];
    const neutralItem = player.item_neutral;

    return (
      <tr
        key={player.player_slot}
        onClick={() => onSelectHero(player.hero_id)}
        className={`group transition-colors cursor-pointer border-b border-slate-800/40 ${
          isSelected
            ? 'bg-amber-500/15 border-l-4 border-l-amber-400'
            : 'hover:bg-slate-800/50'
        }`}
      >
        {/* Hero & Player */}
        <td className="py-2.5 px-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-7 rounded overflow-hidden shadow border border-slate-700 group-hover:border-amber-400/60 transition-colors shrink-0">
              <img
                src={getHeroImageUrl(player.hero_id)}
                alt={hero.localized_name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png';
                }}
              />
              <span className="absolute bottom-0 right-0 bg-black/80 px-1 text-[9px] font-bold text-amber-300 font-mono">
                {player.level || ''}
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-100 truncate group-hover:text-amber-200">
                  {hero.localized_name}
                </span>
                {isSelected && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-amber-500 text-black tracking-tight flex items-center gap-0.5">
                    <Target className="w-2.5 h-2.5" /> Foco IA
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 truncate max-w-[120px] font-mono">
                {player.personaname || `Slot ${player.player_slot}`}
              </span>
            </div>
          </div>
        </td>

        {/* K / D / A */}
        <td className="py-2.5 px-3 text-center whitespace-nowrap">
          <span className="font-mono text-sm font-semibold text-slate-200">
            <span className="text-emerald-400">{player.kills ?? 0}</span> /{' '}
            <span className="text-red-400">{player.deaths ?? 0}</span> /{' '}
            <span className="text-slate-300">{player.assists ?? 0}</span>
          </span>
        </td>

        {/* Net Worth */}
        <td className="py-2.5 px-3 text-right font-mono text-xs font-semibold text-amber-300 whitespace-nowrap">
          {player.net_worth ? player.net_worth.toLocaleString() : '-'}
        </td>

        {/* GPM / XPM */}
        <td className="py-2.5 px-3 text-right font-mono text-xs text-slate-300 whitespace-nowrap hidden sm:table-cell">
          <span className="text-amber-400">{player.gold_per_min || 0}</span>
          <span className="text-slate-600 mx-1">/</span>
          <span className="text-cyan-400">{player.xp_per_min || 0}</span>
        </td>

        {/* LH / DN */}
        <td className="py-2.5 px-3 text-right font-mono text-xs text-slate-400 whitespace-nowrap hidden md:table-cell">
          {player.last_hits || 0} / {player.denies || 0}
        </td>

        {/* Hero Damage */}
        <td className="py-2.5 px-3 text-right font-mono text-xs text-rose-300 whitespace-nowrap hidden lg:table-cell">
          {player.hero_damage ? player.hero_damage.toLocaleString() : '-'}
        </td>

        {/* Items */}
        <td className="py-2.5 px-3">
          <div className="flex items-center gap-1 justify-end">
            {items.map((item, idx) => {
              const url = getItemImageUrl(item);
              return (
                <div
                  key={idx}
                  className="w-7 h-5 bg-[#0b0e14] rounded border border-slate-700/80 overflow-hidden flex items-center justify-center shrink-0"
                >
                  {url ? (
                    <img
                      src={url}
                      alt="item"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900/40" />
                  )}
                </div>
              );
            })}
            {(() => {
              const neutralUrl = getItemImageUrl(neutralItem);
              if (!neutralUrl) return null;
              return (
                <div className="w-5 h-5 ml-1 rounded-full border border-amber-500/60 overflow-hidden shrink-0 bg-black">
                  <img
                    src={neutralUrl}
                    alt="neutral"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              );
            })()}
          </div>
        </td>

        {/* Action Select */}
        <td className="py-2.5 px-2 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectHero(player.hero_id);
            }}
            className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              isSelected
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-700/60'
            }`}
            title="Selecionar este herói para o relatório de coaching"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8">
      {/* Match Overview Bar */}
      <div className="bg-[#111622] border border-slate-800 rounded-2xl p-4 md:p-6 mb-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              Partida #{match.match_id}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-lg md:text-xl font-black font-['Cinzel',serif] tracking-wide flex items-center gap-1.5 ${
                  radiantWin ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                <Crown className="w-5 h-5" />
                {radiantWin ? 'VITÓRIA DO RADIANT' : 'VITÓRIA DO DIRE'}
              </span>
            </div>
          </div>
        </div>

        {/* Central Score Display */}
        <div className="flex items-center gap-4 bg-[#0a0d14] px-6 py-2.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-xs uppercase text-emerald-400 font-bold tracking-wider">Radiant</div>
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono">{radiantScore}</div>
          </div>
          <div className="text-slate-500 font-bold text-sm px-1">VS</div>
          <div className="text-left">
            <div className="text-xs uppercase text-red-400 font-bold tracking-wider">Dire</div>
            <div className="text-2xl md:text-3xl font-extrabold text-red-400 font-mono">{direScore}</div>
          </div>
        </div>

        {/* Match Duration & Meta */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="text-center">
            <div className="text-[10px] uppercase text-slate-500 font-sans">Duração</div>
            <div className="text-slate-200 font-bold text-sm">{formattedDuration}</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="text-center">
            <div className="text-[10px] uppercase text-slate-500 font-sans">Primeiro Sangue</div>
            <div className="text-slate-200 font-bold text-sm">{Math.floor((match.first_blood_time || 0) / 60)}m</div>
          </div>
        </div>
      </div>

      {/* Radiant Scoreboard */}
      <div className="mb-6 bg-[#0e131d]/90 border border-emerald-900/40 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-emerald-950/60 to-transparent px-4 py-3 border-b border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="font-['Cinzel',serif] text-sm md:text-base font-bold text-emerald-300 tracking-wider">
              THE RADIANT
            </h3>
            {radiantWin && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Vencedor
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {radiantScore} Abates Totais
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090c12]/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Herói</th>
                <th className="py-2.5 px-3 text-center">K / D / A</th>
                <th className="py-2.5 px-3 text-right">Net Worth</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">GPM / XPM</th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">LH / DN</th>
                <th className="py-2.5 px-3 text-right hidden lg:table-cell">Dano Herói</th>
                <th className="py-2.5 px-3 text-right">Itens</th>
                <th className="py-2.5 px-2 text-center">IA</th>
              </tr>
            </thead>
            <tbody>
              {radiantPlayers.map((p: any) => renderPlayerRow(p, true))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dire Scoreboard */}
      <div className="bg-[#0e131d]/90 border border-red-950/40 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-red-950/60 to-transparent px-4 py-3 border-b border-red-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-red-400" />
            <h3 className="font-['Cinzel',serif] text-sm md:text-base font-bold text-red-300 tracking-wider">
              THE DIRE
            </h3>
            {!radiantWin && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                Vencedor
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {direScore} Abates Totais
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090c12]/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Herói</th>
                <th className="py-2.5 px-3 text-center">K / D / A</th>
                <th className="py-2.5 px-3 text-right">Net Worth</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">GPM / XPM</th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">LH / DN</th>
                <th className="py-2.5 px-3 text-right hidden lg:table-cell">Dano Herói</th>
                <th className="py-2.5 px-3 text-right">Itens</th>
                <th className="py-2.5 px-2 text-center">IA</th>
              </tr>
            </thead>
            <tbody>
              {direPlayers.map((p: any) => renderPlayerRow(p, false))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
