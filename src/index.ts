/**
 * Iaptic React Native SDK
 * 
 * Provides in-app purchase functionality with integrated receipt validation
 * through the Iaptic service.
 * 
 * @example Quick Start
 * ```typescript
 * // 1. Initialize with your configuration
 * const iaptic = new IapticRN({
 *   appName: 'com.example.app',
 *   publicKey: 'YOUR_API_KEY',
 *   iosBundleId: 'com.yourcompany.app',
 * });
 * 
 * // 2. Define your products
 * iaptic.setProductDefinitions([
 *   {
 *     id: 'premium_monthly',
 *     type: 'paid subscription',
 *     entitlements: ['premium']
 *   },
 *   {
 *     id: 'coins_100',
 *     type: 'consumable',
 *     tokenType: 'coins',
 *     tokenValue: 100
 *   }
 * ]);
 * 
 * // 3. Initialize connection and load products/purchases
 * await iaptic.initialize();
 * 
 * // 4. Handle purchases
 * const offer = iaptic.products.get('premium_monthly')?.offers[0];
 * if (offer) {
 *   await iaptic.order(offer); 
 * }
 * 
 * // 5. Check access
 * if (iaptic.checkEntitlement('premium')) {
 *   // Unlock premium features
 * }
 * ```
 * 
 * @packageDocumentation
 */

export * from './IapticRN';
export * from './types';

export { IapticError, IapticErrorSeverity } from './classes/IapticError';
export { Utils as IapticUtils } from './classes/Utils';
export { StoreProducts as IapticStoreProducts } from './classes/StoreProducts';
export { Purchases as IapticPurchases } from './classes/Purchases';
export {
  /**
   * Subscription management class
   */
  Subscriptions as IapticSubscriptions
} from './classes/Subscriptions';
export { PendingPurchases as IapticPendingPurchases } from './classes/PendingPurchases';
export { NonConsumables as IapticNonConsumables } from './classes/NonConsumables';
export { Consumables as IapticConsumables } from './classes/Consumables';
export { TokensManager as IapticTokensManager } from './classes/TokensManager';
export { Locales as IapticLocales } from './classes/Locales';
export { IapticLogger } from './classes/IapticLogger';

export { ActiveSubscription as IapticActiveSubscription } from './components/ActiveSubscription';
