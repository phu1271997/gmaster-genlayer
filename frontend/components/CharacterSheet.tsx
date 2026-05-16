"use client";

import { Character } from "@/lib/game-types";
import { Heart, Shield, Zap, Brain, Eye, Swords, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { classModifier } from "@/lib/utils";

interface CharacterSheetProps {
  character: Character;
  compact?: boolean;
}

export default function CharacterSheet({ character, compact }: CharacterSheetProps) {
  const hp = parseInt(character.hp, 10);
  const maxHp = parseInt(character.max_hp, 10);
  const hpPct = maxHp > 0 ? (hp / maxHp) * 100 : 0;

  const strMod = classModifier(parseInt(character.stat_str, 10));
  const dexMod = classModifier(parseInt(character.stat_dex, 10));
  const intMod = classModifier(parseInt(character.stat_int, 10));
  const wisMod = classModifier(parseInt(character.stat_wis, 10));

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-amber-100">{character.name}</span>
          <span className="text-amber-400/70 capitalize">({character.char_class})</span>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <Heart className="w-4 h-4 text-red-500" />
          <Progress value={hpPct} className="h-2 bg-red-950 [&>div]:bg-red-600" />
          <span className="text-xs font-mono text-red-300">{hp}/{maxHp}</span>
        </div>
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-amber-300">{parseInt(character.victories, 10)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-amber-400 font-[MedievalSharp]">{character.name}</h3>
          <p className="text-sm text-amber-200/60 capitalize">
            Level {parseInt(character.level, 10)} {character.char_class}
          </p>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <Trophy className="w-5 h-5" />
          <span className="font-bold">{parseInt(character.victories, 10)}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-red-300/80">
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />HP</span>
          <span>{hp}/{maxHp}</span>
        </div>
        <Progress value={hpPct} className="h-3 bg-red-950 [&>div]:bg-red-600" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatBox icon={<Swords className="w-4 h-4" />} label="STR" value={parseInt(character.stat_str, 10)} mod={strMod} color="text-red-400" />
        <StatBox icon={<Zap className="w-4 h-4" />} label="DEX" value={parseInt(character.stat_dex, 10)} mod={dexMod} color="text-emerald-400" />
        <StatBox icon={<Brain className="w-4 h-4" />} label="INT" value={parseInt(character.stat_int, 10)} mod={intMod} color="text-blue-400" />
        <StatBox icon={<Eye className="w-4 h-4" />} label="WIS" value={parseInt(character.stat_wis, 10)} mod={wisMod} color="text-purple-400" />
      </div>

      <div className="text-xs text-amber-200/40 pt-2 border-t border-amber-900/30">
        EXP {parseInt(character.exp, 10)} • Created block {parseInt(character.created_at, 10)}
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  mod,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  mod: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#0A0808] border border-amber-900/30 rounded-lg px-3 py-2">
      <div className={`${color}`}>{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-amber-200/50">{label}</div>
        <div className="text-sm font-bold text-amber-100">
          {value}
          <span className={`text-xs ml-1 ${mod >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {mod >= 0 ? `+${mod}` : mod}
          </span>
        </div>
      </div>
    </div>
  );
}
