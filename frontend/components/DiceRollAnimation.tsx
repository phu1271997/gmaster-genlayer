"use client";

import { motion } from "framer-motion";
import { Dices } from "lucide-react";

interface DiceRollAnimationProps {
  isRolling?: boolean;
  result?: number;
}

export default function DiceRollAnimation({ isRolling, result }: DiceRollAnimationProps) {
  if (!isRolling && result === undefined) return null;

  return (
    <div className="flex items-center justify-center py-4">
      <motion.div
        animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
        transition={isRolling ? { repeat: Infinity, duration: 1.5, ease: "linear" } : { duration: 0.3 }}
        className="relative"
      >
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 border-2 border-amber-500 shadow-lg shadow-amber-900/30 flex items-center justify-center">
          {isRolling ? (
            <Dices className="w-8 h-8 text-amber-200" />
          ) : (
            <span className="text-2xl font-bold text-amber-100">{result}</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
