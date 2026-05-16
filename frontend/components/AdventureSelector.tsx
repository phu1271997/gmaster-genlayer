"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ADVENTURES } from "@/lib/game-types";
import { Mountain, Skull, Flame, Star, MapPin } from "lucide-react";

interface AdventureSelectorProps {
  onSelect: (adventureId: string) => void;
  isLoading?: string | null;
}

const icons: Record<string, React.ReactNode> = {
  goblin_cave: <Mountain className="w-8 h-8" />,
  haunted_crypt: <Skull className="w-8 h-8" />,
  dragons_lair: <Flame className="w-8 h-8" />,
};

const difficultyLabels = ["Novice", "Adept", "Veteran"];

export default function AdventureSelector({ onSelect, isLoading }: AdventureSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-amber-400 tracking-wider font-[MedievalSharp]">
          Choose Your Adventure
        </h2>
        <p className="text-amber-200/50 text-sm">Each dungeon is procedurally guided by the AI DM and sealed on-chain.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ADVENTURES.map((adv) => (
          <Card
            key={adv.id}
            className="bg-[#1A1410]/90 border-amber-900/40 hover:border-amber-600/50 transition-all duration-300 group"
          >
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-amber-600 group-hover:text-amber-400 transition-colors">
                  {icons[adv.id] || <MapPin className="w-8 h-8" />}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: adv.difficulty }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-amber-300">{adv.name}</h3>
                <p className="text-xs text-amber-200/50 mt-1 leading-relaxed">{adv.intro}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-amber-200/40">
                <span>{adv.rooms} rooms</span>
                <span className="text-red-400/60">Boss: {adv.boss}</span>
              </div>

              <Button
                onClick={() => onSelect(adv.id)}
                disabled={!!isLoading}
                className="w-full bg-amber-800/60 hover:bg-amber-700 text-amber-100 border border-amber-600/30"
              >
                {isLoading === adv.id ? "Entering..." : "Enter Dungeon"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
