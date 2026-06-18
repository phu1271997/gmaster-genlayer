"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { connectWallet, getAccount } from "@/lib/genlayer"

export default function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null)
  
  useEffect(() => {
    const checkConnection = async () => {
      const acc = await getAccount();
      setAddress(acc);
    };
    checkConnection();

    const w = window as any;
    if (w && w.ethereum && w.ethereum.on) {
      const handler = (accounts: string[]) => {
        setAddress(accounts[0] ?? null);
      };
      w.ethereum.on("accountsChanged", handler);
      return () => {
        if (w.ethereum.removeListener) {
          w.ethereum.removeListener("accountsChanged", handler);
        }
      };
    }
  }, [])

  const connect = async () => {
    try {
      const acc = await connectWallet();
      setAddress(acc);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to connect wallet.");
    }
  }

  return (
    <Button onClick={connect} variant={address ? "outline" : "default"} className="font-mono">
      <Wallet className="mr-2 h-4 w-4" />
      {address ? `${address.substring(0, 6)}...${address.substring(38)}` : "Connect Wallet"}
    </Button>
  )
}
