"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  const raw = error?.message || String(error);
  const isContractMissing = raw.includes("Contract address not configured");
  const isNetwork = raw.includes("fetch") || raw.includes("Network");

  const friendly = isContractMissing
    ? "The app is misconfigured — no contract address set. Set NEXT_PUBLIC_CONTRACT_ADDRESS and redeploy."
    : isNetwork
      ? "Cannot reach the GenLayer studionet RPC. Check your connection and retry."
      : "Something went wrong while talking to the chain.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0A0808] paper-texture">
      <div className="max-w-md text-center space-y-6 border border-red-900/40 rounded-lg bg-[#1A1410]/70 p-8">
        <div className="flex justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-red-300 font-[MedievalSharp] tracking-wider">
          A curse has struck the realm
        </h1>
        <p className="text-amber-200/80 text-sm">{friendly}</p>
        <details className="text-left text-xs text-amber-200/40 bg-black/40 rounded p-3 overflow-auto max-h-40">
          <summary className="cursor-pointer text-amber-200/60">Technical detail</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all">{raw}</pre>
        </details>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="outline">
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
