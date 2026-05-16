import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

let _client: ReturnType<typeof createClient> | null = null;

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function getClient(): ReturnType<typeof createClient> {
  if (typeof window === "undefined") {
    // Server-side fallback
    if (!_client) {
      _client = createClient({ chain: studionet });
    }
    return _client;
  }

  const w = window as any;
  const provider = w.ethereum;

  // Rebuild client with provider whenever wallet state changes
  _client = createClient({
    chain: studionet,
    provider,
    endpoint: "https://studio.genlayer.com/rpc",
  });
  return _client;
}

export function account(): `0x${string}` | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as any;
  return w.ethereum?.selectedAddress ?? undefined;
}

export async function connectWallet(): Promise<`0x${string}`> {
  const w = window as any;
  if (!w.ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask and reload.");
  }
  // Switch to GenLayer Studio network if needed
  try {
    await w.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4D2" }], // 1234 in hex
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await w.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x4D2",
            chainName: "GenLayer Studio",
            rpcUrls: ["https://studio.genlayer.com/rpc"],
            nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
            blockExplorerUrls: ["https://studio.genlayer.com/explorer"],
          },
        ],
      });
    }
  }
  const accounts = await w.ethereum.request({ method: "eth_requestAccounts" });
  // Re-init client with provider
  getClient();
  return accounts[0] as `0x${string}`;
}

export async function readContract(
  method: string,
  args: any[] = []
): Promise<unknown> {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contract address not configured in NEXT_PUBLIC_CONTRACT_ADDRESS");
  }
  const client = getClient();
  return client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
  });
}

export async function writeContract(
  method: string,
  args: any[] = [],
  value?: bigint
): Promise<unknown> {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contract address not configured in NEXT_PUBLIC_CONTRACT_ADDRESS");
  }
  const client = getClient();
  const req: any = {
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
  };
  if (value !== undefined) {
    req.value = value;
  }
  return client.writeContract(req);
}
