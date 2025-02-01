import { IapticError, IapticSeverity } from "./classes/IapticError";
import { IapticLogger } from "./classes/IapticLogger";
import { IapticStore } from "./classes/IapticStore";
import { Locales } from "./classes/Locales";
import { IapticLocale } from "./classes/IapticLocale";
import { utils } from "./classes/Utils";
import {
  IapticStoreConfig,
  IapticErrorCode,
  IapticVerbosity,
  IapticProductDefinition,
  IapticVerifiedPurchase,
  IapticEventType,
  IapticEventListener,
  IapticProduct,
  IapticOffer,
  IapticPendingPurchase
} from "./types";
import type { md5UUID } from "./functions/md5UUID";
import type { md5 } from "./functions/md5";
import { subscriptionViewEvents } from './components/SubscriptionView/Modal';

/**
 * Configuration for Iaptic React Native SDK
 */
export interface IapticConfig extends IapticStoreConfig {
  products?: IapticProductDefinition[];
  applicationUsername?: string;
  verbosity?: IapticVerbosity;
}

/**
 * Iaptic React Native SDK
 */
export class IapticRN {

  /**
   * Utility functions
   */
  static readonly utils = utils;

  /**
   * Singleton instance of IapticStore
   */
  static store: IapticStore | undefined;

