import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Hashids from 'hashids';

const SECRET_KEY = "JgBOro7Zb8";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const hashids = new Hashids(SECRET_KEY, 10);

export function encodeId(id: string) {
  const hash = hashids.encodeHex(id);
  return hash;
}

// Function to decode hash back to the original ID
export function decodeId(hash: string) {
  const decoded = hashids.decodeHex(hash);
  return decoded ? decoded : null; // Ensure the decoded result is returned as a string or null if the decoding fails
}