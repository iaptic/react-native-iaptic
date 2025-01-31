import { IapticError, IapticErrorSeverity } from "./classes/IapticError";
import { IapticLogger } from "./classes/IapticLogger";
import { IapticStore } from "./classes/IapticStore";
import { Locales } from "./classes/Locales";
import { Utils } from "./classes/Utils";
import {
  IapticStoreConfig,
  IapticErrorCode,
  IapticLoggerVerbosityLevel,
  IapticProductDefinition,
  IapticVerifiedPurchase,
  IapticEventType,
  IapticEventListener,
  IapticProduct,
  IapticOffer
} from "./types";
import type { md5UUID } from "./functions/md5UUID";
import type { md5 } from "./functions/md5";

/**
 * Configuration for Iaptic React Native SDK
 */
export interface IapticConfig extends IapticStoreConfig {
  products?: IapticProductDefinition[];
  applicationUsername?: string;
  verbosity?: IapticLoggerVerbosityLevel;
}

/**
 * Iaptic React Native SDK
 */
export class IapticRN {

  /**
   * Utility functions
   */
  static readonly utils: Utils = new Utils();

  /**
   * Singleton instance of IapticStore
   */
  static store: IapticStore | undefined;

  /**
   * Initialize the IapticRN singleton
   * 
   * @param config - The configuration for the IapticRN singleton
   * 
   * @example
   * ```typescript
   * IapticRN.initialize({
   *   appName: 'com.example.app',
   *   publicKey: '1234567890',
   *   iosBundleId: 'com.example.app',
   * });
   * ```
   */
  static async initialize(config: IapticConfig) {
    IapticRN.store = new IapticStore(config);
    if (config.verbosity) IapticRN.setVerbosity(config.verbosity);
    await IapticRN.store.initialize();
    if (config.products) {
      await IapticRN.loadProducts(config.products);
      await IapticRN.loadPurchases();
    }
  }

  /**
   * Instanciate the singleton instance of IapticStore
   * 
   * For advanced use-cases only.
   */
  static createStore(config: IapticConfig): IapticStore {
    IapticRN.store = new IapticStore(config);
    return IapticRN.store;
  }

  /**
   * Destroy the IapticRN singleton, cleanup everything.
   */
  static destroy() {
    if (IapticRN.store) IapticRN.store.destroy();
    IapticRN.store = undefined;
  }

  /**
   * Get the singleton instance of IapticStore
   * 
   * @throws {IapticError} If the store is not initialized
   */
  static getStore(): IapticStore {
    if (!IapticRN.store) throw new IapticError('IapticRN.store is not initialized', {
      severity: IapticErrorSeverity.ERROR,
      code: IapticErrorCode.SETUP,
      localizedTitle: Locales.get('ProgrammingError'),
      localizedMessage: Locales.get('IapticError_StoreNotInitialized'),
      debugMessage: 'IapticRN.store is not initialized, call IapticRN.initialize() first',
    });
    return IapticRN.store;
  }

  /**
   * Set the application username for the iaptic service.
   * 
   * This is used to track which user is making the purchase and associate it with the user's account.
   * 
   * - On iOS, the application username is also added as an appAccountToken in the form of a UUID formatted MD5 ({@link md5UUID}).
   * - On Android, the application username is added as an obfuscatedAccountIdAndroid in the form of a 64 characters string ({@link md5}).
   *
   * Don't forget to update the username in the app service if the user changes (login/logout).
   * 
   * @example
   * ```typescript
   * IapticRN.setApplicationUsername('user_123');
   * ```  
   * 
   * @example Clear the username (on logout)
   * ```typescript
   * IapticRN.setApplicationUsername(undefined);
   * ```
   */
  static setApplicationUsername(username: string | undefined) {
    IapticRN.getStore().setApplicationUsername(username);
  }

  /**
   * Set the verbosity level for the iaptic service.
   * 
   * @example
   * ```typescript
   * IapticRN.setVerbosity(IapticLoggerVerbosityLevel.DEBUG);
   * ```
   */
  static setVerbosity(verbosity: IapticLoggerVerbosityLevel) {
    IapticLogger.VERBOSITY = verbosity;
    if (IapticRN.store) IapticRN.store.setVerbosity(verbosity);
  }

