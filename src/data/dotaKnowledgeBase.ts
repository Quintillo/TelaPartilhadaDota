export interface HeroCounterInfo {
  heroId: number;
  heroName: string;
  role: string;
  counters: string[];
  counteredBy: {
    hero: string;
    why: string;
  }[];
  coreItems: string[];
  situationalCounters: {
    item: string;
    target: string;
    description: string;
  }[];
  powerSpikes: string[];
  laningTips: string[];
}

export interface ObjectiveTiming {
  name: string;
  intervalMinutes: number;
  firstSpawnMinute: number;
  type: 'rune' | 'roshan' | 'tormentor' | 'lotus' | 'day_night';
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  actionCallout: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  heroName: string;
  heroId: number;
  gameTime: string;
  phase: string;
  description: string;
  sampleImageUrl: string;
  enemyHeroes: string[];
  alliedHeroes: string[];
  currentItems: string[];
  currentNetWorth: string;
  urgency: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY' | 'SAFE';
  expectedCallout: string;
  expectedDirective: string;
  recommendedItem: {
    name: string;
    reason: string;
    cost: number;
    currentProgress: number;
  };
  mapNavigation: {
    currentZone: string;
    recommendedZone: string;
    safetyRating: number;
    movementAdvice: string;
  };
  minimapPings: {
    x: number;
    y: number;
    type: 'player' | 'danger' | 'safe_move' | 'objective' | 'ward';
    label: string;
  }[];
}

// Map Timings & Objectives
export const OBJECTIVE_TIMINGS: ObjectiveTiming[] = [
  {
    name: 'Runa da Sabedoria (Wisdom Rune)',
    intervalMinutes: 7,
    firstSpawnMinute: 7,
    type: 'rune',
    importance: 'CRITICAL',
    actionCallout: 'Runa da Sabedoria surgindo nas bordas do mapa aos 7, 14, 21 min! O suporte ou offlaner deve garantir o XP da equipe.',
  },
  {
    name: 'Runas de Poder do Rio (Power Runes)',
    intervalMinutes: 2,
    firstSpawnMinute: 6,
    type: 'rune',
    importance: 'HIGH',
    actionCallout: 'Runa de Poder ativa no rio a cada 2 minutos (Haste, DD, Invis, Arcanas, Regen). Prepare controle de rio e gank.',
  },
  {
    name: 'Runas de Água / Recompensa (Water/Bounty)',
    intervalMinutes: 2,
    firstSpawnMinute: 2,
    type: 'rune',
    importance: 'MEDIUM',
    actionCallout: 'Conteste as runas de água no mid aos 2:00 e 4:00 para recarregar a Garrafa (Bottle) do seu mid laner.',
  },
  {
    name: 'Tormentor (Aghanim Shard Grátis)',
    intervalMinutes: 10,
    firstSpawnMinute: 20,
    type: 'tormentor',
    importance: 'HIGH',
    actionCallout: 'Tormentor disponível aos 20:00! Agrupe pelo menos 3 heróis para obter o Aghanim Shard de 1400 de ouro.',
  },
  {
    name: 'Covil de Roshan (Troca Dia/Noite)',
    intervalMinutes: 5,
    firstSpawnMinute: 0,
    type: 'roshan',
    importance: 'CRITICAL',
    actionCallout: 'Roshan muda de covil no ciclo Dia/Noite (Dia = Covil Sudeste Radiant, Noite = Covil Noroeste Dire). Respawn de 8 a 11 min após abatido.',
  },
  {
    name: 'Lago de Lótus (Lotus Pools)',
    intervalMinutes: 3,
    firstSpawnMinute: 3,
    type: 'lotus',
    importance: 'MEDIUM',
    actionCallout: 'Lótus acumulam a cada 3 minutos nas bordas das rotas laterais. Colete para cura instantânea de HP e Mana.',
  },
];

