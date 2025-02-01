import { StoreProducts } from "./StoreProducts";
import { Purchases } from "./Purchases";
import { IapticVerifiedPurchase } from "../types";
import { IapticEvents } from "./IapticEvents";

/**
 * Manages non-consumable purchases
 * 
 * @internal
 */
export class NonConsumables {

  /** Map of purchase IDs to their current state */
  private state: { [purchaseId: string]: IapticVerifiedPurchase } = {};

  /**
   * Creates a new non-consumables manager
   * @param purchases - The purchases manager
   * @param products - The product catalog
   */
  constructor(private readonly purchases: Purchases, private readonly products: StoreProducts, private readonly events: IapticEvents) {
    this.events.addEventListener('purchase.updated', (purchase: IapticVerifiedPurchase) => this.purchaseUpdated(purchase), 'NonConsumables');
  }

  /**
   * Handles a purchase update event to check if a non-consumable purchase is owned
   * @param purchase - The purchase that was updated
   */
  private purchaseUpdated(purchase: IapticVerifiedPurchase) {
    if (this.products.getType(purchase.id) === 'non consumable') {
      this.events.emit('nonConsumable.updated', purchase);
      if (!this.owned(purchase.id) && this._owned(purchase)) {
        this.events.emit('nonConsumable.owned', purchase);
      }
      else if (this.owned(purchase.id) && !this._owned(purchase)) {
        this.events.emit('nonConsumable.unowned', purchase);
      }
      this.state[purchase.id] = {...purchase};
    }
  }

  /**
   * Gets a non-consumable purchase by product ID
   * @param productId - The product identifier
   * @returns The verified purchase if found
   */
  get(productId: string): IapticVerifiedPurchase | undefined {
    return this.state[productId];
  }

  /**
   * Checks if a non-consumable product is owned
   * @param productId - The product identifier
   * @returns True if the product is owned
   */
  owned(productId: string): boolean {
    return this._owned(this.state[productId]);
  }

  private _owned(purchase?: IapticVerifiedPurchase): boolean {
    return (!!purchase) && !purchase.isExpired && !purchase.cancelationReason;
  }
}
