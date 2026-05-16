"use client";

import { Item } from "@/lib/game-types";
import ItemCard from "./ItemCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Backpack } from "lucide-react";

interface InventoryGridProps {
  items: Item[];
  onUse?: (item: Item) => void;
  compact?: boolean;
}

export default function InventoryGrid({ items, onUse, compact }: InventoryGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-amber-200/30 text-sm">
        <Backpack className="w-8 h-8 mx-auto mb-2 opacity-30" />
        Your pack is empty.
      </div>
    );
  }

  if (compact) {
    return (
      <ScrollArea className="max-h-[200px]">
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} compact onUse={onUse} />
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onUse={onUse} />
      ))}
    </div>
  );
}