// Meta Hero Counters and Item Synergies
export const HERO_DATABASE: Record<string, HeroCounterInfo> = {
  Juggernaut: {
    heroId: 8,
    heroName: 'Juggernaut',
    role: 'Carry (Pos 1)',
    counters: ['Phantom Assassin', 'Lifestealer', 'Underlord', 'Tidehunter'],
    counteredBy: [
      { hero: 'Axe', why: 'Berserker\'s Call atravessa a Fúria das Lâminas (Blade Fury) e força ataque físico.' },
      { hero: 'Slardar', why: 'Stun em área, alta velocidade e Corrosive Haze anula a armadura.' },
      { hero: 'Ursa', why: 'Vence trocas corpo-a-corpo prolongadas com Fury Swipes e Enrage.' },
      { hero: 'Shadow Demon', why: 'Disruption salva alvos do Omnislash criando ilusões.' },
    ],
    coreItems: ['Phase Boots', 'Battle Fury', 'Manta Style', 'Aghanim\'s Scepter', 'Butterfly', 'Swift Blink'],
    situationalCounters: [
      { item: 'Nullifier', target: 'Ghost Scepter / Eul', description: 'Remove os saves de Ghost Scepter dos suportes para garantir os abates do Omnislash.' },
      { item: 'Black King Bar', target: 'Stuns que passam Fúria / Pudge Dismember', description: 'Garante imunidade total quando a rotação de Blade Fury estiver em recarga.' },
      { item: 'Silver Edge', target: 'Passivas (Bristleback / Spectre / PA)', description: 'Aplica Quebra (Break) desativando passivas defensivas.' },
      { item: 'Abyssal Blade', target: 'Heróis com alta mobilidade / BKB', description: 'Atordoa através de imunidade a magia e permite foco instantâneo.' },
    ],
    powerSpikes: [
      'Nível 6 (Omnislash): Pico iminente de abate solo em heróis isolados.',
      'Battle Fury (~13-15 min): Aceleração máxima de farm na selva.',
      'Manta Style (~20-22 min): Desarme de silences e aumento de dps.',
      'Aghanim\'s Scepter (Swift Slash): Mini-Omnislash com 20s de recarga.',
    ],
    laningTips: [
      'Combine Blade Fury com slow de suporte (ex: Crystal Maiden Frostbite, Venomancer Gale).',
      'Use o Healing Ward escondido dentro das árvores para não ser destruído por ataques simples inimigos.',
      'Aos 5 minutos, empurre a wave e use o Healing Ward para farmar os campos neutros vizinhos.',
    ],
  },
  'Anti-Mage': {
    heroId: 1,
    heroName: 'Anti-Mage',
    role: 'Hard Carry (Pos 1)',
    counters: ['Storm Spirit', 'Medusa', 'Zeus', 'Lina', 'Pugna', 'Invoker'],
    counteredBy: [
      { hero: 'Legion Commander', why: 'Duel com Blademail impede o Blink e destrói o AM.' },
      { hero: 'Meepo', why: 'Earthbind infinito não permite fuga e dano físico elevado.' },
      { hero: 'Bloodseeker', why: 'Rupture impede o uso de Blink sob risco de morte instantânea.' },
      { hero: 'Faceless Void', why: 'Chronosphere trava o AM sem tempo de resposta para Counterspell.' },
    ],
    coreItems: ['Power Treads', 'Battle Fury', 'Manta Style', 'Skull Basher', 'Abyssal Blade', 'Eye of Skadi'],
    situationalCounters: [
      { item: 'Linken\'s Sphere', target: 'Duel / Doom / Rupture / Hex', description: 'Bloqueia a magia de catch direcionada primária.' },
      { item: 'Butterfly', target: 'Right-clickers físicos sem MKB', description: '35% de evasão e aceleração de dano.' },
      { item: 'Black King Bar', target: 'Controle de grupo em área encadeado', description: 'Impedir silences consecutivos que travam o Blink.' },
    ],
    powerSpikes: [
      'Battle Fury (~12-14 min): Transição imediata de rota para rotação de campos neutros.',
      'Manta Style (~20 min): Capacidade de split push agressivo nas torres T2.',
      'Abyssal Blade (~28 min): Pico de abate instantâneo em heróis com mana queimada.',
    ],
    laningTips: [
      'Evite gastar Mana Break em heróis com muita regeneração; foque em garantir cada last hit.',
      'Treine o tempo de reação do Counterspell para refletir stuns com projéteis lentos (Vengeful, Wraith King).',
      'Assim que a torre T1 cair, mude permanentemente para o Triângulo Seguro.',
    ],
  },
  'Phantom Assassin': {
    heroId: 44,
    heroName: 'Phantom Assassin',
    role: 'Carry (Pos 1)',
    counters: ['Drow Ranger', 'Sniper', 'Zeus', 'Crystal Maiden', 'Rubick'],
    counteredBy: [
      { hero: 'Morphling', why: 'Muita armadura física, burst mágico rápido de Ethereal Blade.' },
      { hero: 'Axe', why: 'Call força PA a atacar Blademail recebendo seus próprios críticos de volta.' },
      { hero: 'Razor', why: 'Static Link rouba todo o dano físico mesmo durante BKB.' },
      { hero: 'Tinker', why: 'Laser causa cegueira (miss de 100%) e burst contínuo de longa distância.' },
    ],
    coreItems: ['Power Treads', 'Desolator', 'Black King Bar', 'Basher', 'Satanic', 'Nullifier'],
    situationalCounters: [
      { item: 'Black King Bar', target: 'Mágico e stuns', description: 'Item obrigatório sem o qual a PA não pode entrar em lutas.' },
      { item: 'Nullifier', target: 'Ghost Scepter / Aeon Disk / Glimmer', description: 'Impede alvos de sobreviverem ao Phantom Strike com itens de save.' },
      { item: 'Monkey King Bar', target: 'Evasão inimiga (Butterfly / Radiance)', description: 'Garante acerto contra heróis esquivos.' },
    ],
    powerSpikes: [
      'Desolator (~14-16 min): Elimina suportes com 1 crítico de Stifling Dagger.',
      'BKB (~20-22 min): Janela de vitória definitiva para forçar lutas de 5 contra 5.',
    ],
    laningTips: [
      'Use Stifling Dagger para garantir last hits de creeps de alcance difíceis de contestar.',
      'Não gaste Phantom Strike ofensivamente se o suporte inimigo tiver o stun em prontidão.',
    ],
  },
  'Storm Spirit': {
    heroId: 17,
    heroName: 'Storm Spirit',
    role: 'Mid Laner (Pos 2)',
    counters: ['Sniper', 'Tinker', 'Venomancer', 'Zeus'],
    counteredBy: [
      { hero: 'Silencer', why: 'Global Silence interrompe Ball Lightning instantaneamente em qualquer lugar.' },
      { hero: 'Anti-Mage', why: 'Mana Void quando o Storm gasta toda a mana explode o time inteiro.' },
      { hero: 'Doom', why: 'Doom desativa Ball Lightning por 16 segundos.' },
    ],
    coreItems: ['Bottle', 'Kaya and Sange', 'Orchid Malevolence', 'Black King Bar', 'Bloodstone', 'Shiva\'s Guard'],
    situationalCounters: [
      { item: 'Eul\'s Scepter', target: 'Silences iniciais / Orchid', description: 'Remove silences e compra tempo para o teleporte.' },
      { item: 'Linken\'s Sphere', target: 'Doom / Hex / Abyssal', description: 'Proteção passiva contra iniciações de alvo único.' },
    ],
    powerSpikes: [
      'Nível 6 (Ball Lightning): Alta mobilidade e gank em qualquer rota lateral.',
      'Orchid (~14-16 min): Abate garantido em qualquer herói solitário sem dispel.',
    ],
    laningTips: [
      'Use Static Remnant para conseguir last hits e acertar o herói inimigo ao mesmo tempo.',
      'Controle rigorosamente as runas de água aos 2 e 4 minutos para manter a mana cheia.',
    ],
  },
  Axe: {
    heroId: 2,
    heroName: 'Axe',
    role: 'Offlaner (Pos 3)',
    counters: ['Phantom Lancer', 'Juggernaut', 'Dazzle', 'Slark', 'Meepo'],
    counteredBy: [
      { hero: 'Venomancer', why: 'Lentidão pesada e dano contínuo cancelam a Blink Dagger.' },
      { hero: 'Timbersaw', why: 'Puro dano de redução de atributos ignora armadura.' },
      { hero: 'Viper', why: 'Nethertoxin aplica Break desligando o Counter Helix.' },
    ],
    coreItems: ['Tranquil Boots', 'Blink Dagger', 'Blade Mail', 'Black King Bar', 'Aghanim\'s Shard', 'Overwhelming Blink'],
    situationalCounters: [
      { item: 'Lotus Orb', target: 'Debuffs e silences', description: 'Reflete magias e remove lentidões.' },
      { item: 'Crimson Guard', target: 'Dano físico em área / summons', description: 'Protege toda a equipe contra ataques físicos.' },
      { item: 'Shiva\'s Guard', target: 'Cura e velocidade de ataque', description: 'Reduz a cura de heróis como Lifestealer e Alchemist em 45%.' },
    ],
    powerSpikes: [
      'Blink Dagger (~11-13 min): Capacidade de iniciação mortal a qualquer momento.',
      'Blade Mail (~16 min): Destrói carries físicos como PA, Clinkz e Sniper ao usar Call.',
    ],
    laningTips: [
      'Corte a wave de creeps inimiga atrás da torre T1 para forçar o carry inimigo a farmar sob a torre.',
      'Battle Hunger causa dano contínuo a menos que o inimigo consiga um last hit.',
    ],
  },
};

