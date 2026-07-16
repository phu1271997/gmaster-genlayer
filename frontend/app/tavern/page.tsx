"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import CharacterCreator from "@/components/CharacterCreator";
import CharacterSheet from "@/components/CharacterSheet";
import AdventureSelector from "@/components/AdventureSelector";
import { Character } from "@/lib/game-types";
import { writeContract, readContract, getAccount } from "@/lib/genlayer";
import { Swords, Scroll } from "lucide-react";

export default function TavernPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [startingAdventure, setStartingAdventure] = useState<string | null>(null);
  const [showDead, setShowDead] = useState(false);

  const loadCharacter = useCallback(async () => {
    const addr = getAccount();
    try {
      const char = (await readContract("get_character", [addr])) as Character;
      setCharacter(char);
      if (char && !char.is_alive) {
        setShowDead(true);
      }
    } catch {
      setCharacter(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCharacter();
    const handler = () => loadCharacter();
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [loadCharacter]);

  const handleCreate = async (name: string, charClass: string) => {
    setCreating(true);
    try {
      await writeContract("create_character", [name, charClass]);
      toast.success("Hero forged in the fires of creation!");
      await loadCharacter();
    } catch (e: unknown) {
      const msg = parseContractError(e);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  function parseContractError(err: unknown): string {
    const raw = err instanceof Error ? err.message : String(err);
    if (raw.includes("UserError:")) {
      const match = raw.match(/UserError:\s*([^"\\]+)/);
      if (match) return match[1].trim();
    }
    if (raw.includes("already have a living character")) {
      return "You already have an active hero. Use the existing one!";
    }
    if (raw.includes("Name must be 1-32 characters")) {
      return "Hero name must be 1-32 characters";
    }
    if (raw.includes("Invalid class")) {
      return "Please select a valid class";
    }
    if (raw.includes("Contract address not configured")) {
      return "App misconfigured — no contract address set.";
    }
    if (raw.includes("insufficient funds") || raw.includes("insufficient balance")) {
      return "Your local hero account has no GEN. Fund it from the studionet faucet.";
    }
    if (raw.includes("Network") || raw.includes("fetch")) {
      return "Cannot reach GenLayer studionet RPC. Check your connection and retry.";
    }
    return `The forge refused: ${raw.slice(0, 200)}`;
  }

  const handleStartAdventure = async (adventureId: string) => {
    setStartingAdventure(adventureId);
    try {
      await writeContract("start_adventure", [adventureId]);
      toast.success("Adventure begun! Step carefully...");
      // start_adventure return value not exposed via receipt; look up newest active game
      const addr = getAccount();
      const activeGameId = (await readContract("get_active_game_for_player", [addr])) as string | number | bigint;
      router.push(`/adventure/${String(activeGameId ?? "0")}`);
    } catch (e: unknown) {
      const msg = parseContractError(e);
      toast.error(msg);
      setStartingAdventure(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-amber-900/20">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-amber-400 tracking-wider font-[MedievalSharp]">GMaster</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/inventory")}
            className="text-sm text-amber-300/60 hover:text-amber-300 transition-colors"
          >
            Inventory
          </button>
          <button
            onClick={() => router.push("/hall-of-fame")}
            className="text-sm text-amber-300/60 hover:text-amber-300 transition-colors"
          >
            Hall of Fame
          </button>
          <ConnectWalletButton />
        </div>
      </nav>

      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-amber-400 tracking-wider font-[MedievalSharp]">
            The Adventurer&apos;s Tavern
          </h1>
          <p className="text-amber-200/50 text-sm mt-1">Rest, prepare, and choose your next quest.</p>
        </div>

        {loading ? (
          <div className="space-y-4 max-w-md mx-auto">
            <Skeleton className="h-32 w-full bg-amber-950/40" />
            <Skeleton className="h-8 w-48 mx-auto bg-amber-950/40" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!character || (character && !character.is_alive) ? (
              <motion.div
                key="creator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {showDead && character && (
                  <div className="mb-8 text-center space-y-4">
                    <p className="text-red-400/80 text-lg font-[MedievalSharp]">
                      {character.name} has fallen in battle.
                    </p>
                    <p className="text-amber-200/40 text-sm">
                      Heroes never truly die — only their bodies rest. Forge anew.
                    </p>
                  </div>
                )}
                <CharacterCreator onCreate={handleCreate} isLoading={creating} />
              </motion.div>
            ) : (
              <motion.div
                key="tavern"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="rounded-lg border border-amber-900/30 bg-[#1A1410]/60 p-6">
                  <CharacterSheet character={character} />
                </div>
                <AdventureSelector
                  onSelect={handleStartAdventure}
                  isLoading={startingAdventure}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