  /**
   * Add product definitions to the product catalog.
   * 
   * Entitlements define what features/content a product unlocks. They can be shared
   * across multiple products (e.g. a subscription and lifetime purchase both granting "premium" access).
   * 
   * @example Non-consumable and subscription products
   * ```typescript
   * IapticRN.setProductDefinitions([
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
   * IapticRN.setProductDefinitions([
   *   { id: 'coins_100', type: 'consumable', tokenType: 'coins', tokenValue: 100 },
   *   { id: 'coins_500', type: 'consumable', tokenType: 'coins', tokenValue: 500 },
   * ]);
   * ```
   * 
   * @example
   * ```typescript
   * // Define a subscription and consumable product
   * IapticRN.setProductDefinitions([
   *   {
   *     id: 'premium_monthly',
   *     type: 'paid subscription',
   *     entitlements: ['premium'],
   *   },
   *   {
   *     id: 'coins_1000',
   *     type: 'consumable',
   *     tokenType: 'coins',
   *     tokenValue: 1000,
   *   }
   * ]);
   */
  static setProductDefinitions(productDefinitions: IapticProductDefinition[]) {
    IapticRN.getStore().setProductDefinitions(productDefinitions);
  }

  /**
   * Load products from the Store.
   * 
   * @example
   * ```typescript
   * await IapticRN.loadProducts([
   *   { id: 'basic_subscription', type: 'paid subscription', entitlements: [ 'basic' ] },
   *   { id: 'premium_subscription', type: 'paid subscription', entitlements: [ 'basic', 'premium' ] },
   *   { id: 'premium_lifetime', type: 'non consumable', entitlements: [ 'basic', 'premium' ] },
   *   { id: 'coins_100', type: 'consumable', tokenType: 'coins', tokenValue: 100 },
   * ]);
   * ```
   * @param definitions - The products to load
   */
  static async loadProducts(definitions?: IapticProductDefinition[]) {
    return IapticRN.getStore().loadProducts(definitions);
  }

  /**
   * Load and validate active purchases details from the Store and Iaptic using their receipts
   * 
   * Notice that this is done when initialize the Store already.
   * 
   * @example
   * ```typescript
   * const purchases = await IapticRN.loadPurchases();
   * ```
   *
   * @returns List of verified purchases.
   */
  static async loadPurchases(): Promise<IapticVerifiedPurchase[]> {
    return IapticRN.getStore().loadPurchases();
  }

