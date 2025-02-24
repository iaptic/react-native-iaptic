import * as IAP from 'react-native-iap';
import { IapticEvents } from './IapticEvents';
import { DebouncedProcessor } from './DebouncedProcessor';
import { IapticSeverity, toIapticError } from './IapticError';
import { EmitterSubscription } from 'react-native';
import { logger } from './IapticLogger';
import { globalsGet, globalsSet } from '../functions/globals';
import { IapticStore } from './IapticStore';

/**
 * Process events from react-native-iap
 * 
 * @internal
 */
export class IapEventsProcessor {

  /**
   * react-native-iap sends many copies of events when doing hot reloads, we use the random id to identify the
   * instance of the object that catches the events for debugging purposes.
   */
  private id = randomId();

  /**
   * Those debounced processors to fix the issue of many copies of events when doing hot reloads,
   * and to ensure we process events a single time, in the background.
   */
  private purchaseProcessor = new DebouncedProcessor<IAP.SubscriptionPurchase | IAP.ProductPurchase>(p => this.processPurchase(p, true), p => p.transactionId ?? '');
  private errorProcessor = new DebouncedProcessor<IAP.PurchaseError>(e => this.processError(e), e => e.code ?? '');

  private onPurchaseUpdate?: EmitterSubscription;
  private onPurchaseError?: EmitterSubscription;

  // Track timeouts for cleanup
  private purchaseTimeouts: Map<string, NodeJS.Timeout> = new Map();

  purchases: Map<string, IAP.ProductPurchase | IAP.SubscriptionPurchase> = new Map();

  constructor(private readonly store: IapticStore, private readonly events: IapticEvents) {
    globalsSet('active_iap_events_processor', this.id);
  }

  addListeners() {
    logger.info('IapEventsProcessor.addListener()');
    if (this.onPurchaseUpdate) return;
    this.onPurchaseUpdate = IAP.purchaseUpdatedListener(p => this.purchaseProcessor.add(p));
    this.onPurchaseError = IAP.purchaseErrorListener(e => this.errorProcessor.add(e));
  }

  removeListeners() {
    logger.info('IapEventsProcessor.removeListeners()');
    this.onPurchaseUpdate?.remove();
    this.onPurchaseError?.remove();
    this.onPurchaseUpdate = this.onPurchaseError = undefined;
    this.purchaseProcessor.cleanup();
    this.errorProcessor.cleanup();
    // Clean up any remaining timeouts
    for (const timeout of this.purchaseTimeouts.values()) {
      clearTimeout(timeout);
    }
    this.purchaseTimeouts.clear();
  }

  /**
   * - Triggers in real-time when a new purchase is made
   * - Only catches purchases that happen while the app is running
   * - Is the primary way to handle active purchase flows
   * - Won't catch purchases made on other devices or in previous installations
   */
  async processPurchase(
    purchase: IAP.SubscriptionPurchase | IAP.ProductPurchase,
    inBackground: boolean = false
  ): Promise<void> {
    if (globalsGet('active_iap_events_processor') !== this.id) {
      return;
    }
    logger.info(`IapEventsProcessor.processPurchase() - Processing purchase: ${purchase.transactionId ?? purchase.productId} for product: ${purchase.productId} in background: ${inBackground}`);

    // Cache the purchase for 1 minute (so we can finish it later)
    this.purchases.set(purchase.transactionId ?? purchase.productId, purchase);
    // Clear any existing timeout
    const key = purchase.transactionId ?? purchase.productId;
    if (this.purchaseTimeouts.has(key)) {
      clearTimeout(this.purchaseTimeouts.get(key)!);
    }
    // Set new timeout
    this.purchaseTimeouts.set(key, setTimeout(() => {
      this.purchases.delete(key);
      this.purchaseTimeouts.delete(key);
    }, 60000)); // remove from cache after 1 minute

    const reportError = (err: any, severity: IapticSeverity = IapticSeverity.WARNING) => {
      if (inBackground) {
        this.events.emit('error', toIapticError(err, severity));
      }
      else {
        throw toIapticError(err, severity);
      }
    }

    // First validate the purchase with iaptic
    try {

      if (this.store.pendingPurchases.getStatus(purchase.productId) === 'validating') {
        logger.info('IapEventsProcessor.processPurchase() - Purchase is already being validated, waiting for status to change');
        while (true) {
          await new Promise<void>(resolve => setTimeout(resolve, 100));
          if (this.store.pendingPurchases.getStatus(purchase.productId) !== 'validating') {
            return; // this.iaptic.purchases.getPurchase(purchase.productId, purchase.transactionId);
          }
        }
      }

      this.store.pendingPurchases.update(purchase.productId, 'validating');
      const verified = await this.store.validate(purchase);
      logger.debug('IapEventsProcessor.processPurchase() - has validated the purchase (verified: ' + verified + ')');
      if (!verified) {
        // the receipt is valid, but transaction does not exist, let's finish it
        logger.debug('IapEventsProcessor.processPurchase() - is finishing the purchase');
        this.store.pendingPurchases.update(purchase.productId, 'finishing');
        try {
          await IAP.finishTransaction({ purchase, isConsumable: this.store.products.getType(purchase.productId) === 'consumable' });
        }
        catch (error: any) {
          logger.info('IapEventsProcessor.processPurchase() - Failed to finish unverified purchase: ' + error + ' (this is fine, we tried)');
        }
        this.store.pendingPurchases.update(purchase.productId, 'completed');
        return;
      }
    }
    catch (error: any) {
      reportError(error, IapticSeverity.WARNING);
      return;
    }

    // Let's handle subscriptions
    switch (this.store.products.getType(purchase.productId)) {
      case 'consumable':
        // We let the user consume the purchase
        break;
      case 'non consumable':
      case 'paid subscription':
        // Automatically finish the purchase for non-consumable and paid subscriptions
        // because iaptic has the status now
        logger.debug('IapEventsProcessor.processPurchase() - is finishing the purchase because it is a non-consumable or paid subscription');
        try {
          this.store.pendingPurchases.update(purchase.productId, 'finishing');
          await IAP.finishTransaction({ purchase, isConsumable: this.store.products.getType(purchase.productId) === 'consumable' });
        } catch (finishError: any) {
          logger.info('IapEventsProcessor.processPurchase() - Failed to finish unverified purchase: ' + finishError.message);
          // reportError(finishError, IapticErrorSeverity.WARNING);
        }
        break;
    }

    logger.debug('IapEventsProcessor.processPurchase() - completed');
    this.store.pendingPurchases.update(purchase.productId, 'completed');
    return;
  }

  private processError(error: IAP.PurchaseError) {
    if (globalsGet('active_iap_events_processor') !== this.id) {
      return;
    }
    if (error.code === 'E_USER_CANCELLED') return; // ignore user cancelled errors
    logger.warn(`IapEventsProcessor.processError() - IAP.PurchaseError #${this.id} #${error.code} - ${error.message}`);
  }
}

/** A random string */
function randomId() {
  return Math.random().toString(36).substring(4);
}