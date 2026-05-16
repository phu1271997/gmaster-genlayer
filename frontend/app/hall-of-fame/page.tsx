"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { readContract } from "@/lib/genlayer";
import { Game, ADVENTURES } from "@/lib/game-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Skull, Clock, ArrowLeft, Swords, Star } from "lucide-react";

export default function HallOfFamePage() {
  const router = useRouter();
  const [stats, setStats] = useState({ victories: 0, deaths: 0 });
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [s, all] = await Promise.all([
          readContract("get_leaderboard_stats") as Promise<any>,
          readContract("get_all_games") as Promise<Game[]>,
        ]);
        setStats({
          victories: Number(s?.total_victories ?? 0),
          deaths: Number(s?.total_deaths ?? 0),
        });
        setGames(all ?? []);
      } catch {
        setGames([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const victories = games.filter((g) => g.is_victory);
  const fallen = games.filter((g) => !g.is_active && !g.is_victory);
  const recent = [...games].sort((a, b) => Number(b.last_action_at) - Number(a.last_action_at)).slice(0, 20);

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
        <h1 className="font-bold text-amber-400 tracking-wider font-[MedievalSharp]">Hall of Fame</h1>
      </header>

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-lg border border-amber-900/30 bg-[#1A1410]/60 p-4 text-center">
            <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-400">{stats.victories}</div>
            <div className="text-xs text-amber-200/50 uppercase tracking-wider">Total Victories</div>
          </div>
          <div className="rounded-lg border border-red-900/30 bg-red-950/10 p-4 text-center">
            <Skull className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500">{stats.deaths}</div>
            <div className="text-xs text-red-300/50 uppercase tracking-wider">Fallen Heroes</div>
          </div>
        </div>

        <Tabs defaultValue="victories" className="w-full">
          <TabsList className="bg-[#1A1410] border border-amber-900/30 w-full justify-start">
            <TabsTrigger value="victories" className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-300">
              <Trophy className="w-4 h-4 mr-1" /> Victories
            </TabsTrigger>
            <TabsTrigger value="fallen" className="data-[state=active]:bg-red-900/20 data-[state=active]:text-red-300">
              <Skull className="w-4 h-4 mr-1" /> Fallen
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-300">
              <Clock className="w-4 h-4 mr-1" /> Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="victories" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3">
                {victories.length === 0 && <p className="text-amber-200/40 text-sm text-center py-8">No victories yet. Be the first.</p>}
                {victories.map((g, i) => (
                  <GameRow key={i} game={g} index={i} type="victory" />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="fallen" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3">
                {fallen.length === 0 && <p className="text-red-200/40 text-sm text-center py-8">No fallen heroes yet. Fortune favors the bold.</p>}
                {fallen.map((g, i) => (
                  <GameRow key={i} game={g} index={i} type="fallen" />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3">
                {recent.length === 0 && <p className="text-amber-200/40 text-sm text-center py-8">No adventures found.</p>}
                {recent.map((g, i) => (
                  <GameRow key={i} game={g} index={i} type="recent" />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function GameRow({ game, index, type }: { game: Game; index: number; type: string }) {
  const adv = ADVENTURES.find((a) => a.id === game.adventure_id);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-4 rounded-lg border p-3 ${
        type === "victory" ? "border-amber-700/30 bg-amber-950/20" : type === "fallen" ? "border-red-900/30 bg-red-950/10" : "border-amber-900/20 bg-[#1A1410]/40"
      }`}
    >
      <div className="text-xs font-mono text-amber-200/30 w-8">#{index + 1}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-amber-200 truncate">
          {adv?.name ?? game.adventure_id}
        </div>
        <div className="text-xs text-amber-200/40 flex items-center gap-2">
          <span className="font-mono">{game.player.slice(0, 8)}...</span>
          <span>•</span>
          <span>Room {parseInt(game.current_room, 10)}/{parseInt(game.total_rooms, 10)}</span>
          <span>•</span>
          <span>{parseInt(game.turn_count, 10)} turns</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {type === "victory" ? (
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        ) : type === "fallen" ? (
          <Skull className="w-4 h-4 text-red-500" />
        ) : (
          <Swords className="w-4 h-4 text-amber-400/60" />
        )}
      </div>
    </motion.div>
  );
}
