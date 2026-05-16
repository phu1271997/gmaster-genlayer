"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import CharacterSheet from "@/components/CharacterSheet";
import InventoryGrid from "@/components/InventoryGrid";
import { Character, Item } from "@/lib/game-types";
import { readContract, account } from "@/lib/genlayer";
import { Backpack, ArrowLeft } from "lucide-react";

export default function InventoryPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const addr = account();
    if (!addr) {
      setLoading(false);
      return;
    }
    try {
      const [char, inv] = await Promise.all([
        readContract("get_character", [addr]) as Promise<Character>,
        readContract("get_player_items", [addr]) as Promise<Item[]>,
      ]);
      setCharacter(char);
      setItems(inv);
    } catch {
      setCharacter(null);
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0808] paper-texture">
      <header className="px-6 py-4 border-b border-amber-900/20 flex items-center justify-between">
        <button
          onClick={() => router.push("/tavern")}
          className="flex items-center gap-2 text-amber-300/60 hover:text-amber-300 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tavern
        </button>
        <h1 className="font-bold text-amber-400 tracking-wider font-[MedievalSharp]">Inventory &amp; Character</h1>
      </header>

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full space-y-8">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full bg-amber-950/40" />
            <Skeleton className="h-64 w-full bg-amber-950/40" />
          </div>
        ) : !character ? (
          <div className="text-center text-amber-200/60 py-20">
            <p className="mb-4">No hero found. Create one in the tavern first.</p>
            <button
              onClick={() => router.push("/tavern")}
              className="text-amber-400 hover:text-amber-300 underline text-sm"
            >
              Go to Tavern
            </button>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-amber-900/30 bg-[#1A1410]/60 p-6"
            >
              <CharacterSheet character={character} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Backpack className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-amber-300 tracking-wider font-[MedievalSharp]">
                  Inventory
                </h2>
                <span className="text-xs text-amber-200/40 ml-2">{items.length} items</span>
              </div>
              <InventoryGrid items={items} />
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
