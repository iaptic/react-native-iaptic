import { Platform, Linking } from "react-native";
import { getReceiptIOS, ProductPurchase } from "react-native-iap";

import {
  IapticStoreConfig,
  IapticErrorCode,
  IapticProduct,
  IapticVerifiedPurchase,
  IapticOffer,
  IapticVerbosity,
  IapticPurchasePlatform,
  IapticProductDefinition
} from "../types";
import * as IAP from 'react-native-iap';
import { StoreProducts } from "./StoreProducts";
import { Purchases } from "./Purchases";
import { Subscriptions } from "./Subscriptions";
import { validateReceipt } from "../functions/validateReceipt";
import { IapticError, IapticSeverity, toIapticError } from "./IapticError";
import { PendingPurchases } from "./PendingPurchases";
import { IapticLogger, logger } from "./IapticLogger";
import { isUUID, md5UUID } from "../functions/md5UUID";
import { IapticEvents } from './IapticEvents';
import { IapticEventType, IapticEventListener } from '../types';
import { NonConsumables } from "./NonConsumables";
import { Consumables } from "./Consumables";
import { Locales } from "./Locales";
import { IapEventsProcessor } from "./IapEventsProcessor";

/**
 * Main class for handling in-app purchases with iaptic
 * 
 * Most users will never use this class directly.
 * 
 * @internal
 */
export class IapticStore {

  /** Configuration for the iaptic service */
  readonly config: IapticStoreConfig;

  /** Manages user-side event listeners */
  private events: IapticEvents = new IapticEvents();

  /** Product catalog containing all available products */
  readonly products: StoreProducts = new StoreProducts([], [], [], this.events);
  /** Manages all verified purchases */
  readonly purchases: Purchases = new Purchases(this.events);
  /** Manages subscription-specific functionality */
  readonly subscriptions: Subscriptions = new Subscriptions(this.purchases, this.products, this.events);
  /** Manages non-consumable purchases */
  readonly nonConsumables: NonConsumables = new NonConsumables(this.purchases, this.products, this.events);
  /** Manages consumable purchases */
  readonly consumables: Consumables = new Consumables(this.purchases, this.products, this.events);
  /** Manages pending purchases */
  readonly pendingPurchases: PendingPurchases = new PendingPurchases(this.events);

  /** Process events from react-native-iap plugin */
  private iapEventsProcessor = new IapEventsProcessor(this, this.events);

  /** Flag to check if the initialize() method has been called and succeeded */
  private initialized = false;

  /** The application username */
  private applicationUsername: string | undefined;

  /**
   * Creates a new instance of IapticRN
   * @param config - Configuration for the iaptic service
   * @example
   * ```typescript
   * const iaptic = new IapticRN({
   *   apiKey: 'prod_123456789',
   *   iosBundleId: 'com.yourcompany.app',
   *   androidPackageName: 'com.yourcompany.app',
   * });
   * ```
   */
  constructor(config: IapticStoreConfig) {
    logger.debug('IapticRN constructor');
    this.config = config;
    if (!this.config.baseUrl) {
      this.config.baseUrl = 'https://validator.iaptic.com';
    }
    if (this.config.showAlerts === undefined) {
      this.config.showAlerts = true;
    }
  }

  /** Set the application username */
  setApplicationUsername(value: string | undefined) {
    logger.info(`setApplicationUsername(${value})`);
    this.applicationUsername = value;
  }

  /**
   * 
   */
  async initConnection() {
    logger.info('initConnection()');
    if (this.initialized) {
      logger.info('Connection already initialized');
      return;
    }
    this.initialized = true;
    try {
      await IAP.initConnection();
      logger.info('initialized');
      this.iapEventsProcessor.addListeners();
      return null;
    } catch (err: any) {
      this.initialized = false;
      logger.error(`Failed to initialize IAP #${err.code}: ${err.message}`);
      throw toIapticError(err, IapticSeverity.WARNING, IapticErrorCode.SETUP, 'Failed to initialize the in-app purchase library, check your configuration.');
    }
  }

  /**
   * Initializes the In-App Purchase component.
   * 
   * - prepare the connection with the store.
   * - load products defined with setProductDefinitions()
   * - load available purchases
   * @example
   * ```typescript
   * try {
   *   await iaptic.initialize();
   *   console.log('Products loaded:', iaptic.products.all());
   *   console.log('Active purchases:', iaptic.purchases.list());
   * } catch (error) {
   *   console.error('Initialization failed:', error);
   * }
   */
  async initialize() {
    await this.initConnection();
    await this.loadProducts();
    await this.loadPurchases();
  }

