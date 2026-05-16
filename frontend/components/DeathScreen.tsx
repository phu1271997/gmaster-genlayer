"use client";

import { motion } from "framer-motion";
import { Skull, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeathScreenProps {
  onRevive: () => void;
}

export default function DeathScreen({ onRevive }: DeathScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        className="text-center space-y-8 max-w-lg px-6"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Skull className="w-24 h-24 text-red-700 mx-auto" strokeWidth={1} />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-red-600 tracking-[0.2em] font-[MedievalSharp]">
            YOU HAVE FALLEN
          </h1>
          <p className="text-red-300/60 text-lg leading-relaxed">
            Your tale ends here, sealed forever on the chain. No save-scum can undo what fate has written.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            onClick={onRevive}
            size="lg"
            className="bg-red-900/60 hover:bg-red-800 text-red-100 border border-red-700/50 px-8 h-14 text-lg tracking-wider"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Roll a New Hero
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