// 4 High-fidelity simulated Live Game Scenarios for Instant Testing & Demonstrations
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario_laning_gank',
    title: 'Fase de Rotas - Alerta de Gank do Mid Laner',
    heroName: 'Juggernaut',
    heroId: 8,
    gameTime: '06:15',
    phase: 'Laning Phase (Início de Jogo)',
    description: 'Você está no Top empurrando os creeps sob a torre inimiga. O Storm Spirit inimigo pegou a runa de Haste aos 06:00 e sumiu do minimapa.',
    sampleImageUrl: '/assets/aistudio/image_91cb4fbb.png',
    enemyHeroes: ['Axe', 'Storm Spirit', 'Lina', 'Lion', 'Pudge'],
    alliedHeroes: ['Crystal Maiden', 'Earthshaker', 'Tidehunter', 'Mirana'],
    currentItems: ['Phase Boots', 'Magic Wand', 'Quelling Blade'],
    currentNetWorth: '2.450',
    urgency: 'CRITICAL',
    expectedCallout: 'Atenção Juggernaut! Storm Spirit pegou Haste no rio e está subindo na sua rota! Recue imediatamente para baixo da sua torre!',
    expectedDirective: 'Pare de bater na torre inimiga agora. O Storm Spirit inimigo pegou Haste no rio e está a 5 segundos de iniciar com o Axe. Use a Fúria das Lâminas (Blade Fury) apenas se for agarrado e dê teleporte para a base ou recue para o campo neutro da sua selva.',
    recommendedItem: {
      name: 'Battle Fury (Cornucopia / Broadsword)',
      reason: 'Acelera a limpeza de campos da selva para quando você precisar abandonar a rota.',
      cost: 4100,
      currentProgress: 45,
    },
    mapNavigation: {
      currentZone: 'Rota Superior / Torre T1 Inimiga (Deadlane)',
      recommendedZone: 'Atrás da sua Torre T1 / Campo Pequeno Seguro',
      safetyRating: 15,
      movementAdvice: 'Recuo Solo Imediato. Não espere ver o herói na tela; quando o Storm sumir com Haste aos 6m, a rota já está perdida.',
    },
    minimapPings: [
      { x: 22, y: 32, type: 'player', label: 'Juggernaut (Você - Risco Crítico)' },
      { x: 38, y: 38, type: 'danger', label: 'Storm Spirit com Haste (Gank vindo do Rio)' },
      { x: 26, y: 30, type: 'danger', label: 'Axe (Offlaner com Call pronto)' },
      { x: 16, y: 55, type: 'safe_move', label: 'Posição Segura sob sua Torre T1' },
    ],
  },
  {
    id: 'scenario_roshan_contest',
    title: 'Disputa de Roshan no Rio & Teamfight',
    heroName: 'Phantom Assassin',
    heroId: 44,
    gameTime: '21:40',
    phase: 'Mid Game (Controle de Objetivos)',
    description: 'Seu time derrubou a torre T2 do meio. Roshan está vivo no covil inferior (ciclo diurno). O inimigo está reunido com pouca visão nas encostas.',
    sampleImageUrl: '/assets/aistudio/image_7a53f4b3.png',
    enemyHeroes: ['Faceless Void', 'Invoker', 'Tidehunter', 'Snapfire', 'Disruptor'],
    alliedHeroes: ['Ogre Magi', 'Vengeful Spirit', 'Centaur Warrunner', 'Storm Spirit'],
    currentItems: ['Power Treads', 'Desolator', 'Black King Bar', 'Morbid Mask'],
    currentNetWorth: '11.800',
    urgency: 'OPPORTUNITY',
    expectedCallout: 'PA, seu BKB e Desolator estão prontos! Não entre no Roshan primeiro; espere o Centaur iniciar e pule no Disruptor!',
    expectedDirective: 'Momento de ouro: você acabou de fechar o Black King Bar. O Disruptor inimigo tem Static Storm que pode te travar. Deixe o Centauro Warrunner abrir a visão da rampa com Stampede. Pule de imediato no Disruptor para silenciar a teamfight antes de bater no Roshan.',
    recommendedItem: {
      name: 'Skull Basher',
      reason: 'Necessário para atordoar o Faceless Void durante trocas e impedir que ele salte com Time Walk.',
      cost: 2875,
      currentProgress: 60,
    },
    mapNavigation: {
      currentZone: 'Entrada do Covil de Roshan (Sudeste)',
      recommendedZone: 'Encosta Alta (High Ground) com Ward Sentinela',
      safetyRating: 80,
      movementAdvice: 'Andar em Grupo (5-Man): Luta de Roshan exige todo o time. Nunca comece o Roshan sem 2 sentries nas rampas.',
    },
    minimapPings: [
      { x: 80, y: 78, type: 'player', label: 'Phantom Assassin (Na cobertura)' },
      { x: 78, y: 82, type: 'objective', label: 'Roshan Vivo (Drop de Aegis)' },
      { x: 72, y: 70, type: 'danger', label: 'Tidehunter Inimigo com Ravage' },
      { x: 82, y: 72, type: 'ward', label: 'Plantar Observer Ward na Colina' },
    ],
  },
  {
    id: 'scenario_deadlane_splitpush',
    title: 'Farming Perigoso na Deadlane (Mid Game)',
    heroName: 'Anti-Mage',
    heroId: 1,
    gameTime: '16:10',
    phase: 'Mid Game (Farm & Split Push)',
    description: 'Você está empurrando a wave de creeps profunda na rota inferior do Dire. 4 inimigos sumiram do minimapa após levarem a torre do meio.',
    sampleImageUrl: '/assets/aistudio/image_91cb4fbb.png',
    enemyHeroes: ['Legion Commander', 'Lion', 'Shadow Shaman', 'Slardar', 'Zeus'],
    alliedHeroes: ['Dazzle', 'Puck', 'Underlord', 'Rubick'],
    currentItems: ['Power Treads', 'Battle Fury', 'Yasha'],
    currentNetWorth: '7.850',
    urgency: 'WARNING',
    expectedCallout: 'Anti-Mage, a wave já passou do rio! Legion e Slardar estão em Smoke. Use o Blink para a selva e teleporte para o Triângulo!',
    expectedDirective: 'Aplique a regra do "Bater e Sumir": você já limpou a wave avançada. Se você der mais 3 ataques nessa torre, a Legion Commander vai pular de Blink + Duel e te matar. Saia pelas árvores laterais com Blink e farme o campo de ancients.',
    recommendedItem: {
      name: 'Manta Style (Completar Yasha + Ultimate Orb)',
      reason: 'Item vital para remover o silence e o stun do Slardar instantaneamente.',
      cost: 4600,
      currentProgress: 80,
    },
    mapNavigation: {
      currentZone: 'Deadlane do Dire (Rota Inferior Profunda)',
      recommendedZone: 'Triângulo Seguro Radiant (Campos Ancients)',
      safetyRating: 25,
      movementAdvice: 'Avanço Solo Seguro: Só empurre até o rio. Passou do rio, bata na wave com magia e fuja para o escuro.',
    },
    minimapPings: [
      { x: 84, y: 48, type: 'player', label: 'Anti-Mage (Exposto na Deadlane)' },
      { x: 65, y: 55, type: 'danger', label: 'Provável Rota de Smoke da Legion' },
      { x: 22, y: 60, type: 'safe_move', label: 'Mover para o Triângulo Seguro' },
    ],
  },
  {
    id: 'scenario_highground_buyback',
    title: 'Cerco de Highground & Disciplina de Buyback',
    heroName: 'Juggernaut',
    heroId: 8,
    gameTime: '34:20',
    phase: 'Late Game (Highground & Fim de Jogo)',
    description: 'Seu time está na rampa da base inimiga. O inimigo ativou o Feitiço de Fortificação (Glyph). Você está sem ouro reservado para recompra.',
    sampleImageUrl: '/assets/aistudio/image_7a53f4b3.png',
    enemyHeroes: ['Magnus', 'Sniper', 'Warlock', 'Pudge', 'Lich'],
    alliedHeroes: ['Enigma', 'Disruptor', 'Dragon Knight', 'Vengeful Spirit'],
    currentItems: ['Phase Boots', 'Battle Fury', 'Manta Style', 'Butterfly', 'Eye of Skadi', 'Abyssal Blade'],
    currentNetWorth: '22.400',
    urgency: 'CRITICAL',
    expectedCallout: 'CUIDADO! Glyph inimigo ativado na torre! Recue da rampa imediatamente! Se você morrer agora sem buyback, eles dão GG!',
    expectedDirective: 'Alto risco de virada: o Magnus adversário está esperando você subir na rampa para dar Reverse Polarity com Skewer para dentro da fonte. O Glyph ativado faz a torre matar sua wave em segundos. Recue 500 unidades, espere o Glyph acabar e controle a visão dos lados da rampa.',
    recommendedItem: {
      name: 'Guardar Ouro de Buyback (2.100 gold)',
      reason: 'Nenhum item de 2000 gold vale mais do que a sua vida no minuto 34.',
      cost: 2100,
      currentProgress: 100,
    },
    mapNavigation: {
      currentZone: 'Rampa de Highground da Base Inimiga',
      recommendedZone: 'Fora do alcance da torre T3 / Selva do Highground',
      safetyRating: 30,
      movementAdvice: 'Andar em Grupo Estrito: No cerco de base, mantenha o Dragon Knight tanque na frente e nunca suba a rampa no escuro.',
    },
    minimapPings: [
      { x: 74, y: 25, type: 'player', label: 'Juggernaut (Rampa da T3)' },
      { x: 80, y: 20, type: 'danger', label: 'Magnus Inimigo (RP + Skewer)' },
      { x: 62, y: 35, type: 'safe_move', label: 'Ponto Seguro fora do Alcance da Torre' },
    ],
  },
];