  /**
   * Set iaptic plugin's verbosity level
   * @param verbosity 
   */
  setVerbosity(verbosity: IapticVerbosity) {
    logger.verbosity = verbosity;
  }

  /**
   * Destroys the iaptic service
   */
  destroy() {
    logger.info('destroy()');
    this.iapEventsProcessor.removeListeners();
    this.events.removeAllEventListeners();
    this.initialized = false;
  }

  /**
   * Check if a product can be purchased.
   * 
   * @param product - The product to check
   * @returns True if the product can be purchased, false otherwise
   */
  canPurchase(product: IapticProduct): boolean {
    return !this.owned(product.id) && !this.pendingPurchases.getStatus(product.id);
  }

  /**
   * Check if a product is owned.
   * 
   * @param productId - The product identifier
   * @returns True if the product is owned, false otherwise
   */
  owned(productId: string): boolean {
    const purchase = this.purchases.getPurchase(productId);
    if (!purchase) return false;
    if (purchase.isExpired) return false;
    if (purchase.cancelationReason) return false;
    if (purchase.expiryDate && new Date(purchase.expiryDate) < new Date()) return false;
    return true;
  }

  /**
   * Add the application username to a purchase request
   * 
   * On iOS, the application username is added as an appAccountToken in the form of a UUID.
   * On Android, the application username is added as an obfuscatedAccountIdAndroid in the form of a 64 characters string.
   * 
   * @param request - The request to add the application username to
   * @returns The request with the application username added
   */
  private addApplicationUsernameToRequest<T extends IAP.RequestPurchase | IAP.RequestSubscription>(request: T): T {
    if (!this.applicationUsername) return request;
    if (Platform.OS === 'ios') {
      if (isUUID(this.applicationUsername)) {
        (request as IAP.RequestPurchaseIOS).appAccountToken = this.applicationUsername;
      } else {
        (request as IAP.RequestPurchaseIOS).appAccountToken = md5UUID(this.applicationUsername);
      }
    } else {
      (request as IAP.RequestPurchaseAndroid).obfuscatedAccountIdAndroid = this.applicationUsername.slice(0, 64); // max 64 characters
    }
    return request;
  }

  /**
   * Order a product with an offer.
   * 
   * @param offer - The offer to order
   * @example
   * ```typescript
   * // Order a subscription offer
   * const subscriptionOffer = iaptic.products.get('premium_monthly')?.offers[0];
   * if (subscriptionOffer) {
   *   try {
   *     await iaptic.order(subscriptionOffer);
   *     console.log('Purchase started successfully');
   *   } catch (error) {
   *     console.error('Purchase failed:', error);
   *   }
   * }
   */
  async order(offer: IapticOffer) {
    logger.info(`order(${JSON.stringify(offer)}) applicationUsername:${this.applicationUsername}`);
    try {
      this.pendingPurchases.add(offer);
      await (new Promise(resolve => setTimeout(resolve, 10)));
      switch (this.products.getType(offer.productId)) {
        case 'non consumable':
        case 'consumable':
          logger.info(`requestPurchase(${offer.productId}) applicationUsername:${this.applicationUsername}`);
          await IAP.requestPurchase(this.addApplicationUsernameToRequest({
            sku: offer.productId,
          }));
          break;
        case 'paid subscription':
          if (offer.platform === IapticPurchasePlatform.GOOGLE_PLAY && offer.offerToken) {
            const requestSubscription = this.addApplicationUsernameToRequest({
              sku: offer.productId,
              subscriptionOffers: [{
                sku: offer.productId,
                offerToken: offer.offerToken!
              }]
            });
            logger.info(`requestSubscription(${JSON.stringify(requestSubscription)})`);
            await IAP.requestSubscription(requestSubscription);
          } else {
            await IAP.requestSubscription(this.addApplicationUsernameToRequest({ sku: offer.productId }));
          }
          break;
      }
      this.pendingPurchases.update(offer.productId, 'processing');
    }
    catch (err: any) {
      const iapticError = toIapticError(err,
        (err.code === 'E_USER_CANCELLED') ? IapticSeverity.INFO : IapticSeverity.ERROR,
        IapticErrorCode.PURCHASE,
        'Failed to place a purchase. Offer: ' + JSON.stringify(offer));
      this.pendingPurchases.remove(offer.productId);
      throw iapticError;
    }
  }

