"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swords, Shield, Scroll, Flame, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { useEffect, useState } from "react";
import { readContract } from "@/lib/genlayer";

export default function LandingPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ victories: 0, deaths: 0 });

  useEffect(() => {
    readContract("get_leaderboard_stats")
      .then((res: any) => {
        setStats({
          victories: Number(res?.total_victories ?? 0),
          deaths: Number(res?.total_deaths ?? 0),
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-amber-900/20">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-amber-400 tracking-wider font-[MedievalSharp]">GMaster</span>
        </div>
        <ConnectWalletButton />
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-2xl"
        >
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Flame className="w-12 h-12 text-amber-600 mx-auto" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-amber-400 tracking-[0.1em] text-glow font-[MedievalSharp]">
            Enter the Realm
          </h1>

          <p className="text-lg md:text-xl text-amber-200/60 leading-relaxed max-w-xl mx-auto">
            Play D&D-style adventures with an AI Dungeon Master where every dice roll,
            every story choice, every loot drop is permanently on-chain —
            <span className="text-amber-400/80"> impossible to cheat, impossible to save-scum.</span>
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-amber-300/50">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              {stats.victories} Victories
            </span>
            <span className="w-1 h-1 rounded-full bg-amber-800" />
            <span className="flex items-center gap-1 text-red-400/60">
              {stats.deaths} Fallen
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              onClick={() => router.push("/tavern")}
              className="bg-amber-700 hover:bg-amber-600 text-amber-50 border border-amber-500/40 px-10 h-14 text-lg tracking-wider shadow-lg shadow-amber-900/30"
            >
              <Scroll className="w-5 h-5 mr-2" />
              Begin Your Tale
            </Button>
          </motion.div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          {[
            {
              icon: <Globe className="w-6 h-6" />,
              title: "AI Dungeon Master",
              text: "LLM-powered DM narrates every moment, interprets your free-form actions, and makes cinematic rulings.",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Trustless Dice",
              text: "Every roll is verified by validator consensus on GenLayer — no one can rig the outcome, not even the DM.",
            },
            {
              icon: <Scroll className="w-6 h-6" />,
              title: "Immutable History",
              text: "Death, victory, loot — all sealed on-chain. No save-scumming. Your legend is permanent.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-lg border border-amber-900/30 bg-[#1A1410]/60 p-6 text-left hover:border-amber-700/50 transition-colors"
            >
              <div className="text-amber-500 mb-3">{card.icon}</div>
              <h3 className="font-bold text-amber-300 mb-2 font-[MedievalSharp]">{card.title}</h3>
              <p className="text-sm text-amber-200/50 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-amber-900/20 text-center text-xs text-amber-200/30">
        Powered by GenLayer Studio • Built with Next.js & Tailwind
      </footer>
    </div>
  );
}
