export interface Character {
  owner: string;
  name: string;
  char_class: string;
  level: string;
  exp: string;
  hp: string;
  max_hp: string;
  stat_str: string;
  stat_dex: string;
  stat_int: string;
  stat_wis: string;
  is_alive: boolean;
  victories: string;
  created_at: string;
}

export interface Item {
  id: string;
  name: string;
  owner: string;
  item_type: "weapon" | "armor" | "consumable" | "treasure" | "victory_token";
  description: string;
  power: string;
  is_consumed: boolean;
}

export interface Game {
  id: string;
  player: string;
  adventure_id: string;
  current_room: string;
  total_rooms: string;
  turn_count: string;
  is_active: boolean;
  is_victory: boolean;
  started_at: string;
  last_action_at: string;
  state_json: string;
}

export interface LogEntry {
  type: "intro" | "action" | "system" | "combat" | "loot";
  action?: string;
  narrative: string;
  outcome?: string;
  dice_rolls?: DiceRoll[];
  hp_change?: number;
  monster_hp_change?: number;
  loot_dropped?: string[];
  timestamp: number;
}

export interface DiceRoll {
  die: string;
  result: number;
  modifier: number;
  total: number;
  dc?: number;
  purpose: string;
}

export interface GameState {
  current_monster: { name: string; hp: number; max_hp: number; ac: number } | null;
  room_description: string;
  rooms_cleared: number;
  boss_name?: string;
}

export const ALLOWED_CLASSES = ["warrior", "rogue", "mage", "cleric"] as const;
export type CharClass = (typeof ALLOWED_CLASSES)[number];

export const CLASS_LABELS: Record<CharClass, string> = {
  warrior: "Warrior",
  rogue: "Rogue",
  mage: "Mage",
  cleric: "Cleric",
};

export const CLASS_STATS: Record<CharClass, { str: number; dex: number; int: number; wis: number }> = {
  warrior: { str: 16, dex: 12, int: 8, wis: 10 },
  rogue: { str: 10, dex: 16, int: 12, wis: 8 },
  mage: { str: 8, dex: 12, int: 16, wis: 14 },
  cleric: { str: 12, dex: 10, int: 10, wis: 16 },
};

export const CLASS_HP: Record<CharClass, number> = {
  warrior: 14,
  rogue: 11,
  mage: 8,
  cleric: 12,
};

export interface Adventure {
  id: string;
  name: string;
  intro: string;
  rooms: number;
  boss: string;
  difficulty: number;
}

export const ADVENTURES: Adventure[] = [
  {
    id: "goblin_cave",
    name: "Goblin Cave",
    intro: "A dank cave entrance reeks of unwashed goblins. Torchlight flickers within.",
    rooms: 4,
    boss: "Goblin Chieftain",
    difficulty: 1,
  },
  {
    id: "haunted_crypt",
    name: "Haunted Crypt",
    intro: "Ancient stones whisper. Something undead stirs below.",
    rooms: 5,
    boss: "Lich Acolyte",
    difficulty: 2,
  },
  {
    id: "dragons_lair",
    name: "Dragon's Lair",
    intro: "Heat radiates from the cavern. Glittering treasure dazzles, but a deep growl warns of doom.",
    rooms: 6,
    boss: "Young Red Dragon",
    difficulty: 3,
  },
];
