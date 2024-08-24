import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from "crypto-js"

const SECRET_KEY = "JgBOro7Zb8";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encrypt(id: string) {
  const encrypted = CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
  return encodeURIComponent(encrypted); // Use encodeURIComponent to make it URL-safe
}

export function decrypt(encryptedId: string) {
  const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), SECRET_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
