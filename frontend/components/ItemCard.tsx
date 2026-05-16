"use client";

import { Item } from "@/lib/game-types";
import { Button } from "@/components/ui/button";
import { Sword, Shield, FlaskConical, Gem, Crown, Check } from "lucide-react";

interface ItemCardProps {
  item: Item;
  compact?: boolean;
  onUse?: (item: Item) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  weapon: <Sword className="w-4 h-4" />,
  armor: <Shield className="w-4 h-4" />,
  consumable: <FlaskConical className="w-4 h-4" />,
  treasure: <Gem className="w-4 h-4" />,
  victory_token: <Crown className="w-4 h-4" />,
};

const typeGlow: Record<string, string> = {
  weapon: "border-amber-700/60 shadow-amber-900/20",
  armor: "border-blue-900/50 shadow-blue-900/10",
  consumable: "border-emerald-800/50 shadow-emerald-900/10",
  treasure: "border-purple-800/50 shadow-purple-900/10",
  victory_token: "border-amber-500/60 shadow-amber-500/30 ring-1 ring-amber-500/20",
};

const typeText: Record<string, string> = {
  weapon: "text-amber-400",
  armor: "text-blue-400",
  consumable: "text-emerald-400",
  treasure: "text-purple-400",
  victory_token: "text-amber-300",
};

export default function ItemCard({ item, compact, onUse }: ItemCardProps) {
  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded border bg-[#0A0808] text-xs ${
          typeGlow[item.item_type] || "border-amber-900/30"
        }`}
      >
        <span className={typeText[item.item_type] || "text-amber-400"}>{typeIcons[item.item_type] || <Gem className="w-3 h-3" />}</span>
        <span className="text-amber-100/80 truncate max-w-[100px]">{item.name}</span>
        {item.is_consumed && <Check className="w-3 h-3 text-emerald-500 ml-auto" />}
        {item.item_type === "consumable" && !item.is_consumed && onUse && (
          <button onClick={() => onUse(item)} className="text-[10px] text-emerald-400 hover:underline ml-auto">
            Use
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border bg-[#0A0808] p-3 flex flex-col gap-2 ${
        typeGlow[item.item_type] || "border-amber-900/30"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={typeText[item.item_type] || "text-amber-400"}>
          {typeIcons[item.item_type] || <Gem className="w-4 h-4" />}
        </span>
        <span className="text-sm font-bold text-amber-200">{item.name}</span>
      </div>
      <p className="text-xs text-amber-200/50 line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-amber-900/20">
        <span className="text-[10px] text-amber-300/40 uppercase">{item.item_type}</span>
        {item.item_type !== "victory_token" && <span className="text-[10px] text-amber-300/40">PWR {item.power}</span>}
      </div>
      {item.item_type === "consumable" && !item.is_consumed && onUse && (
        <Button size="sm" variant="outline" onClick={() => onUse(item)} className="text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-950/30">
          Use
        </Button>
      )}
      {item.is_consumed && (
        <div className="text-xs text-emerald-500/80 flex items-center gap-1">
          <Check className="w-3 h-3" /> Consumed
        </div>
      )}
    </div>
  );
}
