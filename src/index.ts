/**
 * Iaptic React Native SDK
 * 
 * Provides in-app purchase functionality with integrated receipt validation
 * through the Iaptic service.
 * 
 * The API entry point is {@link IapticRN}.
 * 
 * @example Quick Start: Using Iaptic Subscription UI Component
 * ```tsx
 * import { IapticSubscriptionView } from 'react-native-iaptic';
 * const app = (props) => {
 *   useEffect(() => {
 *     // Initialize the SDK with your configuration at startup
 *     IapticRN.initialize({
 *       appName: 'com.example.app',
 *       publicKey: 'YOUR_API_KEY',
 *       iosBundleId: 'com.yourcompany.app',
 *       products: [{
 *         id: 'premium_subscription',
 *         type: 'paid subscription',
 *         entitlements: ['basic', 'premium']
 *       }, {
 *         id: 'basic_subscription',
 *         type: 'paid subscription',
 *         entitlements: ['basic']
 *       }],
 *     });
 *   }, []);
 *   return (
 *     <View>
 *       // In your root node, add the modal component
 *       <IapticSubscriptionView entitlementLabels={{
 *         premium: 'Premium Features',
 *         basic: 'Basic Features',
 *       }} />
 * 
 *       // Anyway in your app, open the Subscription UI
 *       <TouchableOpacity onPress={() => IapticRN.presentSubscriptionView()}>
 *         <Text>Subscribe</Text>
 *       </TouchableOpacity>
 *     </View>
 *   );
 * };
 * 
 * // 2. Check access without a backend server
 * if (IapticRN.checkEntitlement('premium')) {
 *   // Unlock premium features
 * }
 * ```
 * 
 * With a backend server, you will get webhook calls from iaptic server
 * and store your user's subscription status (unlocking features server-side, safer).
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
export {
  IapticTokensManager,
  IapticTokenTransaction,
} from './classes/TokensManager';
export { Locales as IapticLocales, IapticSupportedLocales } from './classes/Locales';
export { IapticLocale } from './classes/IapticLocale';
export { IapticLogger } from './classes/IapticLogger';

/**
 * UI Components
 */
export { IapticTheme } from './IapticTheme';
export {
  IapticActiveSubscription,
  IapticActiveSubscriptionProps,
} from './components/ActiveSubscription';
export {
  IapticProductList as IapticProductList,
  IapticProductListProps as IapticProductListProps,
  IapticProductListStyles as IapticProductListStyles,
} from './components/ProductList';
export {
  IapticSubscriptionView,
  IapticSubscriptionViewProps,
} from './components/SubscriptionView/Modal';
export {
  IapticSubscriptionViewStyles as IapticSubscriptionViewStyles,
} from './components/SubscriptionView/Styles';
export {
  ProductPrice as IapticProductPrice,
} from './components/SubscriptionView/ProductPrice';