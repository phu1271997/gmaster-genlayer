import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function classModifier(stat: number): number {
  return Math.floor((stat - 10) / 2);
}

export function formatStat(stat: string | number): string {
  return String(stat);
}
