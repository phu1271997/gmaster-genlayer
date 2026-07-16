"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, RefreshCw } from "lucide-react";
import { getAccount, resetLocalAccount } from "@/lib/genlayer";

export default function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAddress(getAccount());
    }
  }, []);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "Reset local hero account? You lose access to any characters, items, and adventures tied to the current address.",
      )
    ) {
      resetLocalAccount();
    }
  };

  if (!address) {
    return (
      <Button variant="default" className="font-mono" disabled>
        <Wallet className="mr-2 h-4 w-4" />
        Loading…
      </Button>
    );
  }

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        className="font-mono"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {address.substring(0, 6)}…{address.substring(38)}
      </Button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-md border border-amber-900/50 bg-[#1A1410] shadow-lg z-50 p-2 space-y-1 text-sm">
          <div className="px-2 py-1 text-xs text-amber-200/60">Local hero account</div>
          <div className="px-2 py-1 font-mono text-xs text-amber-100 break-all">{address}</div>
          <button
            className="w-full text-left px-2 py-1 hover:bg-amber-950/60 rounded flex items-center gap-2 text-amber-200"
            onClick={handleCopy}
          >
            <Copy className="w-3 h-3" />
            {copied ? "Copied!" : "Copy address"}
          </button>
          <button
            className="w-full text-left px-2 py-1 hover:bg-red-950/60 rounded flex items-center gap-2 text-red-400"
            onClick={handleReset}
          >
            <RefreshCw className="w-3 h-3" />
            Reset local account
          </button>
        </div>
      )}
    </div>
  );
}
