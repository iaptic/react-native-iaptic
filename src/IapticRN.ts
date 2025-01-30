import { getReceiptIOS, ProductPurchase } from "react-native-iap";
import { Platform, Linking } from "react-native";
import { IapticConfig, IapticErrorCode, IapticProduct, IapticVerifiedPurchase, IapticOffer, IapticLoggerVerbosityLevel, IapticPurchasePlatform, IapticProductDefinition } from "./types";
import * as IAP from 'react-native-iap';
import { StoreProducts } from "./classes/StoreProducts";
import { Purchases } from "./classes/Purchases";
import { Subscriptions } from "./classes/Subscriptions";
import { validateReceipt } from "./functions/validateReceipt";
import { IapticError, IapticErrorSeverity, toIapticError } from "./classes/IapticError";
import { Utils } from "./classes/Utils";
import { PendingPurchases } from "./classes/PendingPurchases";
import { logger } from "./classes/IapticLogger";
import { isUUID, md5UUID } from "./functions/md5UUID";
import { IapticEvents } from './classes/IapticEvents';
import { IapticEventType, IapticEventListener } from './types';
import { NonConsumables } from "./classes/NonConsumables";
import { Consumables } from "./classes/Consumables";
import { Locales } from "./classes/Locales";
import { IapEventsProcessor } from "./classes/IapEventsProcessor";


/** Main class for handling in-app purchases with iaptic */
export class IapticRN {

  /** Configuration for the iaptic service */
  readonly config: IapticConfig;

  /** Manages user-side event listeners */
  private events: IapticEvents = new IapticEvents();

  /** Product catalog containing all available products */
  readonly products: StoreProducts = new StoreProducts([], [], []);
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

  /** Utility functions */
  readonly utils: Utils = new Utils();

  /** Process events from react-native-iap plugin */
  private iapEventsProcessor = new IapEventsProcessor(this, this.events);

  /** Flag to check if the initialize() method has been called and succeeded */
  private initialized = false;

  /** The application username */
  private applicationUsername: string | undefined;

  /**
   * Creates a new instance of IapticRN
   * @param config - Configuration for the iaptic service
   */
  constructor(config: IapticConfig) {
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
  setApplicationUsername(value: string) {
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
      throw toIapticError(err, IapticErrorSeverity.WARNING, IapticErrorCode.SETUP, 'Failed to initialize the in-app purchase library, check your configuration.');
    }
  }

  /**
   * Initializes the In-App Purchase component.
   * 
   * - prepare the connection with the store.
   * - load products defined with setProductDefinitions()
   * - load available purchases
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
  setVerbosity(verbosity: IapticLoggerVerbosityLevel) {
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
   */
  async order(offer: IapticOffer) {
    logger.info(`order(${JSON.stringify(offer)}) applicationUsername:${this.applicationUsername}`);
    try {
      this.pendingPurchases.add(offer);
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
        (err.code === 'E_USER_CANCELLED') ? IapticErrorSeverity.INFO : IapticErrorSeverity.ERROR,
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
        severity: IapticErrorSeverity.ERROR,
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
        severity: IapticErrorSeverity.WARNING,
        code,
        localizedTitle: Locales.get('ValidationError'),
        localizedMessage: Locales.get(`IapticError_${code}`),
        debugMessage: message,
      });
    }
  }

  /// High level functions

  /**
   * Add product definitions to the product catalog.
   * 
   * Entitlements define what features/content a product unlocks. They can be shared
   * across multiple products (e.g. a subscription and lifetime purchase both granting "premium" access).
   * 
   * @example Non-consumable and subscription products
   * ```typescript
   * iaptic.setProductDefinitions([
   *   { 
   *     id: 'premium_monthly',
   *     type: 'paid subscription',
   *     entitlements: ['premium'] // Unlocks premium features
   *   },
   *   {
   *     id: 'dark_theme',
   *     type: 'non consumable',
   *     entitlements: ['dark_theme'] // Unlocks visual feature
   *   }
   * ]);
   * ```
   * 
   * @example Tokens
   * ```typescript
   * iaptic.setProductDefinitions([
   *   { id: 'coins_100', type: 'consumable', tokenType: 'coins', tokenValue: 100 },
   *   { id: 'coins_500', type: 'consumable', tokenType: 'coins', tokenValue: 500 },
   * ]);
   * ```
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
        severity: IapticErrorSeverity.WARNING,
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
   * // Check if user has premium access
   * const hasPremium = iaptic.checkEntitlement('premium');
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
        throw toIapticError(e, IapticErrorSeverity.ERROR);
      }
    }
  }

  /** Returns the number of purchases restored */
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
      throw toIapticError(error, IapticErrorSeverity.ERROR);
    }
  }

  /**
   * Consume a purchase. Only for consumable products.
   * 
   * @param purchase - The purchase to consume
   */
  consume(purchase: IapticVerifiedPurchase) {
    const nativePurchase = this.iapEventsProcessor.purchases.get(purchase.transactionId ?? purchase.id);
    if (nativePurchase) {
      IAP.finishTransaction({
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
}
