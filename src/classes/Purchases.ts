import { purchasesAreEqual } from "../functions/purchasesAreEqual";
import { IapticVerifiedPurchase } from "../types";
import { IapticEvents } from "./IapticEvents";
import { logger } from "./IapticLogger";

/**
 * Manages the collection of verified purchases
 * 
 * @internal
 */
export class Purchases {

  /** Map of purchase keys to verified purchases */
  private purchases: { [key: string]: IapticVerifiedPurchase } = {};

  constructor(private readonly events: IapticEvents) {}

  /**
   * Lists all verified purchases
   * @returns Array of verified purchases
   */
  list(): IapticVerifiedPurchase[] {
    return Object.values(this.purchases);
  }

  /**
   * Returns a sorted list of verified purchases, with the most recent first
   *
   * @returns Array of verified purchases
   */
  sorted(): IapticVerifiedPurchase[] {
    return this.list().sort((a, b) => sortingDate(b) - sortingDate(a));
  }

  /**
   * Gets a specific purchase by product ID and optional transaction ID
   *
   * @param productId - The product identifier
   * @param transactionId - Optional transaction identifier
   * @returns The verified purchase if found
   */
  getPurchase(productId: string, transactionId?: string): IapticVerifiedPurchase | undefined {
    const key = makeKey(productId, transactionId);
    if (transactionId) {
      return this.purchases[key];
    }
    else {
      const purchases = Object.values(this.purchases).filter(p => p.id === productId);
      // find the most recent purchase
      return purchases.sort((a, b) => sortingDate(b) - sortingDate(a))[0];
    }
  }

  /**
   * Adds a new verified purchase
   * @param purchase - The verified purchase to add
   */
  addPurchase(purchase: IapticVerifiedPurchase) {
    logger.debug('adding verified purchase: ' + JSON.stringify(purchase));
    const key = purchaseKey(purchase);
    const existing = this.purchases[key];
    if (existing && purchasesAreEqual(existing, purchase)) {
      // No change
      logger.debug('purchase exists and did not change');
      return;
    }
    this.purchases[key] = purchase;
    this.events.emit('purchase.updated', purchase);
  }
}


/** 
 * Returns the sorting date for a purchase
 * @param purchase - The purchase to get the sorting date for
 * @returns Timestamp for sorting purchases chronologically
 */
function sortingDate(purchase: IapticVerifiedPurchase): number {
  return new Date(purchase.expiryDate ?? purchase.lastRenewalDate ?? purchase.purchaseDate ?? 0).getTime();
}

/** 
 * Creates a unique key for a purchase
 * @param productId - The product identifier
 * @param transactionId - Optional transaction identifier
 * @returns A unique string key
 */
function makeKey(productId: string, transactionId?: string): string {
  return transactionId ? `${productId}:${transactionId}` : productId;
}

/** 
 * Creates a key for a verified purchase
 * @param purchase - The verified purchase
 * @returns A unique string key
 */
function purchaseKey(purchase: IapticVerifiedPurchase): string {
  return makeKey(purchase.id, purchase.transactionId);
}
