import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

let _client: ReturnType<typeof createClient> | null = null;
let _connectedAccount: `0x${string}` | null = null;

export const CONTRACT_ADDRESS = (
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x0000000000000000000000000000000000000000" // fallback if env not set
) as `0x${string}`;

const ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL || "https://studio.genlayer.com/rpc";

/**
 * Get the current connected account from MetaMask (async, fresh check).
 * Does not use deprecated window.ethereum.selectedAddress.
 */
export async function getAccount(): Promise<`0x${string}` | null> {
    if (typeof window === "undefined") return null;
    const w = window as any;
    if (!w.ethereum) return null;
    
    try {
        const accounts: string[] = await w.ethereum.request({ 
            method: "eth_accounts" 
        });
        if (accounts && accounts.length > 0) {
            _connectedAccount = accounts[0] as `0x${string}`;
            return _connectedAccount;
        }
        return null;
    } catch (err) {
        console.error("Failed to get accounts:", err);
        return null;
    }
}

/**
 * Synchronous account getter (returns cached value).
 * Use this for UI rendering. Use getAccount() for actions.
 */
export function getCachedAccount(): `0x${string}` | null {
    return _connectedAccount;
}

/**
 * Wrap provider to bypass wallet_getSnaps error (genlayer-js v1.x issue).
 */
function wrapProviderWithSnapsBypass(provider: any) {
    const originalRequest = provider.request.bind(provider);
    return {
        ...provider,
        request: async (args: { method: string; params?: any[] }) => {
            if (
                args.method === "wallet_getSnaps" ||
                args.method === "wallet_requestSnaps" ||
                args.method === "wallet_invokeSnap"
            ) {
                return {};
            }
            return originalRequest(args);
        },
    };
}

/**
 * Get client configured for read-only operations.
 */
export function getReadClient() {
    return createClient({
        chain: studionet,
        endpoint: ENDPOINT,
    });
}

/**
 * Get client configured with account for WRITE operations.
 * MUST be called AFTER wallet is connected.
 */
export async function getWriteClient() {
    if (typeof window === "undefined") {
        throw new Error("Write operations require browser environment");
    }
    
    const w = window as any;
    if (!w.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask.");
    }
    
    const acc = await getAccount();
    if (!acc) {
        throw new Error("Wallet not connected. Please click 'Connect Wallet' first.");
    }
    
    const safeProvider = wrapProviderWithSnapsBypass(w.ethereum);
    
    return createClient({
        chain: studionet,
        endpoint: ENDPOINT,
        provider: safeProvider,
        account: acc, // ✅ CRITICAL: PASS ACCOUNT HERE
    });
}

export async function connectWallet(): Promise<`0x${string}`> {
    if (typeof window === "undefined") {
        throw new Error("Must run in browser");
    }
    const w = window as any;
    if (!w.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask and reload.");
    }
    
    // Switch to GenLayer Studio network
    try {
        await w.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x4D2" }], // 1234
        });
    } catch (switchError: any) {
        if (switchError.code === 4902) {
            await w.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: "0x4D2",
                    chainName: "GenLayer Studio",
                    rpcUrls: [ENDPOINT],
                    nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
                    blockExplorerUrls: ["https://studio.genlayer.com/explorer"],
                }],
            });
        }
    }
    
    const accounts: string[] = await w.ethereum.request({ 
        method: "eth_requestAccounts" 
    });
    _connectedAccount = accounts[0] as `0x${string}`;
    return _connectedAccount;
}

export async function readContract(
    method: string,
    args: any[] = []
): Promise<any> {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        throw new Error("Contract address not configured");
    }
    const client = getReadClient();
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
): Promise<any> {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        throw new Error("Contract address not configured");
    }
    
    const client = await getWriteClient();
    
    const req: any = {
        address: CONTRACT_ADDRESS,
        functionName: method,
        args,
    };
    if (value !== undefined) req.value = value;
    
    return client.writeContract(req);
}