  /**
   * Validate and register a purchase with iaptic receipt validator.
   * 
   * @param purchase - The purchase to validate
   * @param productType - The type of the product
   * @param applicationUsername - The username of the application
   * @returns The validated purchase or undefined if the purchase is not valid
   */
  async validate(purchase: ProductPurchase): Promise<IapticVerifiedPurchase | undefined> {
    const productType = this.products.getType(purchase.productId);
    logger.info(`validate(${purchase.transactionId}, ${purchase.productId})`);
    logger.debug('🔄 Validating purchase: ' + JSON.stringify(purchase) + ' productType: ' + productType + ' applicationUsername: ' + this.applicationUsername);
    if (!purchase.transactionId) {
      throw new IapticError('Transaction ID is required', {
        severity: IapticSeverity.ERROR,
        code: IapticErrorCode.VERIFICATION_FAILED,
        localizedTitle: Locales.get('ValidationError'),
        localizedMessage: Locales.get('ValidationError_MissingTransactionId'),
        debugMessage: 'Transaction ID is required for the call to iaptic.validate()',
      });
    }

    let receipt: string | undefined | null = purchase.transactionReceipt;
    if (!receipt && Platform.OS === 'ios' && !IAP.isIosStorekit2()) {
      receipt = await getReceiptIOS({ forceRefresh: true });
    }

    const result = await validateReceipt({
      productId: purchase.productId,
      transactionId: purchase.transactionId,
      receipt: receipt || '',
      receiptSignature: purchase.signatureAndroid || '',
      productType,
      applicationUsername: this.applicationUsername,
    }, this.products.all(), this.config);
    logger.debug('Validation result: ' + JSON.stringify(result));

    if (result.ok) {
      if (result.data.collection) {
        result.data.collection.forEach(purchase => this.purchases.addPurchase(purchase));
      }
      return result.data.collection?.find(vPurchase => vPurchase.id === purchase.productId);
    }
    else {
      const code = result.code ?? IapticErrorCode.UNKNOWN;
      const message = result.message ?? 'Failed to validate purchase';
      throw new IapticError(message, {
        severity: IapticSeverity.WARNING,
        code,
        localizedTitle: Locales.get('ValidationError'),
        localizedMessage: Locales.get(`IapticError_${code}`),
        debugMessage: message,
      });
    }
  }

  /// High level functions

  /**
   * Set the product definitions for the iaptic service
   * 
   * @param definitions - The product definitions to set
   */
  setProductDefinitions(definitions: IapticProductDefinition[]): void {
    this.products.add(definitions, [], []);
  }

  /**
   * Load products from the Store.
   * 
   * @example
   * ```typescript
   * await iaptic.loadProducts([
   *   { id: 'basic_subscription', type: 'paid subscription', entitlements: [ 'basic' ] },
   *   { id: 'premium_subscription', type: 'paid subscription', entitlements: [ 'basic', 'premium' ] },
   *   { id: 'premium_lifetime', type: 'non consumable', entitlements: [ 'basic', 'premium' ] },
   *   { id: 'coins_100', type: 'consumable', tokenType: 'coins', tokenValue: 100 },
   * ]);
   * ```
   * @param definitions - The products to load
   */
  async loadProducts(definitions?: IapticProductDefinition[]) {
    logger.info('loadProducts()');
    return this.products.load(definitions);
  }

  /**
   * Load and validate active purchases details from the Store and Iaptic using their receipts
   * 
   * @example
   * ```typescript
   * const purchases = await iaptic.loadPurchases();
   * ```
   *
   * @returns List of verified purchases.
   */
  async loadPurchases(): Promise<IapticVerifiedPurchase[]> {
    logger.info('loadPurchases()');
    if (Platform.OS === 'ios' && !IAP.isIosStorekit2()) {
      return this.getVerifiedPurchasesStorekit1(this.applicationUsername);
    }
    const purchases = await IAP.getAvailablePurchases();
    logger.info('Found ' + purchases.length + ' pending purchases');
    const results = await Promise.all(purchases.map(p => this.validate(p)));
    logger.info('Validation results: ' + JSON.stringify(results));
    return results.filter(r => r !== undefined);
  }

