"use client";

import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Sword } from "lucide-react";
import { useState, useEffect } from "react";

interface Monster {
  name: string;
  hp: number;
  max_hp: number;
  ac: number;
}

interface CombatPanelProps {
  monster: Monster | null;
  lastDamage?: number;
}

export default function CombatPanel({ monster, lastDamage }: CombatPanelProps) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (lastDamage && lastDamage !== 0) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 800);
      return () => clearTimeout(t);
    }
  }, [lastDamage]);

  if (!monster) {
    return (
      <div className="rounded-lg border border-amber-900/20 bg-[#1A1410]/50 p-4 text-center text-amber-200/40 text-sm">
        No enemy present. The path is quiet...
      </div>
    );
  }

  const hpPct = monster.max_hp > 0 ? (monster.hp / monster.max_hp) * 100 : 0;

  return (
    <motion.div
      animate={flash ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-red-900/40 bg-red-950/10 p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skull className="w-5 h-5 text-red-500" />
          <span className="font-bold text-red-300 text-sm">{monster.name}</span>
        </div>
        <span className="text-xs text-red-300/60 font-mono">AC {monster.ac}</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-red-300/70">
          <span>HP</span>
          <span>
            {monster.hp}/{monster.max_hp}
          </span>
        </div>
        <Progress value={hpPct} className="h-2 bg-red-950 [&>div]:bg-red-600" />
      </div>

      <AnimatePresence>
        {flash && lastDamage && lastDamage < 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-1 text-sm font-bold text-red-400"
          >
            <Sword className="w-4 h-4" />
            <span>{lastDamage} DMG</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
