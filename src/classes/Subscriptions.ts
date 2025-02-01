import { purchasesAreEqual } from "../functions/purchasesAreEqual";
import { IapticVerifiedPurchase } from "../types";
import { StoreProducts } from "./StoreProducts";
import { Purchases } from "./Purchases";
import { IapticEvents } from "./IapticEvents";

/**
 * Manages subscription-specific functionality
 * 
 * @internal
 */
export class Subscriptions {

  /** Map of purchase IDs to their last known state */
  private lastStates: { [purchaseId: string]: IapticVerifiedPurchase } = {};

  /**
   * Creates a new subscriptions manager
   * @param purchases - The purchases manager
   * @param products - The product catalog
   */
  constructor(private readonly purchases: Purchases, private readonly products: StoreProducts, private readonly events: IapticEvents) {
    this.events.addEventListener('purchase.updated', purchase => this.purchaseUpdated(purchase), 'Subscriptions');
  }

  /**
   * Lists all subscription purchases
   * @returns Array of subscription purchases
   */
  all(): IapticVerifiedPurchase[] {
    return this.purchases.sorted().filter(p => this.products.getType(p.id) === 'paid subscription');
  }

  /**
   * Lists only active subscription purchases
   * @returns Array of active subscription purchases
   */
  activesOnly(): IapticVerifiedPurchase[] {
    const now = new Date();
    return this.all().filter(p => p.expiryDate && new Date(p.expiryDate) > now && !p.cancelationReason);
  }

  /**
   * Checks if there are any active subscriptions
   * @returns True if there are active subscriptions
   */
  hasActive(): boolean {
    return this.activesOnly().length > 0;
  }

  /**
   * Return one of the active subscriptions
   * When you don't sell multiple subscriptions that can be all in parallel, that's all you need.
   */
  active(): IapticVerifiedPurchase | undefined {
    const actives = this.activesOnly();
    return actives.length > 0 ? actives[0] : undefined;
  }

  /**
   * Handles updates to subscription purchases
   * @param purchase - The updated purchase
   */
  private purchaseUpdated(purchase: IapticVerifiedPurchase) {
    if (this.products.getType(purchase.id) === 'paid subscription') {
      const existing = this.lastStates[purchase.id];
      if (existing && purchasesAreEqual(existing, purchase)) {
        // No change
        return;
      }

      if (existing?.transactionId !== purchase.transactionId && !purchase.isExpired) {
        this.events.emit('subscription.updated', 'renewed', purchase);
        this.events.emit('subscription.renewed', purchase);
      }
      else if (!existing?.cancelationReason && purchase.cancelationReason) {
        this.events.emit('subscription.updated', 'cancelled', purchase);
        this.events.emit('subscription.cancelled', purchase);
      }
      else if (!existing?.isExpired && purchase.isExpired) {
        this.events.emit('subscription.updated', 'expired', purchase);
        this.events.emit('subscription.expired', purchase);
      }
      else {
        this.events.emit('subscription.updated', 'changed', purchase);
        this.events.emit('subscription.changed', purchase);
      }

      this.lastStates[purchase.id] = purchase;
    }
  }
}
