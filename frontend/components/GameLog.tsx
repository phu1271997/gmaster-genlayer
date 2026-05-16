"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type LogEntry } from "@/lib/game-types";
import { Swords, Scroll, Shield, Skull, Sparkles, Dices, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GameLogProps {
  entries: LogEntry[];
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  intro: { icon: <Scroll className="w-4 h-4" />, color: "border-amber-700/50 bg-amber-950/30", label: "Intro" },
  action: { icon: <Swords className="w-4 h-4" />, color: "border-amber-600/40 bg-[#1A1410]", label: "Action" },
  system: { icon: <Shield className="w-4 h-4" />, color: "border-blue-900/40 bg-blue-950/20", label: "System" },
  combat: { icon: <Skull className="w-4 h-4" />, color: "border-red-900/50 bg-red-950/20", label: "Combat" },
  loot: { icon: <Sparkles className="w-4 h-4" />, color: "border-emerald-900/40 bg-emerald-950/20", label: "Loot" },
};

export default function GameLog({ entries }: GameLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length]);

  return (
    <ScrollArea className="h-full w-full rounded-lg border border-amber-900/30 bg-[#0A0808]/80 p-4">
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {entries.map((entry, i) => {
            const cfg = typeConfig[entry.type] || { icon: <MessageCircle className="w-4 h-4" />, color: "border-amber-900/30 bg-[#1A1410]", label: "Note" };
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`border rounded-lg p-3 ${cfg.color}`}
              >
                <div className="flex items-center gap-2 mb-2 text-xs text-amber-400/70">
                  {cfg.icon}
                  <span className="uppercase tracking-wider">{cfg.label}</span>
                  <span className="ml-auto text-amber-200/30">
                    {new Date(entry.timestamp * 1000).toLocaleTimeString()}
                  </span>
                </div>

                {entry.action && (
                  <div className="text-sm text-amber-100/80 italic mb-2 pl-2 border-l-2 border-amber-700/40">
                    &ldquo;{entry.action}&rdquo;
                  </div>
                )}

                <p className="text-sm text-amber-100/90 leading-relaxed font-serif">
                  {entry.narrative}
                </p>

                {entry.dice_rolls && entry.dice_rolls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {entry.dice_rolls.map((roll, ri) => (
                      <div
                        key={ri}
                        className="flex items-center gap-1 text-xs bg-[#0A0808] border border-amber-800/40 rounded px-2 py-1 text-amber-300"
                      >
                        <Dices className="w-3 h-3" />
                        <span>{roll.die}={roll.result}</span>
                        {roll.modifier !== 0 && (
                          <span className={roll.modifier > 0 ? "text-emerald-400" : "text-red-400"}>
                            {roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier}
                          </span>
                        )}
                        <span className="font-bold text-amber-100">→ {roll.total}</span>
                        {roll.dc !== null && roll.dc !== undefined && (
                          <span className="text-amber-200/50">vs DC{roll.dc}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {entry.loot_dropped && entry.loot_dropped.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entry.loot_dropped.map((loot, li) => (
                      <span
                        key={li}
                        className="text-xs bg-emerald-950/40 text-emerald-300 border border-emerald-800/30 rounded px-2 py-0.5"
                      >
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        {loot}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
