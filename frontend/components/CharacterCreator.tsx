"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sword, Crosshair, FlaskConical, Cross, Sparkles } from "lucide-react";
import {
  ALLOWED_CLASSES,
  CLASS_LABELS,
  CLASS_STATS,
  CLASS_HP,
  type CharClass,
} from "@/lib/game-types";

interface CharacterCreatorProps {
  onCreate: (name: string, charClass: CharClass) => void;
  isLoading?: boolean;
}

const icons: Record<CharClass, React.ReactNode> = {
  warrior: <Sword className="w-8 h-8" />,
  rogue: <Crosshair className="w-8 h-8" />,
  mage: <FlaskConical className="w-8 h-8" />,
  cleric: <Cross className="w-8 h-8" />,
};

const descriptions: Record<CharClass, string> = {
  warrior: "A stalwart defender wielding steel and courage.",
  rogue: "A shadow in the night, precise and deadly.",
  mage: "Arcane power flows through every word.",
  cleric: "Divine light guides your hand and heals the wounded.",
};

export default function CharacterCreator({ onCreate, isLoading }: CharacterCreatorProps) {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<CharClass | null>(null);

  const handleSubmit = () => {
    if (!selectedClass || name.trim().length === 0) return;
    onCreate(name.trim(), selectedClass);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-amber-400 tracking-wider font-[MedievalSharp]">
          Forge Your Hero
        </h2>
        <p className="text-amber-200/60">Choose your path and name your legend.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ALLOWED_CLASSES.map((cls) => {
          const stats = CLASS_STATS[cls];
          const isSelected = selectedClass === cls;
          return (
            <Card
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? "border-amber-500 bg-amber-950/60 shadow-lg shadow-amber-900/30"
                  : "border-amber-900/40 bg-[#1A1410]/80 hover:border-amber-700/60"
              }`}
            >
              <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                <div className={`${isSelected ? "text-amber-400" : "text-amber-700/70"}`}>
                  {icons[cls]}
                </div>
                <div>
                  <h3 className="font-bold text-amber-300 uppercase tracking-widest text-sm">
                    {CLASS_LABELS[cls]}
                  </h3>
                  <p className="text-xs text-amber-200/50 mt-1">{descriptions[cls]}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-amber-200/60 mt-2">
                  <span>STR {stats.str}</span>
                  <span>DEX {stats.dex}</span>
                  <span>INT {stats.int}</span>
                  <span>WIS {stats.wis}</span>
                </div>
                <div className="text-xs text-emerald-400/80 mt-1">HP {CLASS_HP[cls]}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="relative">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter hero name..."
            maxLength={32}
            className="bg-[#1A1410] border-amber-800/50 text-amber-100 placeholder:text-amber-900/50 h-12 text-center text-lg"
          />
          {name.length > 0 && (
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!selectedClass || name.trim().length === 0 || isLoading}
          className="w-full h-12 bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold tracking-wider border border-amber-500/30 disabled:opacity-40"
        >
          {isLoading ? "Forging..." : "Create Hero"}
        </Button>
      </div>
    </div>
  );
}