// ====================================================
// SMART COUNTER-BUILD DATABASE WITH WIN-RATE STATISTICS
// ====================================================
export interface SmartCounterItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  components: string[];
  winRateDelta: string;
  winRateBase: number;
  category: 'defensive' | 'offensive' | 'utility';
  priorityTier: 'ESSENTIAL' | 'RECOMMENDED' | 'SITUATIONAL';
  targetEnemyTypes: string[];
  targetHeroes: string[];
  whyDescription: string;
  inGameTip: string;
}

export const SMART_COUNTER_ITEMS: SmartCounterItem[] = [
  {
    id: 'black_king_bar',
    name: 'Black King Bar (BKB)',
    icon: 'black_king_bar',
    cost: 4050,
    components: ['Ogre Axe', 'Mithril Hammer', 'Recipe (1450)'],
    winRateDelta: '+12.8% Win Rate',
    winRateBase: 58.4,
    category: 'defensive',
    priorityTier: 'ESSENTIAL',
    targetEnemyTypes: ['Burst Mágico', 'Stuns em Cadeia', 'Controle de Grupo'],
    targetHeroes: ['Lion', 'Lina', 'Invoker', 'Storm Spirit', 'Puck', 'Zeus', 'Leshrac', 'Earthshaker', 'Tinker'],
    whyDescription: 'Concede Imunidade a Debuffs e 50% de Resistência Mágica. Essencial quando o time inimigo possui stuns em cadeia que impedem você de bater ou se movimentar.',
    inGameTip: 'Feche entre 18:00 e 24:00. Guarde a primeira carga de 9 segundos para lutas decisivas de Roshan ou torres Tier 2.',
  },
  {
    id: 'nullifier',
    name: 'Nullifier',
    icon: 'nullifier',
    cost: 4375,
    components: ['Relic (3400)', 'Helm of Iron Will (975)'],
    winRateDelta: '+14.2% Win Rate',
    winRateBase: 59.8,
    category: 'offensive',
    priorityTier: 'ESSENTIAL',
    targetEnemyTypes: ['Saves de Suporte', 'Imunidade Física', 'Ghost Form'],
    targetHeroes: ['Necrophos', 'Pugna', 'Windranger', 'Dazzle', 'Oracle', 'Shadow Demon', 'Omniknight'],
    whyDescription: 'Aplica despelamento contínuo (dispel a cada 0.2s) por 5 segundos. Destrói Ghost Scepter, Eul\'s Scepter, Force Staff, Glimmer Cape e Aeon Disk instantaneamente.',
    inGameTip: 'Compre assim que os suportes adversários completarem Ghost Scepter para garantir que seus abates não sejam cancelados.',
  },
  {
    id: 'heavens_halberd',
    name: "Heaven's Halberd",
    icon: 'heavens_halberd',
    cost: 3550,
    components: ['Sange (2050)', 'Talisman of Evasion (1300)', 'Recipe (200)'],
    winRateDelta: '+11.5% Win Rate',
    winRateBase: 56.2,
    category: 'defensive',
    priorityTier: 'RECOMMENDED',
    targetEnemyTypes: ['Carries Físicos Right-Clickers', 'Dano Crítico Pesado'],
    targetHeroes: ['Ursa', 'Sven', 'Troll Warlord', 'Huskar', 'Phantom Assassin', 'Sniper', 'Drow Ranger', 'Clinkz'],
    whyDescription: 'Desarma o herói alvo (3s em corpo-a-corpo / 5s em alcance). O desarme NÃO PODE SER REMOVIDO com Black King Bar ou dispels se aplicado antes do BKB!',
    inGameTip: 'Desarme o carry inimigo no exato momento em que ele pular com Blink ou tentar focar seus suportes.',
  },
  {
    id: 'spirit_vessel',
    name: 'Spirit Vessel',
    icon: 'spirit_vessel',
    cost: 2780,
    components: ['Urn of Shadows (880)', 'Crown (450)', 'Fluffy Hat (250)', 'Recipe (1200)'],
    winRateDelta: '+13.7% Win Rate',
    winRateBase: 57.9,
    category: 'utility',
    priorityTier: 'ESSENTIAL',
    targetEnemyTypes: ['Alta Regeneração de Vida', 'Tanques de Cura', 'High HP'],
    targetHeroes: ['Alchemist', 'Morphling', 'Necrophos', 'Huskar', 'Slark', 'Pudge', 'Timbersaw', 'Abaddon'],
    whyDescription: 'Reduz toda a cura e regeneração de HP do alvo em 45%, além de causar dano contínuo baseado em 4% do HP atual por segundo.',
    inGameTip: 'Garanta cargas participando de abates. Lance no Morphling assim que ele mudar para força ou no Alchemist durante Chemical Rage.',
  },
  {
    id: 'silver_edge',
    name: 'Silver Edge',
    icon: 'silver_edge',
    cost: 5450,
    components: ['Shadow Blade (3000)', 'Demon Edge (2200)', 'Recipe (250)'],
    winRateDelta: '+12.1% Win Rate',
    winRateBase: 56.8,
    category: 'offensive',
    priorityTier: 'RECOMMENDED',
    targetEnemyTypes: ['Passivas Quebráveis', 'Redução Passiva de Dano'],
    targetHeroes: ['Bristleback', 'Spectre', 'Phantom Assassin (Blur/Crit)', 'Viper (Corrosive Skin)', 'Huskar (Berserker\'s Blood)', 'Dragon Knight'],
    whyDescription: 'O ataque que quebra a invisibilidade aplica QUEBRA (Break) por 5 segundos, desativando completamente as habilidades passivas do alvo.',
    inGameTip: 'Ataque saindo da invisibilidade nas costas do Bristleback para anular a redução de 40% de dano da passiva dele.',
  },
  {
    id: 'manta_style',
    name: 'Manta Style',
    icon: 'manta',
    cost: 4600,
    components: ['Yasha (2050)', 'Ultimate Orb (2050)', 'Recipe (500)'],
    winRateDelta: '+9.3% Win Rate',
    winRateBase: 55.4,
    category: 'utility',
    priorityTier: 'RECOMMENDED',
    targetEnemyTypes: ['Silences', 'Raízes (Roots)', 'Magias com Debuffs'],
    targetHeroes: ['Silencer', 'Drow Ranger', 'Night Stalker', 'Treant Protector', 'Bloodseeker', 'Clinkz (Orchid)'],
    whyDescription: 'Aplica um dispel básico instantâneo removendo silences e raízes, desvia de projéteis e cria 2 ilusões para split push.',
    inGameTip: 'Não gaste a Manta para farmar creeps se você estiver empurrando uma rota perigosa e o Silencer ou Night Stalker estiverem sumidos.',
  },
  {
    id: 'abyssal_blade',
    name: 'Abyssal Blade',
    icon: 'abyssal_blade',
    cost: 6250,
    components: ['Skull Basher (2875)', 'Vanguard (1700)', 'Recipe (1675)'],
    winRateDelta: '+15.4% Win Rate',
    winRateBase: 61.2,
    category: 'offensive',
    priorityTier: 'RECOMMENDED',
    targetEnemyTypes: ['Heróis com BKB', 'Alta Mobilidade', 'Carries Elusivos'],
    targetHeroes: ['Storm Spirit', 'Anti-Mage', 'Queen of Pain', 'Pangolier', 'Ember Spirit', 'Void Spirit', 'Weaver', 'Slark'],
    whyDescription: 'O ativo Overwhelm atordoa o alvo por 2 segundos ATRAVESSANDO Imunidade a Magia / BKB.',
    inGameTip: 'Item definitivo de late game para travar heróis com BKB ativado antes que consigam usar habilidades de fuga.',
  },
  {
    id: 'linkens_sphere',
    name: "Linken's Sphere",
    icon: 'sphere',
    cost: 4600,
    components: ['Ultimate Orb (2050)', 'Perseverance (1400)', 'Recipe (1150)'],
    winRateDelta: '+10.6% Win Rate',
    winRateBase: 54.8,
    category: 'defensive',
    priorityTier: 'SITUATIONAL',
    targetEnemyTypes: ['Ultimates de Alvo Único', 'Iniciações que Ignoram BKB'],
    targetHeroes: ['Legion Commander (Duel)', 'Doom (Doom)', 'Bane (Fiend\'s Grip)', 'Beastmaster (Primal Roar)', 'Bloodseeker (Rupture)'],
    whyDescription: 'Bloqueia passivamente uma magia direcionada a cada 14 segundos. Pode ser lançada em aliados para protegê-los de iniciações mortais.',
    inGameTip: 'Item obrigatório para heróis que morrem se forem iniciados de surpresa (ex: Weaver, Morphling, Queen of Pain).',
  },
  {
    id: 'shivas_guard',
    name: "Shiva's Guard",
    icon: 'shivas_guard',
    cost: 4825,
    components: ['Platemail (1400)', 'Veil of Discord (1525)', 'Recipe (1900)'],
    winRateDelta: '+11.9% Win Rate',
    winRateBase: 57.3,
    category: 'utility',
    priorityTier: 'RECOMMENDED',
    targetEnemyTypes: ['Ilusões', 'Velocidade de Ataque Física', 'Regeneração'],
    targetHeroes: ['Phantom Lancer', 'Naga Siren', 'Chaos Knight', 'Morphling', 'Troll Warlord', 'Slark', 'Alchemist'],
    whyDescription: 'Concede 16 de armadura, reduz em 45 a velocidade de ataque dos inimigos ao redor e corta 25% da regeneração de vida passivamente.',
    inGameTip: 'Ative a onda Arctic Blast antes de iniciar lutas para amplificar em 12% o dano mágico recebido pelos inimigos.',
  },
  {
    id: 'lotus_orb',
    name: 'Lotus Orb',
    icon: 'lotus_orb',
    cost: 3850,
    components: ['Platemail (1400)', 'Perseverance (1400)', 'Energy Booster (800)', 'Recipe (250)'],
    winRateDelta: '+10.2% Win Rate',
    winRateBase: 55.6,
    category: 'utility',
    priorityTier: 'SITUATIONAL',
    targetEnemyTypes: ['Magias Direcionadas com Stun / Silence', 'Debuffs Contínuos'],
    targetHeroes: ['Lion', 'Lina', 'Vengeful Spirit', 'Silencer', 'Bounty Hunter (Track)', 'Slardar (Haze)'],
    whyDescription: 'Aplica dispel imediato no aliado e reflete todas as magias direcionadas de volta para o conjurador por 6 segundos.',
    inGameTip: 'Excelente compra para offlaners e suportes protegerem o carry principal de silences e hex.',
  },
];

