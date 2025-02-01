import { IapticOffer, IapticPendingPurchaseState, IapticPendingPurchase } from "../types";
import { IapticEvents } from "./IapticEvents";

/**
 * Keep track of the state of pending purchases.
 * 
 * @internal
 */
export class PendingPurchases {
  private pendingPurchases: IapticPendingPurchase[] = [];

  constructor(private readonly events: IapticEvents) {}

  public get(): IapticPendingPurchase[] {
    return this.pendingPurchases;
  }

  public getStatus(productId: string, offerId?: string): IapticPendingPurchaseState | undefined {
    if (!offerId) {
      return this.pendingPurchases.find(p => p.productId === productId)?.status;
    }
    else {
      return this.pendingPurchases.find(p => p.productId === productId && p.offerId === offerId)?.status;
    }
  }

  public add(offer: IapticOffer) {
    const existing = this.pendingPurchases.find(p => p.productId === offer.productId);
    if (existing) {
      return this.update(offer.productId, 'purchasing', offer.id);
    }
    this.pendingPurchases.push({productId: offer.productId, status: 'purchasing', offerId: offer.id});
    this.events.emit('pendingPurchase.updated', {productId: offer.productId, offerId: offer.id, status: 'purchasing'});
  }

  public remove(productId: string, offerId?: string, reason: IapticPendingPurchaseState = 'completed') {
    if (this.getStatus(productId, offerId) !== undefined) {
      this.pendingPurchases = this.pendingPurchases.filter(p => p.productId !== productId);
      this.events.emit('pendingPurchase.updated', {productId, offerId, status: reason});
    }
  }

  public update(productId: string, status: IapticPendingPurchaseState, offerId?: string) {
    const purchase = this.pendingPurchases.find(p => p.productId === productId);
    if (purchase && purchase.status !== status) {
      purchase.status = status;
      if (offerId) purchase.offerId = offerId;
      if (status === 'completed' || status === 'cancelled') {
        this.remove(productId, offerId);
      }
      else {
        this.events.emit('pendingPurchase.updated', purchase);
      }
    }
  }
}