  /**
   * Load active purchases details from the Store and Iaptic using Storekit applicationReceipt
   * 
   * Passing applicationUsername allows to associate the purchases with a specific user.
   * 
   * @param applicationUsername - The username of the application
   * @returns List of verified purchases.
   */
  private async getVerifiedPurchasesStorekit1(applicationUsername?: string): Promise<IapticVerifiedPurchase[]> {
    const receipt = await IAP.getReceiptIOS({ forceRefresh: false });
    if (!receipt) {
      throw new Error('Receipt not found');
    }
    if (!this.config.iosBundleId) {
      throw new Error('iOS bundle ID is not set');
    }
    const bundleId = this.config.iosBundleId;
    const result = await validateReceipt({
      productId: bundleId,
      transactionId: bundleId,
      receipt: receipt,
      productType: 'application',
      applicationUsername,
      receiptSignature: '',
    }, this.products.all(), this.config);
    if (result.ok) {
      if (result.data.collection) {
        result.data.collection.forEach(purchase => this.purchases.addPurchase(purchase));
      }
      return result.data.collection ?? [];
    }
    else {
      throw new IapticError(result.message ?? 'Failed to validate purchase', {
        severity: IapticSeverity.WARNING,
        code: result.code ?? IapticErrorCode.UNKNOWN,
        status: result.status,
        localizedTitle: Locales.get('ValidationError'),
        localizedMessage: Locales.get(`IapticError_${result.code ?? IapticErrorCode.UNKNOWN}`),
        debugMessage: 'A receipt validation call failed with status ' + result.status,
      });
    }
  }