// ====================================================
// CAMP RESPAWNS & STACK TIMINGS GUIDELINES
// ====================================================
export interface CampStackTiming {
  campType: 'small' | 'medium' | 'large' | 'ancient';
  label: string;
  location: string;
  stackSecondStart: number;
  stackSecondEnd: number;
  pullSecondStart?: number;
  pullSecondEnd?: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  pullDirection: string;
  tip: string;
}

export const CAMP_STACK_TIMINGS: CampStackTiming[] = [
  {
    campType: 'ancient',
    label: 'Acampamento Ancient (Triângulo)',
    location: 'Triângulo Seguro (Radiant & Dire)',
    stackSecondStart: 53,
    stackSecondEnd: 55,
    difficulty: 'Fácil',
    pullDirection: 'Puxe na direção do rio ou da rampa aos :53-:54',
    tip: 'O acampamento mais valioso do mapa para o Carry acelerar o farm. Pode ser stackado até 4 vezes com heróis de alcance.',
  },
  {
    campType: 'large',
    label: 'Acampamento Grande (Selva Primária)',
    location: 'Selva Próxima à Safe Lane',
    stackSecondStart: 53,
    stackSecondEnd: 55,
    difficulty: 'Médio',
    pullDirection: 'Ataque aos :53 e corra em linha reta para longe do campo',
    tip: 'Excelente para suporte puxar (pull) junto com a wave de creeps aos :15 e :45 se a rota estiver muito avançada.',
  },
  {
    campType: 'small',
    label: 'Acampamento Pequeno de Puxada (Pull Camp)',
    location: 'Atrás da Torre T1 da Safe Lane',
    stackSecondStart: 54,
    stackSecondEnd: 56,
    pullSecondStart: 15,
    pullSecondEnd: 18,
    difficulty: 'Fácil',
    pullDirection: 'Puxe aos :16 ou :46 para a rota para interceptar seus creeps',
    tip: 'Puxe este acampamento quando seus creeps passarem sob a torre inimiga para trazer a wave de volta para a segurança da sua rampa.',
  },
  {
    campType: 'medium',
    label: 'Acampamentos Médios (Selva Secundária)',
    location: 'Centro da Selva Aliada',
    stackSecondStart: 53,
    stackSecondEnd: 55,
    difficulty: 'Médio',
    pullDirection: 'Ataque aos :54 e corra para as colinas',
    tip: 'Creeps com projéteis lentos (sátiros) precisam ser atacados 1 segundo mais cedo (:53).',
  },
];

