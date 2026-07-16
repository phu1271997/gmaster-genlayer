import { createClient, createAccount, generatePrivateKey } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const FALLBACK_ADDRESS = "0xB82cAd160096d30d3C78D8f6f6d483c818610826";
const ACCOUNT_KEY = "gmaster-account-pk";

export const CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || FALLBACK_ADDRESS
) as `0x${string}`;

const ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL || "https://studio.genlayer.com/api";

function loadOrCreatePrivateKey(): `0x${string}` {
  if (typeof window === "undefined") return generatePrivateKey();
  try {
    const stored = window.localStorage.getItem(ACCOUNT_KEY);
    if (stored && /^0x[0-9a-fA-F]{64}$/.test(stored)) {
      return stored as `0x${string}`;
    }
    const pk = generatePrivateKey();
    window.localStorage.setItem(ACCOUNT_KEY, pk);
    return pk;
  } catch {
    return generatePrivateKey();
  }
}

const account = createAccount(loadOrCreatePrivateKey());

const client = createClient({
  chain: studionet,
  endpoint: ENDPOINT,
  account,
});

/** Return the local hero account address. Always defined once the browser loads. */
export function getAccount(): `0x${string}` {
  return account.address as `0x${string}`;
}

/** Backwards-compatible alias for older components that awaited the address. */
export async function getAccountAsync(): Promise<`0x${string}`> {
  return getAccount();
}

/** Wipe local key + reload — user "abandons" this hero and starts fresh. */
export function resetLocalAccount(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACCOUNT_KEY);
    window.location.reload();
  } catch {
    /* ignore */
  }
}

function assertContractAddress() {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contract address not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS.");
  }
}

export async function readContract(method: string, args: unknown[] = []): Promise<unknown> {
  assertContractAddress();
  return client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: args as any,
  });
}

export async function writeContract(
  method: string,
  args: unknown[] = [],
  value?: bigint,
): Promise<unknown> {
  assertContractAddress();
  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: args as any,
    value: value ?? 0n,
  });
  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: "FINALIZED" as never,
  });
  return receipt;
}
