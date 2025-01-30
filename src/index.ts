/**
 * Iaptic React Native SDK
 * 
 * Provides in-app purchase functionality with integrated receipt validation
 * through the Iaptic service.
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