import { IapticVerifiedPurchase } from "../types";

/** 
 * Compares two purchases for equality
 * @param a - First purchase to compare
 * @param b - Second purchase to compare
 * @returns True if purchases are identical
 */
export function purchasesAreEqual(a: IapticVerifiedPurchase, b: IapticVerifiedPurchase): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
