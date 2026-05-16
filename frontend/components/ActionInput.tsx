"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ActionInputProps {
  onSubmit: (action: string) => void;
  disabled?: boolean;
  loading?: boolean;
  quickActions?: string[];
}

export default function ActionInput({ onSubmit, disabled, loading, quickActions }: ActionInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || loading) return;
    onSubmit(trimmed);
    setText("");
  };

  return (
    <div className="space-y-3">
      {quickActions && quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickActions.map((qa) => (
            <button
              key={qa}
              onClick={() => onSubmit(qa)}
              disabled={disabled || loading}
              className="text-xs px-3 py-1 rounded-full border border-amber-800/40 bg-[#1A1410] text-amber-300/70 hover:text-amber-200 hover:border-amber-600/50 transition-colors disabled:opacity-40"
            >
              {qa}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-end">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="What do you do? (e.g., 'I sneak behind the goblin and stab it')"
          maxLength={500}
          rows={3}
          disabled={disabled || loading}
          className="flex-1 bg-[#1A1410] border-amber-800/50 text-amber-100 placeholder:text-amber-900/50 resize-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || loading || text.trim().length === 0}
          className="h-auto self-stretch bg-amber-700 hover:bg-amber-600 text-amber-50 border border-amber-500/30 px-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </div>

      {loading && (
        <p className="text-xs text-amber-400/60 animate-pulse">
          The DM ponders your fate... (consensus may take 60–180s)
        </p>
      )}
    </div>
  );
}
