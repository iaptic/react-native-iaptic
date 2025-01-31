import { IapticVerifiedPurchase } from "../types";
import { IapticEvents } from "./IapticEvents";
import { Purchases } from "./Purchases";
import { StoreProducts } from "./StoreProducts";


/** 
 * Manages consumable purchases
 * 
 * Note: This class is currently a placeholder for future implementation
 * of consumable purchase management functionality.
 */
export class Consumables {
  /**
   * Creates a new consumables manager
   * 
   * @param purchases - The purchases manager
   * @param catalog - The product catalog
   * @internal
   */
  constructor(private readonly purchases: Purchases, private readonly products: StoreProducts, private readonly events: IapticEvents) {
    this.events.addEventListener('purchase.updated', (purchase: IapticVerifiedPurchase) => this.purchaseUpdated(purchase), 'Consumables');
  }

  /**
   * Handles a purchase update event to check if a consumable purchase is owned
   * @param purchase - The purchase that was updated
   */
  private purchaseUpdated(purchase: IapticVerifiedPurchase) {
    if (this.products.getType(purchase.id) === 'consumable') {
      if (purchase.cancelationReason) {
        this.events.emit('consumable.refunded', purchase);
      }
      else if (!purchase.isAcknowledged) {
        this.events.emit('consumable.purchased', purchase);
      }
    }
  }
}