  // private static subscriptionViewRef: RefObject<SubscriptionViewHandle> | null = null;

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
    if (IapticRN.store) throw new IapticError('IapticRN.store is already initialized', {
      severity: IapticSeverity.ERROR,
      code: IapticErrorCode.SETUP,
      localizedTitle: Locales.get('ProgrammingError'),
      localizedMessage: Locales.get('IapticError_StoreAlreadyInitialized'),
      debugMessage: 'IapticRN.store is already initialized, call IapticRN.destroy() first',
    });
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
      severity: IapticSeverity.ERROR,
      code: IapticErrorCode.SETUP,
      localizedTitle: Locales.get('ProgrammingError'),
      localizedMessage: Locales.get('IapticError_StoreNotInitialized'),
      debugMessage: 'IapticRN.store is not initialized, call IapticRN.initialize() first',
    });
    return IapticRN.store;
  }

  static async getStoreSync(): Promise<IapticStore> {
    await IapticRN.waitForStore();
    return IapticRN.store!;
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
  static async setApplicationUsername(username: string | undefined) {
    (await IapticRN.getStoreSync()).setApplicationUsername(username);
  }

  /**
   * Set the verbosity level for the iaptic service.
   * 
   * @example
   * ```typescript
   * IapticRN.setVerbosity(IapticLoggerVerbosityLevel.DEBUG);
   * ```
   */
  static setVerbosity(verbosity: IapticVerbosity) {
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
    return (await IapticRN.getStoreSync()).loadProducts(definitions);
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
    return (await IapticRN.getStoreSync()).loadPurchases();
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
  static async consume(purchase: IapticVerifiedPurchase) {
    (await IapticRN.getStoreSync()).consume(purchase);
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
    if (!IapticRN.store) return false;
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
    if (!IapticRN.store) return [];
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
    // Some components might be created before the store is initialized.
    // We need to wait for the store to be initialized before adding the event listener.
    if (!IapticRN.store) {
      let remover = {
        remove: () => {
          clearInterval(interval);
        }
      };
      const interval = setInterval(() => {
        if (IapticRN.store) {
          clearInterval(interval);
          remover = IapticRN.getStore().addEventListener(eventType, listener, 'User');
        }
      }, 100);
      return remover;
    }
    else {
      return IapticRN.getStore().addEventListener(eventType, listener, 'User');
    }
  }

  /**
   * Remove all event listeners for a specific event type
   * If no event type is specified, removes all listeners for all events
   * 
   * @param eventType - Optional event type to remove listeners for
   */
  static removeAllEventListeners(eventType?: IapticEventType): void {
    if (!IapticRN.store) return;
    IapticRN.getStore().removeAllEventListeners(eventType);
  }

  /**
   * Get all products from the product catalog
   * 
   * @returns List of products
   * 
   * @example
   * ```typescript
   * const products = IapticRN.getProducts();
   * ```
   * 
   * @see {@link IapticProduct} for more information on the product object
   */
  static getProducts(): IapticProduct[] {
    if (!IapticRN.store) return [];
    return IapticRN.getStore().products.all();
  }

  /**
   * Get a product from the product catalog
   * 
   * @param productId - The product identifier
   * @returns The product or undefined if not found
   * 
   * @example
   * ```typescript
   * const product = IapticRN.getProduct('premium_monthly');
   * ```
   * 
   * @see {@link IapticProduct} for more information on the product object
   */
  static getProduct(productId: string): IapticProduct | undefined {
    if (!IapticRN.store) return undefined;
    return IapticRN.getStore().products.get(productId);
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
    if (!IapticRN.store) return [];
    return IapticRN.getStore().purchases.sorted();
  }

  /**
   * Get all pending purchases.
   * 
   * @returns List of pending purchases
   */
  static getPendingPurchases(): IapticPendingPurchase[] {
    if (!IapticRN.store) return [];
    return IapticRN.getStore().pendingPurchases.get();
  }

  /**
   * Order a product with an offer.
   * 
   * @param offer - The offer to order
   * 
   * @example
   * ```typescript
   * const offer = IapticRN.getProduct('premium_monthly')?.offers[0];
   * if (offer) {
   *   try {
   *     await IapticRN.order(offer);
   *     console.log('Purchase started successfully');
   *   } catch (error) {
   *     console.error('Purchase failed:', error);
   *   }
   * }
   * ```
   */
  static async order(offer: IapticOffer) {
    await IapticRN.waitForStore();
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
    await IapticRN.waitForStore();
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
    if (!IapticRN.store) return undefined;
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
    if (!IapticRN.store) return false;
    return IapticRN.getStore().isOwned(productId);
  }

  /**
   * Opens the platform-specific subscription management page.
   */
  static async manageSubscriptions() {
    await IapticRN.waitForStore();
    return IapticRN.getStore().manageSubscriptions();
  }

  /**
   * Opens the platform-specific billing management page.
   */
  static async manageBilling() {
    await IapticRN.waitForStore();
    return IapticRN.getStore().manageBilling();
  }

  /**
   * Add a locale for Iaptic provided components and error messages.
   * 
   * @param code - The language code
   * @param messages - The locale messages
   * 
   * @example
   * ```typescript
   * IapticRN.addLocale('fr', {...});
   * ```
   */
  static addLocale(code: string, messages: IapticLocale) {
    Locales.addLanguage(code, messages);
  }

  /**
   * Set the current locale for Iaptic provided components and error messages.
   * 
   * It's automatically set to the device's language, but you can override it.
   * 
   * @param code - The language code
   * 
   * @example
   * ```typescript
   * IapticRN.setLocale('fr');
   * ```
   */
  static setLocale(code: string, fallbackCode: string = 'en') {
    Locales.setLanguage(code, fallbackCode);
  }

  /**
   * Present a subscription comparison view with product cards and feature grid
   * 
   * @example Basic usage
   * ```typescript
   * // Show subscription view with feature labels
   * IapticRN.presentSubscriptionView({
   *   entitlementLabels: {
   *     premium: 'Premium Content',
   *     adfree: 'Ad-Free Experience',
   *     downloads: 'Unlimited Downloads'
   *   }
   * });
   * ```
   * 
   * @example With custom styling
   * ```typescript
   * // Customize the appearance
   * IapticRN.presentSubscriptionView({
   *   entitlementLabels: {...},
   *   styles: {
   *     productCard: {
   *       backgroundColor: '#f8f9fa',
   *       borderWidth: 1,
   *       borderColor: '#dee2e6'
   *     },
   *     ctaButton: {
   *       backgroundColor: '#4CAF50'
   *     }
   *   }
   * });
   * ```
   * 
   * @param options - Configuration for the subscription view
   * @param options.entitlementLabels - Localized text for each entitlement/feature
   * @param options.styles - Custom styles for different parts of the view
   * @param options.sortProducts - Whether to sort products by number of entitlements (default: true)
   * 
   * @note This is a singleton component - render it once at your root component:
   * ```tsx
   * // In your App.tsx
   * export default function App() {
   *   return (
   *     <>
   *       <MainComponent />
   *       <IapticSubscriptionView />
   *     </>
   *   );
   * }
   * ```
   */
  static presentSubscriptionView() {
    subscriptionViewEvents.emit('present');
    // if (this.subscriptionViewRef?.current) {
    //   this.subscriptionViewRef.current.show();
    // }
  }
    
  /**
   * @internal
   */
  static async waitForStore() {
    while (!IapticRN.store) await new Promise(resolve => setTimeout(resolve, 100));
  }

  // static setSubscriptionViewRef(ref: RefObject<SubscriptionViewHandle>) {
  //   this.subscriptionViewRef = ref;
  // }
}

