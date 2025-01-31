import { md5 } from './md5';

/**
 * Generate a UUID v3-like string from an account string.
 * 
 * The username is first hashed with MD5, then formatted as a UUID v3-like string by adding dashes between the different parts of the hash.
 * 
 * This is used to generate a appAccountToken for Apple App Store purchases.
 * 
 * @param account - The account string
 * @returns The UUID v3-like string
 */
export function md5UUID(account: string): string {
  // Generate MD5 hash of the account string
  const hash = md5(account);
  
  // Format the hash as a UUID v3-like string (8-4-4-4-12)
  return `${hash.slice(0, 8)}-${hash.slice(8, 4)}-${hash.slice(12, 4)}-${hash.slice(16, 4)}-${hash.slice(20)}`;
}

/** returns true if the string is a valid UUID v3-like string */
export function isUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(uuid);
}