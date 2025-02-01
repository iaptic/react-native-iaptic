/**
 * Iaptic React Native SDK
 * 
 * Provides in-app purchase functionality with integrated receipt validation
 * through the Iaptic service.
 * 
 * The API entry point is {@link IapticRN}.
 * 
 * @example Using SubscriptionView
 * ```typescript
 * import { IapticSubscriptionView } from 'react-native-iaptic';
 * const app = (props) => {
 *   useEffect(() => {
 *     IapticRN.initialize({
 *       appName: 'com.example.app',
 *       publicKey: 'YOUR_API_KEY',
 *       iosBundleId: 'com.yourcompany.app',,
 *       products: [{
 *         id: 'premium_subscription',
 *         type: 'paid subscription',
 *         entitlements: ['premium']
 *       }, {
 *         id: 'basic_subscription',
 *         type: 'paid subscription',
 *         entitlements: ['basic']
 *       }],
 *     });
 *   }, []);
 *   return (
 *     <View> // your root node
 *       <TouchableOpacity onPress={() => IapticRN.presentSubscriptionView()}>
 *         <Text>Subscribe</Text>
 *       </TouchableOpacity>
 *       <IapticSubscriptionView entitlementLabels={{
 *         premium: 'Premium Features',
 *         basic: 'Basic Features',
 *       }} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example Quick Start
 * ```typescript
 * // 1. Initialize with your configuration
 * await IapticRN.initialize({
 *   appName: 'com.example.app',
 *   publicKey: 'YOUR_API_KEY',
 *   iosBundleId: 'com.yourcompany.app',
 *   products: [{
 *     id: 'premium_monthly',
 *     type: 'paid subscription',
 *     entitlements: ['premium']
 *   }, {
 *     id: 'coins_100',
 *     type: 'consumable',
 *     tokenType: 'coins',
 *     tokenValue: 100
 *   }]);
 * 
 * // 4. Handle purchases
 * const offer = IapticRN.getProduct('premium_monthly')?.offers[0];
 * if (offer) {
 *   await IapticRN.order(offer); 
 * }
 * 
 * // 5. Check access
 * if (IapticRN.checkEntitlement('premium')) {
 *   // Unlock premium features
 * }
 * ```
 * 
 * @packageDocumentation
 */

export { IapticRN, IapticConfig } from './IapticRN';
export * from './types';

export { IapticError, IapticSeverity } from './classes/IapticError';
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
export { IapticLocale } from './classes/IapticLocale';
export { IapticLogger } from './classes/IapticLogger';

/**
 * UI Components
 */
export {
  ActiveSubscription as IapticActiveSubscription,
} from './components/ActiveSubscription';
export {
  ProductList as IapticProductList,
  ProductListProps as IapticProductListProps,
  ProductListStyles as IapticProductListStyles,
} from './components/ProductList';
export {
  SubscriptionView as IapticSubscriptionView,
  SubscriptionViewProps as IapticSubscriptionViewProps,
} from './components/SubscriptionView/Modal';
export {
  SubscriptionViewStyles as IapticSubscriptionViewStyles,
} from './components/SubscriptionView/Styles';
export {
  ProductPrice as IapticProductPrice,
} from './components/SubscriptionView/ProductPrice';