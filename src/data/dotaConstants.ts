export interface DotaHero {
  id: number;
  name: string; // e.g. "antimage"
  localized_name: string; // e.g. "Anti-Mage"
  primary_attr: 'str' | 'agi' | 'int' | 'all';
  attack_type: 'Melee' | 'Ranged';
  roles: string[];
}

export const HEROES_MAP: Record<number, DotaHero> = {
  1: { id: 1, name: "antimage", localized_name: "Anti-Mage", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Escape", "Nuker"] },
  2: { id: 2, name: "axe", localized_name: "Axe", primary_attr: "str", attack_type: "Melee", roles: ["Initiator", "Durable", "Disabler", "Carry"] },
  3: { id: 3, name: "bane", localized_name: "Bane", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Disabler", "Nuker", "Durable"] },
  4: { id: 4, name: "bloodseeker", localized_name: "Bloodseeker", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Disabler", "Jungler", "Nuker", "Initiator"] },
  5: { id: 5, name: "crystal_maiden", localized_name: "Crystal Maiden", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Disabler", "Nuker"] },
  6: { id: 6, name: "drow_ranger", localized_name: "Drow Ranger", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Disabler", "Pusher"] },
  7: { id: 7, name: "earthshaker", localized_name: "Earthshaker", primary_attr: "str", attack_type: "Melee", roles: ["Support", "Initiator", "Disabler", "Nuker"] },
  8: { id: 8, name: "juggernaut", localized_name: "Juggernaut", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Pusher", "Escape"] },
  9: { id: 9, name: "mirana", localized_name: "Mirana", primary_attr: "all", attack_type: "Ranged", roles: ["Carry", "Support", "Escape", "Nuker", "Disabler"] },
  10: { id: 10, name: "morphling", localized_name: "Morphling", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Escape", "Durable", "Nuker"] },
  11: { id: 11, name: "nevermore", localized_name: "Shadow Fiend", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Nuker"] },
  12: { id: 12, name: "phantom_lancer", localized_name: "Phantom Lancer", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Escape", "Pusher"] },
  13: { id: 13, name: "puck", localized_name: "Puck", primary_attr: "int", attack_type: "Ranged", roles: ["Initiator", "Disabler", "Escape", "Nuker"] },
  14: { id: 14, name: "pudge", localized_name: "Pudge", primary_attr: "str", attack_type: "Melee", roles: ["Disabler", "Initiator", "Durable", "Nuker"] },
  15: { id: 15, name: "razor", localized_name: "Razor", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Durable", "Nuker", "Pusher"] },
  16: { id: 16, name: "sand_king", localized_name: "Sand King", primary_attr: "all", attack_type: "Melee", roles: ["Initiator", "Disabler", "Support", "Nuker", "Escape"] },
  17: { id: 17, name: "storm_spirit", localized_name: "Storm Spirit", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Escape", "Nuker", "Initiator", "Disabler"] },
  18: { id: 18, name: "sven", localized_name: "Sven", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Disabler", "Initiator", "Durable", "Nuker"] },
  19: { id: 19, name: "tiny", localized_name: "Tiny", primary_attr: "str", attack_type: "Melee", roles: ["Initiator", "Nuker", "Carry", "Durable"] },
  20: { id: 20, name: "vengefulspirit", localized_name: "Vengeful Spirit", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Initiator", "Disabler", "Nuker", "Escape"] },
  21: { id: 21, name: "windrunner", localized_name: "Windranger", primary_attr: "all", attack_type: "Ranged", roles: ["Carry", "Support", "Disabler", "Escape", "Nuker"] },
  22: { id: 22, name: "zuus", localized_name: "Zeus", primary_attr: "int", attack_type: "Ranged", roles: ["Nuker", "Carry"] },
  23: { id: 23, name: "kunkka", localized_name: "Kunkka", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Support", "Disabler", "Initiator", "Durable", "Nuker"] },
  25: { id: 25, name: "lina", localized_name: "Lina", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Carry", "Nuker", "Disabler"] },
  26: { id: 26, name: "lion", localized_name: "Lion", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Disabler", "Nuker", "Initiator"] },
  27: { id: 27, name: "shadow_shaman", localized_name: "Shadow Shaman", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Pusher", "Disabler", "Nuker", "Initiator"] },
  28: { id: 28, name: "slardar", localized_name: "Slardar", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Durable", "Initiator", "Disabler", "Escape"] },
  29: { id: 29, name: "tidehunter", localized_name: "Tidehunter", primary_attr: "str", attack_type: "Melee", roles: ["Initiator", "Durable", "Disabler", "Support"] },
  30: { id: 30, name: "witch_doctor", localized_name: "Witch Doctor", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Nuker", "Disabler"] },
  31: { id: 31, name: "lich", localized_name: "Lich", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Nuker"] },
  32: { id: 32, name: "riki", localized_name: "Riki", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Escape", "Disabler"] },
  33: { id: 33, name: "enigma", localized_name: "Enigma", primary_attr: "all", attack_type: "Ranged", roles: ["Disabler", "Jungler", "Initiator", "Pusher"] },
  34: { id: 34, name: "tinker", localized_name: "Tinker", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Nuker", "Pusher"] },
  35: { id: 35, name: "sniper", localized_name: "Sniper", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Nuker"] },
  36: { id: 36, name: "necrolyte", localized_name: "Necrophos", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Nuker", "Durable", "Disabler"] },
  37: { id: 37, name: "warlock", localized_name: "Warlock", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Initiator", "Disabler"] },
  38: { id: 38, name: "beastmaster", localized_name: "Beastmaster", primary_attr: "all", attack_type: "Melee", roles: ["Initiator", "Disabler", "Durable", "Nuker"] },
  39: { id: 39, name: "queenofpain", localized_name: "Queen of Pain", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Nuker", "Escape"] },
  40: { id: 40, name: "venomancer", localized_name: "Venomancer", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Nuker", "Initiator", "Pusher", "Disabler"] },
  41: { id: 41, name: "faceless_void", localized_name: "Faceless Void", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Initiator", "Disabler", "Escape", "Durable"] },
  42: { id: 42, name: "skeleton_king", localized_name: "Wraith King", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Support", "Durable", "Disabler", "Initiator"] },
  43: { id: 43, name: "death_prophet", localized_name: "Death Prophet", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Pusher", "Nuker", "Durable"] },
  44: { id: 44, name: "phantom_assassin", localized_name: "Phantom Assassin", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Escape"] },
  45: { id: 45, name: "pugna", localized_name: "Pugna", primary_attr: "int", attack_type: "Ranged", roles: ["Nuker", "Pusher"] },
  46: { id: 46, name: "templar_assassin", localized_name: "Templar Assassin", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Escape"] },
  47: { id: 47, name: "viper", localized_name: "Viper", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Durable", "Initiator", "Disabler"] },
  48: { id: 48, name: "luna", localized_name: "Luna", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Nuker", "Pusher"] },
  49: { id: 49, name: "dragon_knight", localized_name: "Dragon Knight", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Pusher", "Durable", "Disabler", "Initiator", "Nuker"] },
  50: { id: 50, name: "dazzle", localized_name: "Dazzle", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Nuker", "Disabler"] },
  51: { id: 51, name: "rattletrap", localized_name: "Clockwerk", primary_attr: "all", attack_type: "Melee", roles: ["Initiator", "Disabler", "Durable", "Nuker"] },
  52: { id: 52, name: "leshrac", localized_name: "Leshrac", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Support", "Nuker", "Pusher", "Disabler"] },
  53: { id: 53, name: "furion", localized_name: "Nature's Prophet", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Jungler", "Pusher", "Escape", "Nuker"] },
  54: { id: 54, name: "life_stealer", localized_name: "Lifestealer", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Durable", "Escape", "Disabler"] },
  55: { id: 55, name: "dark_seer", localized_name: "Dark Seer", primary_attr: "all", attack_type: "Melee", roles: ["Initiator", "Jungler", "Escape", "Disabler"] },
  56: { id: 56, name: "clinkz", localized_name: "Clinkz", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Escape", "Pusher"] },
  57: { id: 57, name: "omniknight", localized_name: "Omniknight", primary_attr: "str", attack_type: "Melee", roles: ["Support", "Durable", "Nuker"] },
  58: { id: 58, name: "enchantress", localized_name: "Enchantress", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Jungler", "Pusher", "Durable", "Disabler"] },
  59: { id: 59, name: "huskar", localized_name: "Huskar", primary_attr: "str", attack_type: "Ranged", roles: ["Carry", "Durable", "Initiator"] },
  60: { id: 60, name: "night_stalker", localized_name: "Night Stalker", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Initiator", "Durable", "Disabler", "Nuker"] },
  61: { id: 61, name: "broodmother", localized_name: "Broodmother", primary_attr: "all", attack_type: "Melee", roles: ["Carry", "Pusher", "Escape", "Nuker"] },
  62: { id: 62, name: "bounty_hunter", localized_name: "Bounty Hunter", primary_attr: "agi", attack_type: "Melee", roles: ["Escape", "Nuker"] },
  63: { id: 63, name: "weaver", localized_name: "Weaver", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Escape"] },
  64: { id: 64, name: "jakiro", localized_name: "Jakiro", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Nuker", "Pusher", "Disabler"] },
  65: { id: 65, name: "batrider", localized_name: "Batrider", primary_attr: "all", attack_type: "Ranged", roles: ["Initiator", "Jungler", "Disabler", "Escape"] },
  66: { id: 66, name: "chen", localized_name: "Chen", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Jungler", "Pusher"] },
  67: { id: 67, name: "spectre", localized_name: "Spectre", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Durable", "Escape"] },
  68: { id: 68, name: "ancient_apparition", localized_name: "Ancient Apparition", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Disabler", "Nuker"] },
  69: { id: 69, name: "doom_bringer", localized_name: "Doom", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Disabler", "Initiator", "Durable", "Nuker"] },
  70: { id: 70, name: "ursa", localized_name: "Ursa", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Jungler", "Durable", "Disabler"] },
  71: { id: 71, name: "spirit_breaker", localized_name: "Spirit Breaker", primary_attr: "str", attack_type: "Melee", roles: ["Initiator", "Durable", "Disabler", "Escape"] },
  72: { id: 72, name: "gyrocopter", localized_name: "Gyrocopter", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Nuker", "Disabler"] },
  73: { id: 73, name: "alchemist", localized_name: "Alchemist", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Support", "Durable", "Disabler", "Nuker"] },
  74: { id: 74, name: "invoker", localized_name: "Invoker", primary_attr: "all", attack_type: "Ranged", roles: ["Carry", "Nuker", "Disabler", "Escape", "Pusher"] },
  75: { id: 75, name: "silencer", localized_name: "Silencer", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Support", "Disabler", "Initiator", "Nuker"] },
  76: { id: 76, name: "obsidian_destroyer", localized_name: "Outworld Destroyer", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Nuker", "Disabler"] },
  77: { id: 77, name: "lycan", localized_name: "Lycan", primary_attr: "all", attack_type: "Melee", roles: ["Carry", "Pusher", "Jungler", "Durable", "Escape"] },
  78: { id: 78, name: "brewmaster", localized_name: "Brewmaster", primary_attr: "all", attack_type: "Melee", roles: ["Carry", "Initiator", "Durable", "Disabler", "Nuker"] },
  79: { id: 79, name: "shadow_demon", localized_name: "Shadow Demon", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Disabler", "Initiator", "Nuker"] },
  80: { id: 80, name: "lone_druid", localized_name: "Lone Druid", primary_attr: "all", attack_type: "Ranged", roles: ["Carry", "Pusher", "Jungler", "Durable"] },
  81: { id: 81, name: "chaos_knight", localized_name: "Chaos Knight", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Disabler", "Durable", "Pusher", "Initiator"] },
  82: { id: 82, name: "meepo", localized_name: "Meepo", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Escape", "Nuker", "Disabler", "Initiator", "Pusher"] },
  83: { id: 83, name: "treant", localized_name: "Treant Protector", primary_attr: "str", attack_type: "Melee", roles: ["Support", "Initiator", "Durable", "Disabler", "Escape"] },
  84: { id: 84, name: "ogre_magi", localized_name: "Ogre Magi", primary_attr: "str", attack_type: "Melee", roles: ["Support", "Nuker", "Disabler", "Durable", "Initiator"] },
  85: { id: 85, name: "undying", localized_name: "Undying", primary_attr: "str", attack_type: "Melee", roles: ["Support", "Durable", "Disabler", "Nuker"] },
  86: { id: 86, name: "rubick", localized_name: "Rubick", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Disabler", "Nuker"] },
  87: { id: 87, name: "disruptor", localized_name: "Disruptor", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Disabler", "Nuker", "Initiator"] },
  88: { id: 88, name: "nyx_assassin", localized_name: "Nyx Assassin", primary_attr: "all", attack_type: "Melee", roles: ["Disabler", "Nuker", "Initiator", "Escape"] },
  89: { id: 89, name: "naga_siren", localized_name: "Naga Siren", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Support", "Pusher", "Disabler", "Initiator", "Escape"] },
  90: { id: 90, name: "keeper_of_the_light", localized_name: "Keeper of the Light", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Nuker", "Disabler"] },
  91: { id: 91, name: "wisp", localized_name: "Io", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Escape", "Nuker"] },
  92: { id: 92, name: "visage", localized_name: "Visage", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Nuker", "Durable", "Disabler", "Pusher"] },
  93: { id: 93, name: "slark", localized_name: "Slark", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Escape", "Disabler", "Nuker"] },
  94: { id: 94, name: "medusa", localized_name: "Medusa", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Disabler", "Durable"] },
  95: { id: 95, name: "troll_warlord", localized_name: "Troll Warlord", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Pusher", "Disabler", "Durable"] },
  96: { id: 96, name: "centaur", localized_name: "Centaur Warrunner", primary_attr: "str", attack_type: "Melee", roles: ["Initiator", "Durable", "Disabler", "Nuker"] },
  97: { id: 97, name: "magnataur", localized_name: "Magnus", primary_attr: "all", attack_type: "Melee", roles: ["Initiator", "Disabler", "Nuker", "Escape"] },
  98: { id: 98, name: "shredder", localized_name: "Timbersaw", primary_attr: "all", attack_type: "Melee", roles: ["Nuker", "Durable", "Escape"] },
  99: { id: 99, name: "bristleback", localized_name: "Bristleback", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Durable", "Initiator", "Nuker"] },
  100: { id: 100, name: "tusk", localized_name: "Tusk", primary_attr: "str", attack_type: "Melee", roles: ["Initiator", "Disabler", "Nuker"] },
  101: { id: 101, name: "skywrath_mage", localized_name: "Skywrath Mage", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Nuker", "Disabler"] },
  102: { id: 102, name: "abaddon", localized_name: "Abaddon", primary_attr: "all", attack_type: "Melee", roles: ["Support", "Carry", "Durable"] },
  103: { id: 103, name: "elder_titan", localized_name: "Elder Titan", primary_attr: "str", attack_type: "Melee", roles: ["Initiator", "Disabler", "Nuker", "Durable"] },
  104: { id: 104, name: "legion_commander", localized_name: "Legion Commander", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Disabler", "Initiator", "Durable", "Nuker"] },
  105: { id: 105, name: "techies", localized_name: "Techies", primary_attr: "all", attack_type: "Ranged", roles: ["Nuker", "Disabler"] },
  106: { id: 106, name: "ember_spirit", localized_name: "Ember Spirit", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Escape", "Nuker", "Disabler", "Initiator"] },
  107: { id: 107, name: "earth_spirit", localized_name: "Earth Spirit", primary_attr: "str", attack_type: "Melee", roles: ["Nuker", "Escape", "Disabler", "Initiator", "Durable"] },
  108: { id: 108, name: "abyssal_underlord", localized_name: "Underlord", primary_attr: "str", attack_type: "Melee", roles: ["Support", "Durable", "Nuker", "Disabler", "Escape"] },
  109: { id: 109, name: "terrorblade", localized_name: "Terrorblade", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Pusher", "Nuker"] },
  110: { id: 110, name: "phoenix", localized_name: "Phoenix", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Nuker", "Initiator", "Escape", "Disabler"] },
  111: { id: 111, name: "oracle", localized_name: "Oracle", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Nuker", "Disabler", "Escape"] },
  112: { id: 112, name: "winter_wyvern", localized_name: "Winter Wyvern", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Disabler", "Nuker"] },
  113: { id: 113, name: "arc_warden", localized_name: "Arc Warden", primary_attr: "agi", attack_type: "Ranged", roles: ["Carry", "Escape", "Nuker"] },
  114: { id: 114, name: "monkey_king", localized_name: "Monkey King", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Escape", "Disabler", "Initiator"] },
  119: { id: 119, name: "dark_willow", localized_name: "Dark Willow", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Nuker", "Disabler", "Escape"] },
  120: { id: 120, name: "pangolier", localized_name: "Pangolier", primary_attr: "all", attack_type: "Melee", roles: ["Carry", "Nuker", "Disabler", "Durable", "Escape", "Initiator"] },
  121: { id: 121, name: "grimstroke", localized_name: "Grimstroke", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Nuker", "Disabler", "Escape"] },
  123: { id: 123, name: "hoodwink", localized_name: "Hoodwink", primary_attr: "agi", attack_type: "Ranged", roles: ["Support", "Nuker", "Escape", "Disabler"] },
  126: { id: 126, name: "void_spirit", localized_name: "Void Spirit", primary_attr: "all", attack_type: "Melee", roles: ["Carry", "Escape", "Nuker", "Disabler"] },
  128: { id: 128, name: "snapfire", localized_name: "Snapfire", primary_attr: "all", attack_type: "Ranged", roles: ["Support", "Nuker", "Disabler", "Escape"] },
  129: { id: 129, name: "mars", localized_name: "Mars", primary_attr: "str", attack_type: "Melee", roles: ["Initiator", "Durable", "Disabler"] },
  135: { id: 135, name: "dawnbreaker", localized_name: "Dawnbreaker", primary_attr: "str", attack_type: "Melee", roles: ["Carry", "Durable"] },
  136: { id: 136, name: "marci", localized_name: "Marci", primary_attr: "all", attack_type: "Melee", roles: ["Support", "Carry", "Initiator", "Disabler", "Escape"] },
  137: { id: 137, name: "primal_beast", localized_name: "Primal Beast", primary_attr: "str", attack_type: "Melee", roles: ["Initiator", "Durable", "Disabler"] },
  138: { id: 138, name: "muerta", localized_name: "Muerta", primary_attr: "int", attack_type: "Ranged", roles: ["Carry", "Nuker", "Disabler"] },
  145: { id: 145, name: "ringmaster", localized_name: "Ringmaster", primary_attr: "int", attack_type: "Ranged", roles: ["Support", "Nuker", "Disabler", "Escape"] },
  146: { id: 146, name: "kez", localized_name: "Kez", primary_attr: "agi", attack_type: "Melee", roles: ["Carry", "Escape", "Nuker"] },
};

export const COMMON_ITEMS_MAP: Record<number, string> = {
  1: "blink", 2: "blades_of_attack", 3: "broadsword", 4: "chainmail", 5: "claymore",
  6: "helm_of_iron_will", 7: "javelin", 8: "mithril_hammer", 9: "platemail", 10: "quarterstaff",
  11: "quelling_blade", 12: "ring_of_protection", 13: "gauntlets", 14: "slippers", 15: "mantle",
  16: "branches", 17: "belt_of_strength", 18: "boots_of_elves", 19: "robe", 20: "circlet",
  21: "ogre_axe", 22: "blade_of_alacrity", 23: "staff_of_wizardry", 24: "ultimate_orb",
  25: "gloves", 26: "lifesteal", 27: "ring_of_regen", 28: "sobi_mask", 29: "boots",
  30: "gem", 31: "cloak", 32: "talisman_of_evasion", 33: "cheese", 34: "magic_stick",
  36: "magic_wand", 38: "clarity", 39: "flask", 40: "dust", 41: "bottle", 42: "ward_observer",
  43: "ward_sentry", 44: "tango", 45: "courier", 46: "tpscroll", 63: "power_treads",
  65: "hand_of_midas", 69: "pers", 73: "bracer", 75: "wraith_band", 77: "null_talisman",
  79: "mekansm", 81: "vladmir", 86: "buckler", 88: "ring_of_basilius", 90: "pipe",
  92: "urn_of_shadows", 96: "sheepstick", 98: "orchid", 100: "cyclone", 102: "force_staff",
  104: "dagon", 108: "ultimate_scepter", 110: "refresher", 112: "assault", 114: "heart",
  116: "black_king_bar", 118: "aegis", 121: "shivas_guard", 123: "bloodstone", 125: "sphere",
  127: "vanguard", 131: "hood_of_defiance", 133: "blade_mail", 135: "monkey_king_bar",
  137: "radiance", 139: "butterfly", 141: "greater_crit", 143: "basher", 145: "bfury",
  147: "manta", 149: "lesser_crit", 151: "armlet", 152: "invis_sword", 154: "sange_and_yasha",
  156: "satanic", 158: "mjollnir", 160: "skadi", 162: "sange", 164: "helm_of_the_dominator",
  166: "maelstrom", 168: "desolator", 170: "yasha", 172: "mask_of_madness", 174: "diffusal_blade",
  176: "ethereal_blade", 178: "soul_ring", 180: "arcane_boots", 181: "orb_of_venom",
  182: "stout_shield", 185: "drum_of_endurance", 187: "medallion_of_courage", 188: "smoke_of_deceit",
  190: "veil_of_discord", 201: "dagon_2", 202: "dagon_3", 203: "dagon_4", 204: "dagon_5",
  206: "rod_of_atos", 208: "abyssal_blade", 210: "heavens_halberd", 212: "ring_of_aquila",
  214: "tranquil_boots", 215: "shadow_amulet", 218: "glimmer_cape", 220: "travel_boots_2",
  226: "lotus_orb", 229: "solar_crest", 231: "guardian_greaves", 232: "octarine_core",
  235: "moon_shard", 236: "silver_edge", 242: "crimson_guard", 244: "wind_lace",
  247: "moon_shard", 249: "silver_edge", 250: "bloodthorn", 252: "echo_sabre",
  254: "glimmer_cape", 256: "aeon_disk", 259: "kaya", 261: "crown", 263: "meteor_hammer",
  265: "nullifier", 267: "spirit_vessel", 269: "holy_locket", 271: "kaya_and_sange",
  273: "yasha_and_kaya", 277: "ring_of_tarrasque", 534: "falcon_blade", 569: "orb_of_corrosion",
  570: "witch_blade", 571: "revenants_brooch", 609: "mage_slayer", 635: "swift_blink",
  637: "arcane_blink", 638: "overwhelming_blink", 640: "harpoon", 653: "phylactery",
  655: "khanda", 692: "wind_waker", 1097: "disperser", 1100: "parasma",
  // Neutral Items
  287: "keen_optic", 288: "ironwood_tree", 289: "iron_talon", 290: "royal_jelly", 291: "poor_mans_shield",
  304: "faded_broach", 305: "paladin_sword", 306: "minotaur_horn", 307: "orb_of_destruction", 309: "apex",
  310: "ballista", 311: "woodland_striders", 325: "prince_knife", 326: "spider_legs", 328: "force_boots",
  330: "havoc_hammer", 334: "broom_handle", 335: "trusty_shovel", 354: "ocean_heart", 356: "trusty_shovel",
  357: "nether_shawl", 358: "dragon_scale", 359: "essence_ring", 360: "vambrace", 361: "grove_bow",
  362: "philosophers_stone", 363: "pupils_gift", 364: "quickening_charm", 365: "spy_gadget", 366: "titan_sliver",
  367: "mind_breaker", 368: "ninja_gear", 369: "illusionsts_cape", 370: "havoc_hammer", 371: "magic_lamp",
  372: "witless_shako", 373: "timeless_relic", 374: "spell_prism", 375: "pirate_hat", 376: "dimensional_doorway",
  377: "ex_machina", 674: "elven_tunic", 675: "cloak_of_flames", 676: "ceremonial_robe", 677: "quicksilver_amulet",
  678: "bullwhip", 679: "psychic_headband", 680: "ceremonial_robe", 686: "stormcrafter", 691: "penta_edged_sword",
  824: "assassins_dagger", 825: "ascetic_cap", 828: "misericorde", 829: "witchbane", 834: "pig_pole",
  835: "tumblers_toy", 836: "brigands_blade", 837: "flicker", 849: "spark_of_courage", 940: "seeds_of_serenity",
  945: "lance_of_pursuit", 946: "occult_bracelet", 947: "eye_of_the_vizier", 948: "specialists_array",
  949: "dagger_of_ristul", 1076: "duelist_gloves", 1077: "spark_of_courage", 1122: "safety_bubble",
  1123: "royal_jelly", 1124: "light_collector", 1125: "whisper_of_the_dread", 1126: "nemesis_curse",
  1127: "avianas_feather", 1128: "unwavering_condition"
};

export function getHero(id: number): DotaHero {
  return HEROES_MAP[id] || {
    id,
    name: "unknown",
    localized_name: `Hero #${id}`,
    primary_attr: "all",
    attack_type: "Melee",
    roles: ["Hero"]
  };
}

export function getHeroImageUrl(heroId: number): string {
  const hero = HEROES_MAP[heroId];
  if (!hero || !hero.name || hero.name === "unknown") {
    return "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png";
  }
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.name}.png`;
}

export function getItemImageUrl(itemId: number | string | null | undefined): string | null {
  if (!itemId || itemId === 0 || itemId === '0') return null;
  if (typeof itemId === 'number') {
    const itemName = COMMON_ITEMS_MAP[itemId];
    if (itemName) {
      return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${itemName}.png`;
    }
    return null;
  }
  const clean = itemId.replace(/^item_/, '').trim();
  if (!clean || clean === '0' || clean === 'empty') return null;
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${clean}.png`;
}

export const PRESET_MATCHES = [
  {
    id: "6227289873",
    label: "TI10 Grand Finals - Game 5",
    sublabel: "Team Spirit vs PSG.LGD (Magnus Collapse legend)",
    heroId: 97, // Magnus
    heroName: "Magnus",
    duration: "36:47",
    winner: "Radiant (Team Spirit)"
  },
  {
    id: "4078568619",
    label: "TI8 Grand Finals - Game 5",
    sublabel: "OG vs PSG.LGD (Topson Zeus & Ana Ember)",
    heroId: 106, // Ember Spirit
    heroName: "Ember Spirit",
    duration: "36:28",
    winner: "Radiant (OG)"
  },
  {
    id: "4991487376",
    label: "TI9 Grand Finals - Game 4",
    sublabel: "OG vs Team Liquid (Ana IO Carry destruction)",
    heroId: 91, // Io
    heroName: "Io",
    duration: "24:32",
    winner: "Dire (OG)"
  },
  {
    id: "7864321980",
    label: "Immortal Ranked Pub Match",
    sublabel: "Rank #100 EU Carry Anti-Mage High Stakes",
    heroId: 1, // Anti-Mage
    heroName: "Anti-Mage",
    duration: "42:15",
    winner: "Radiant"
  }
];
