"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VictoryScreenProps {
  adventureName?: string;
  onReturn: () => void;
}

export default function VictoryScreen({ adventureName, onReturn }: VictoryScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        className="text-center space-y-8 max-w-lg px-6"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Crown className="w-24 h-24 text-amber-500 mx-auto" strokeWidth={1.2} />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-amber-400 tracking-[0.15em] font-[MedievalSharp]">
            VICTORY
          </h1>
          <p className="text-amber-200/60 text-lg leading-relaxed">
            You have conquered{" "}
            <span className="text-amber-400 font-bold">{adventureName || "the dungeon"}</span>.
            A Victory Token has been minted to your wallet on-chain, eternal proof of your triumph.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 100, opacity: [0, 1, 0] }}
              transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
              className="absolute"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 20}%` }}
            >
              <Sparkles className="w-3 h-3 text-amber-400/60" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <Button
            onClick={onReturn}
            size="lg"
            className="bg-amber-700 hover:bg-amber-600 text-amber-50 border border-amber-500/40 px-8 h-14 text-lg tracking-wider"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Tavern
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
