"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { connectWallet } from "@/lib/genlayer";

export default function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as any;
    if (w.ethereum?.selectedAddress) {
      setAddress(w.ethereum.selectedAddress);
    }
    const handler = (accounts: string[]) => {
      setAddress(accounts[0] ?? null);
    };
    w.ethereum?.on?.("accountsChanged", handler);
    return () => {
      w.ethereum?.removeListener?.("accountsChanged", handler);
    };
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (address) {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-400/90">
        <CheckCircle className="w-4 h-4" />
        <span className="font-mono">{formatAddress(address)}</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
      className="bg-amber-700 hover:bg-amber-600 text-amber-50 border border-amber-500/30 shadow-lg shadow-amber-900/20"
    >
      <Shield className="w-4 h-4 mr-2" />
      {loading ? "Summoning..." : "Connect Wallet"}
    </Button>
  );
}