  /**
   * Check if the user has active access to a specific feature or content.
   * 
   * Entitlements represent features/content that users unlock through purchases.
   * They are defined in product definitions and automatically tracked when purchases are validated.
   * @see {@link setProductDefinitions}
   * 
   * @example
   * ```typescript
   * // Check premium access
   * if (iaptic.checkEntitlement('premium')) {
   *   showPremiumContent();
   * } else {
   *   showUpgradePrompt();
   * }
   * 
   * // Check specific feature access
   * const hasCoolFeature = iaptic.checkEntitlement('cool_feature');
   * ```
   * 
   * @param featureId - The unique identifier for the feature/content (e.g. "premium", "gold_status")
   * @returns True if the user has active access to the specified feature
   */
  checkEntitlement(featureId: string): boolean {
    for (const purchase of this.purchases.list()) {
      if (this.owned(purchase.id)) {
        const definition = this.products.getDefinition(purchase.id);
        if (definition?.entitlements?.some(e => e === featureId)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get all currently active entitlements for the user.
   * 
   * This aggregates entitlements from all non-expired purchases, including:
   * - Active subscriptions
   * - Non-consumable purchases
   * - Non-consumed consumables
   * 
   * Entitlements are defined in product definitions and automatically tracked when purchases are validated.
   * @see {@link setProductDefinitions}
   * 
   * @example
   * ```typescript
   * // Get all unlocked features
   * const unlockedFeatures = iaptic.listEntitlements();
   * // ['basic', 'premium', 'dark_theme']
   * ```
   * 
   * @returns Array of entitlement IDs the user currently has access to
   */
  listEntitlements(): string[] {
    const entitlements = new Set<string>();
    for (const purchase of this.purchases.list()) {
      const definition = this.products.getDefinition(purchase.id);
      if (definition?.entitlements) {
        definition.entitlements.forEach(e => entitlements.add(e));
      }
    }
    return Array.from(entitlements);
  }

  /**
   * Add an event listener for iaptic events
   * 
   * @param eventType - Type of event to listen for
   * @param listener - Callback function that will be called when the event occurs
   * @param context - Optional context to identify the listener (helpful for debugging)
   * 
   * @example
   * ```typescript
   * // Listen for subscription updates
   * iaptic.addEventListener('subscription.updated', (reason, purchase) => {
   *   console.log(`Subscription ${purchase.id} ${reason}`);
   * });
   * 
   * // Listen for pending purchase updates
   * iaptic.addEventListener('pendingPurchase.updated', (pendingPurchase) => {
   *   console.log(`Purchase ${pendingPurchase.productId} is now ${pendingPurchase.status}`);
   * });
   * 
   * // Listen for purchase updates
   * iaptic.addEventListener('purchase.updated', (purchase) => {
   *   console.log(`Purchase ${purchase.id} ${purchase.status}`);
   * });
   * 
   * // Listen for non-consumable purchases
   * iaptic.addEventListener('nonConsumable.owned', (purchase) => {
   *   console.log(`Non-consumable purchase ${purchase.id} is now owned`);
   * });
   * ```
   */
  addEventListener<T extends IapticEventType>(eventType: T, listener: IapticEventListener<T>, context: string = 'User') {
    return this.events.addEventListener(eventType, listener, context);
  }

  /**
   * Remove all event listeners for a specific event type
   * If no event type is specified, removes all listeners for all events
   * 
   * @param eventType - Optional event type to remove listeners for
   */
  removeAllEventListeners(eventType?: IapticEventType): void {
    this.events.removeAllEventListeners(eventType);
  }

  /**
   * Function used in developement to cleanup the cache of pending transactions.
   */
  async flushTransactions() {
    if (Platform.OS === 'android') {
      // On Android, try to flush failed purchases as a recovery mechanism
      try {
        await IAP.flushFailedPurchasesCachedAsPendingAndroid();
      }
      catch (e: any) {
        throw toIapticError(e, IapticSeverity.ERROR);
      }
    }
  }

  /**
   * Restore purchases from the Store.
   * 
   * @param progressCallback - Callback function that will be called with the progress of the restore operation
   *                           - The initial call is with -1, 0
   *                           - Subsequent calls are with the current progress
   *                           - The final call will have processed === total
   * 
   * @returns The number of purchases restored
   * @example
   * ```typescript
   * // Restore purchases with progress updates
   * iaptic.restorePurchases((processed, total) => {
   *   console.log(`Processed ${processed} of ${total} purchases`);
   * })
   * .then(numRestored => {
   *   console.log(`Restored ${numRestored} purchases`);
   * })
   * .catch(error => {
   *   console.error('Restore failed:', error);
   * });
   */
  async restorePurchases(progressCallback: (processed: number, total: number) => void): Promise<number> {
    // Make sure the user-provided callback doesn't impact the processing
    const progress = (processed: number, total: number) => {
      try {
        progressCallback(processed, total);
      } catch (error) {
        logger.warn('Error in restorePurchases progress callback: ' + error);
      }
    };
    try {
      progress(-1, 0);
      logger.info('Checking for any pending purchases');
      const purchases = await IAP.getAvailablePurchases();
      logger.info('Found ' + purchases.length + ' pending purchases');

      if (purchases.length === 0) {
        progress(0, 0);
        return 0;
      }

      progress(0, purchases.length);
      for (let i = 0; i < purchases.length; i++) {
        logger.debug('Processing purchase ' + (i + 1) + ' of ' + purchases.length);

        await this.iapEventsProcessor.processPurchase(purchases[i]);
        progress(i + 1, purchases.length);
      }
      logger.debug('Finished processing ' + purchases.length + ' purchases');
      return purchases.length;
    } catch (error: any) {
      progress(0, 0);
      throw toIapticError(error, IapticSeverity.ERROR);
    }
  }

  /**
   * Consume a purchase. Only for consumable products.
   * 
   * @param purchase - The purchase to consume
   */
  async consume(purchase: IapticVerifiedPurchase) {
    const nativePurchase = this.iapEventsProcessor.purchases.get(purchase.transactionId ?? purchase.id);
    if (nativePurchase) {
      await IAP.finishTransaction({
        purchase: nativePurchase,
        isConsumable: this.products.getType(purchase.id) === 'consumable'
      });
    }
  }

  /**
   * Opens the platform-specific subscription management page in the default browser
   */
  async manageSubscriptions() {
    const url = Platform.select({
      ios: 'https://apps.apple.com/account/subscriptions',
      android: 'https://play.google.com/store/account/subscriptions',
      default: '',
    });
    
    if (url) {
      await Linking.openURL(url);
    }
  }

  /**
   * Opens the platform-specific billing management page in the default browser
   */
  async manageBilling() {
    const url = Platform.select({
      ios: 'https://apps.apple.com/account/billing',
      android: 'https://play.google.com/store/paymentmethods',
      default: '',
    });
    
    if (url) {
      await Linking.openURL(url);
    }
  }

  /**
   * Check if a product is owned.
   * 
   * - For non-consumable products, this checks if the product is owned.
   * - For paid subscriptions, this checks if there is an active subscription.
   * - For consumables, this always returns false.
   * 
   * @param productId - The product identifier
   * @returns True if the product is owned
   */
  isOwned(productId: string): boolean {
    switch (this.products.getType(productId)) {
      case 'non consumable':
        return this.nonConsumables.owned(productId);
      case 'paid subscription':
        return this.subscriptions.activesOnly().some(p => p.productId === productId);
      default: // consumables are never "owned", they're "pending" or "consumed"
        return false;
    }
  }
}
