"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import GameLog from "@/components/GameLog";
import ActionInput from "@/components/ActionInput";
import CharacterSheet from "@/components/CharacterSheet";
import CombatPanel from "@/components/CombatPanel";
import InventoryGrid from "@/components/InventoryGrid";
import DeathScreen from "@/components/DeathScreen";
import VictoryScreen from "@/components/VictoryScreen";
import {
  Game,
  Character,
  Item,
  LogEntry,
  GameState,
  ADVENTURES,
} from "@/lib/game-types";
import { writeContract, readContract, account } from "@/lib/genlayer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Swords, Home, Backpack, Heart, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdventurePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = String(params.gameId ?? "");

  const [game, setGame] = useState<Game | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [lastMonsterDamage, setLastMonsterDamage] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addr = account();

  const loadGame = useCallback(async () => {
    if (!gameId) return;
    try {
      const g = (await readContract("get_game", [gameId])) as Game;
      const c = addr ? ((await readContract("get_character", [addr])) as Character) : null;
      const logRaw = (await readContract("get_event_log", [gameId])) as string;
      const inv = addr ? ((await readContract("get_player_items", [addr])) as Item[]) : [];

      const parsedLog: LogEntry[] = JSON.parse(logRaw || "[]");
      setGame(g);
      setCharacter(c);
      setLogEntries(parsedLog);
      setItems(inv);

      // Detect monster damage from latest entry
      const last = parsedLog[parsedLog.length - 1];
      if (last?.monster_hp_change) {
        setLastMonsterDamage(last.monster_hp_change);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }, [gameId, addr]);

  useEffect(() => {
    loadGame();
    pollRef.current = setInterval(loadGame, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadGame]);

  const handleAction = async (action: string) => {
    setActionLoading(true);
    try {
      await writeContract("take_action", [gameId, action]);
      toast.success("The DM has spoken. The chain seals your fate...");
      await loadGame();
    } catch (e: any) {
      toast.error(e?.message || "The DM is displeased. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUseItem = async (item: Item) => {
    if (!gameId) return;
    try {
      await writeContract("use_item", [item.id, gameId]);
      toast.success(`You used ${item.name}.`);
      await loadGame();
    } catch (e: any) {
      toast.error(e?.message || "Could not use item.");
    }
  };

  const handleRevive = () => router.push("/tavern");

  const adventure = game ? ADVENTURES.find((a) => a.id === game.adventure_id) : null;
  let gameState: GameState | null = null;
  try {
    gameState = game ? (JSON.parse(game.state_json) as GameState) : null;
  } catch {
    gameState = null;
  }

  const hp = character ? parseInt(character.hp, 10) : 0;
  const maxHp = character ? parseInt(character.max_hp, 10) : 1;
  const hpPct = maxHp > 0 ? (hp / maxHp) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0808] text-amber-400">
        <div className="flex flex-col items-center gap-3">
          <Swords className="w-8 h-8 animate-spin" />
          <p className="text-sm text-amber-200/60">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0808] text-amber-200/60">
        <div className="text-center space-y-4">
          <p>Adventure not found.</p>
          <Button onClick={() => router.push("/tavern")} variant="outline" className="border-amber-800 text-amber-300">
            <Home className="w-4 h-4 mr-2" /> Return to Tavern
          </Button>
        </div>
      </div>
    );
  }

  const isDead = character ? !character.is_alive : false;
  const isVictory = game.is_victory;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0808] paper-texture">
      {/* Top bar */}
      <header className="border-b border-amber-900/30 px-4 py-3 flex items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/tavern")} className="text-amber-400/60 hover:text-amber-300 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm text-amber-200/60">
            <Swords className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-amber-100">{character?.name ?? "Unknown"}</span>
            <span className="capitalize text-amber-400/70">({character?.char_class ?? "?"})</span>
          </div>
        </div>

        <div className="flex-1 max-w-xs mx-4">
          <div className="flex justify-between text-xs text-red-300/70 mb-0.5">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />HP</span>
            <span>{hp}/{maxHp}</span>
          </div>
          <Progress value={hpPct} className="h-2 bg-red-950 [&>div]:bg-red-600" />
        </div>

        <div className="text-right">
          <div className="text-xs text-amber-300/60">Room {parseInt(game.current_room, 10)} of {parseInt(game.total_rooms, 10)}</div>
          <div className="text-xs text-amber-200/40">Turn {parseInt(game.turn_count, 10)}</div>
        </div>
      </header>

      {/* Main gameplay */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Game Log */}
        <div className="flex-1 min-h-[40vh] lg:min-h-0 p-4 flex flex-col">
          <h2 className="text-sm font-bold text-amber-400/70 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Chronicle
          </h2>
          <div className="flex-1 rounded-lg overflow-hidden border border-amber-900/20">
            <GameLog entries={logEntries} />
          </div>
        </div>

        {/* Right: HUD */}
        <div className="w-full lg:w-[380px] border-l border-amber-900/20 p-4 space-y-4 overflow-y-auto">
          <CombatPanel
            monster={gameState?.current_monster ?? null}
            lastDamage={lastMonsterDamage}
          />

          <div>
            <h3 className="text-xs font-bold text-amber-400/60 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Backpack className="w-4 h-4" /> Inventory
            </h3>
            <InventoryGrid items={items} onUse={handleUseItem} compact />
          </div>

          <div className="pt-4 border-t border-amber-900/20">
            <ActionInput
              onSubmit={handleAction}
              disabled={!game.is_active || isDead}
              loading={actionLoading}
              quickActions={["Look around", "Check inventory", "Attack", "Sneak forward", "Cast spell"]}
            />
          </div>
        </div>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {isDead && <DeathScreen onRevive={handleRevive} />}
        {isVictory && (
          <VictoryScreen
            adventureName={adventure?.name}
            onReturn={() => router.push("/tavern")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