  /**
   * Consume a purchase. Only for consumable products.
   * 
   * @param purchase - The purchase to consume
   * 
   * @example
   * ```typescript
   * IapticRN.consume(purchase);
   * ```
   * 
   * @see {@link TokensManager} for a convenient way to handle your consumable products.
   */
  static consume(purchase: IapticVerifiedPurchase) {
    IapticRN.getStore().consume(purchase);
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
     * if (IapticRN.checkEntitlement('premium')) {
     *   showPremiumContent();
     * } else {
     *   showUpgradePrompt();
     * }
     * 
     * // Check specific feature access
     * const hasCoolFeature = IapticRN.checkEntitlement('cool_feature');
     * ```
     * 
     * @param featureId - The unique identifier for the feature/content (e.g. "premium", "gold_status")
     * @returns True if the user has active access to the specified feature
     */
  static checkEntitlement(featureId: string): boolean {
    return IapticRN.getStore().checkEntitlement(featureId);
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
   * const unlockedFeatures = IapticRN.listEntitlements();
   * // ['basic', 'premium', 'dark_theme']
   * ```
   * 
   * @returns Array of entitlement IDs the user currently has access to
   */
  static listEntitlements(): string[] {
    return IapticRN.getStore().listEntitlements();
  }

  /**
   * Add an event listener for iaptic events
   * 
   * To remove a listener, call the returned object's `remove()` method.
   * 
   * @param eventType - Type of event to listen for
   * @param listener - Callback function that will be called when the event occurs
   * @param context - Optional context to identify the listener (helpful for debugging)
   * 
   * @example
   * ```typescript
   * // Listen for subscription updates
   * IapticRN.addEventListener('subscription.updated', (reason, purchase) => {
   *   console.log(`Subscription ${purchase.id} ${reason}`);
   * });
   * 
   * // Listen for pending purchase updates
   * IapticRN.addEventListener('pendingPurchase.updated', (pendingPurchase) => {
   *   console.log(`Purchase ${pendingPurchase.productId} is now ${pendingPurchase.status}`);
   * });
   * 
   * // Listen for purchase updates
   * IapticRN.addEventListener('purchase.updated', (purchase) => {
   *   console.log(`Purchase ${purchase.id} ${purchase.status}`);
   * });
   * 
   * // Listen for non-consumable purchases
   * IapticRN.addEventListener('nonConsumable.owned', (purchase) => {
   *   console.log(`Non-consumable purchase ${purchase.id} is now owned`);
   * });
   * ```
   * 
   * @example Remove a listener
   * ```typescript
   * const listener = IapticRN.addEventListener('purchase.updated', (purchase) => {
   *   console.log(`Purchase ${purchase.id} ${purchase.status}`);
   * });
   * listener.remove();
   * ```
   * 
   * @see {@link IapticEventType} for all possible event types
   */
  static addEventListener<T extends IapticEventType>(eventType: T, listener: IapticEventListener<T>) {
    return IapticRN.getStore().addEventListener(eventType, listener, 'User');
  }

  /**
   * Remove all event listeners for a specific event type
   * If no event type is specified, removes all listeners for all events
   * 
   * @param eventType - Optional event type to remove listeners for
   */
  static removeAllEventListeners(eventType?: IapticEventType): void {
    IapticRN.getStore().removeAllEventListeners(eventType);
  }

  /**
   * Get all products from the product catalog
   * 
   * @returns List of products
   */
  static getProducts(): IapticProduct[] {
    return IapticRN.getStore().products.all();
  }

  /**
   * Get all verified purchases.
   * 
   * @returns List of purchases, most recent first
   * 
   * @example
   * ```typescript
   * const purchases = IapticRN.getPurchases();
   * ```
   * 
   * @see {@link IapticVerifiedPurchase} for more information on the purchase object
   */
  static getPurchases(): IapticVerifiedPurchase[] {
    return IapticRN.getStore().purchases.sorted();
  }

  /**
   * Order a product with an offer.
   * 
   * @param offer - The offer to order
   * 
   * @example
   * ```typescript
   * // Order a subscription offer
   * const subscriptionOffer = IapticRN.products.get('premium_monthly')?.offers[0];
   * if (subscriptionOffer) {
   *   try {
   *     await IapticRN.order(subscriptionOffer);
   *     console.log('Purchase started successfully');
   *   } catch (error) {
   *     console.error('Purchase failed:', error);
   *   }
   * }
   * ```
   */
  static async order(offer: IapticOffer) {
    return IapticRN.getStore().order(offer);
  }


  /**
   * Restore purchases from the Store.
   * 
   * @param progressCallback - Callback function that will be called with the progress of the restore operation
   *                           - An initial call with -1, 0 when the operation starts.
   *                           - Subsequent calls are with the current progress (processed, total).
   *                           - The final call will have processed === total, you know the operation is complete.
   * 
   * @returns The number of purchases restored
   * @example
   * ```typescript
   * // Restore purchases with progress updates
   * const numRestored = await IapticRN.restorePurchases((processed, total) => {
   *   console.log(`Processed ${processed} of ${total} purchases`);
   * });
   * ```
   */
  static async restorePurchases(progressCallback: (processed: number, total: number) => void): Promise<number> {
    return IapticRN.getStore().restorePurchases(progressCallback);
  }

  /**
   * Get the active subscription (if any)
   * 
   * For **apps that sell multiple subscriptions** that can be active at the same time,
   * this returns the first one. To check if there is any active subscription:
   * - {@link getPurchases} to manually parse and find all active subscriptions.
   * - {@link isOwned} with all your product ids to check if there is any active subscription.
   * 
   * @returns The active subscription or undefined if there is no active subscription
   * 
   * @see {@link IapticVerifiedPurchase} for more information on the purchase object
   * 
   * @example
   * ```typescript
   * const activeSubscription = IapticRN.getActiveSubscription();
   * if (activeSubscription) {
   *   console.log(`Active subscription: ${activeSubscription.productId}`);
   *   if (activeSubscription.renewalIntent === 'Renew') {
   *     console.log('Will renew on: ' + new Date(activeSubscription.expiryDate).toLocaleDateString());
   *   }
   *   else {
   *     console.log('Will expire on: ' + new Date(activeSubscription.expiryDate).toLocaleDateString());
   *   }
   * }
   * ```
   */
  static getActiveSubscription(): IapticVerifiedPurchase | undefined {
    return IapticRN.getStore().subscriptions.active();
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
   * 
   * @example
   * ```typescript
   * if (IapticRN.isOwned('premium_subscription')) {
   *   console.log('User has an active subscription');
   * }
   * ```
   */
  static isOwned(productId: string): boolean {
    return IapticRN.getStore().isOwned(productId);
  }

  /**
   * Opens the platform-specific subscription management page.
   */
  static async manageSubscriptions() {
    return IapticRN.getStore().manageSubscriptions();
  }

  /**
   * Opens the platform-specific billing management page.
   */
  static async manageBilling() {
    return IapticRN.getStore().manageBilling();
  }
}
