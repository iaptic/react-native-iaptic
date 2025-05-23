import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Locales } from '../classes/Locales';
import { IapticRN } from '../IapticRN';
import { IapticTheme, defaultTheme } from '../IapticTheme';

/**
 * Real-time subscription status display component with built-in management links.
 * 
 * Key features:
 * - Shows current subscription status (active/expired)
 * - Displays trial/billing retry indicators when applicable
 * - Lists granted entitlements (access rights)
 * - Provides management links for subscription/billing
 * - Auto-updates when subscription changes
 * - Full style customization support
 * 
 * @example
 * 
 * Basic usage:
 * ```tsx
 * <IapticActiveSubscription />
 * ```
 * 
 * With custom styling:
 * ```tsx
 * <IapticActiveSubscription
 *   styles={{
 *     container: { borderWidth: 1, borderRadius: 10 },
 *     title: { color: '#2c3e50' },
 *     trialTag: { backgroundColor: '#f0e6fa' }
 *   }}
 * />
 * ```
 * 
 * @remarks
 * - Automatically subscribes to subscription updates
 * - Shows nothing when no active subscription exists
 * - Handles platform-specific management links (opens native UI)
 * 
 * Requires these translation keys (via Locales.get()):
 * - ActiveSubscription_Status_Active
 * - ActiveSubscription_Status_Expired
 * - ActiveSubscription_WillCancel
 * - ActiveSubscription_WillRenew
 * - ActiveSubscription_Tag_Trial
 * - ActiveSubscription_Tag_Retry
 * - ActiveSubscription_ManageSubscriptions
 * - ActiveSubscription_ManageBilling
 * 
 * Style object accepts these optional properties:
 * | Style Key       | Applies To                          | Default Theme               |
 * |-----------------|-------------------------------------|-----------------------------|
 * | container       | Outer container                     | Light gray background       |
 * | title           | Subscription title (product ID)     | Bold 16px text              |
 * | status          | Status text (active/expired)        | Green/red color             |
 * | tagContainer    | Container for all tags              | Flex row with 8px gap       |
 * | baseTag         | Base style for all tags             | Rounded pill shape          |
 * | trialTag        | Trial period indicator              | Purple accent               |
 * | retryTag        | Billing retry status                | Orange accent               |
 * | entitlementTag  | Entitlement access badges           | Green accent                |
 * | manageLink      | "Manage" links                      | Blue underlined text        |
 * 
 * @internal
 */
export interface IapticActiveSubscriptionProps {
  /**
   * Localized labels for each entitlement
   * 
   * @default {}
   * @example {
   *   pro: { label: 'Pro Features', detail: 'Unlimited access to premium features' },
   *   premium: { label: 'Premium Access', detail: 'Unlimited downloads and priority support' }
   * }
   */
  entitlementLabels?: Record<string, { label: string, detail?: string }>;
  /**
   * Style customization object allowing overrides for specific UI components
   */
  styles?: {
    /** Outer container wrapping the entire component */
    container?: ViewStyle;
    /** Style for the subscription title (product ID) */
    title?: TextStyle;
    /** Style for the status message text */
    status?: TextStyle;
    /** Container holding all tags (trial, retry, entitlements) */
    tagContainer?: ViewStyle;
    /** Base style applied to all tags before specific variants */
    baseTag?: TextStyle;
    /** Style override for trial period indicator tag */
    trialTag?: TextStyle;
    /** Style override for billing retry status tag */
    retryTag?: TextStyle;
    /** Style for entitlement badges showing access rights */
    entitlementTag?: TextStyle;
    /** Style for the "Manage Subscriptions" and "Manage Billing" links */
    manageLink?: TextStyle;
  };
  /** Theme configuration */
  theme?: Partial<IapticTheme>;
}

/**
 * Subscription status component that automatically updates when subscription changes.
 * 
 * Key features:
 * - Shows current subscription status (active/expired)
 * - Displays trial/billing retry indicators when applicable
 * - Lists granted entitlements (access rights)
 * - Provides management links for subscription/billing
 * - Auto-updates when subscription changes
 * - Full style customization support
 * 
 * @example
 * 
 * Basic usage:
 * ```tsx
 * <IapticActiveSubscription />
 * ```
 * 
 * With custom styling:
 * ```tsx
 * <IapticActiveSubscription
 *   styles={{
 *     container: { borderWidth: 1, borderRadius: 10 },
 *     title: { color: '#2c3e50' },
 *     trialTag: { backgroundColor: '#f0e6fa' }
 *   }}
 * />
 * ```
 * 
 * @remarks This React Component
 * 
 * - Automatically subscribes to subscription updates
 * - Shows nothing when no active subscription exists
 * - Handles platform-specific management links (opens native UI)
 * 
 * Requires these translation keys (via Locales.get()):
 * - ActiveSubscription_Status_Active
 * - ActiveSubscription_Status_Expired
 * - ActiveSubscription_WillCancel
 * - ActiveSubscription_WillRenew
 * - ActiveSubscription_Tag_Trial
 * - ActiveSubscription_Tag_Retry
 * - ActiveSubscription_ManageSubscriptions
 * - ActiveSubscription_ManageBilling
 * 
 * @example
 * // Full example with entitlements
 * <IapticActiveSubscription
 *   iaptic={iapticInstance}
 *   entitlementLabels={{
 *     pro: { label: 'Pro Features', detail: 'Unlimited access to premium features' },
 *     premium: { label: 'Premium Access', detail: 'Unlimited downloads and priority support' }
 *   }}
 *   styles={{
 *     entitlementTag: { 
 *       backgroundColor: '#e3f2fd',
 *       color: '#1976d2'
 *     }
 *   }}
 * />
 * 
 * @internal
 */
export const IapticActiveSubscription: React.FC<IapticActiveSubscriptionProps> = (props: IapticActiveSubscriptionProps) => {
  const {
    entitlementLabels = {},
    styles: customStyles = {},
    theme: customTheme = {},
  } = props;

  const theme = { ...defaultTheme, ...customTheme };

  // Track subscription state
  const [state, setState] = useState({
    subscription: IapticRN.getActiveSubscription(),
    entitlements: IapticRN.listEntitlements(),
    products: IapticRN.getProducts(),
  });

  useEffect(() => {
    function updateState() {
      setState({
        subscription: IapticRN.getActiveSubscription(),
        entitlements: IapticRN.listEntitlements(),
        products: IapticRN.getProducts(),
      });
    }

    // Subscribe to changes in the IapticRN instance
    const listeners = [
      IapticRN.addEventListener('subscription.updated', updateState),
      IapticRN.addEventListener('products.updated', updateState),
    ];
    
    // Cleanup on unmount
    return () => listeners.forEach(listener => listener.remove());
  }, []);

  if (!state.subscription) {
    return null;
  }

  const formatDateTime = (date: number | undefined): [string, string] => {
    if (!date) return ['', ''];
    return [
      Locales.get('DateFormatter_Date', [new Date(date).toLocaleDateString()]),
      Locales.get('DateFormatter_Time', [new Date(date).toLocaleTimeString()])
    ];
  };

  return (
    <View style={[styles(theme).subscriptionItem, customStyles?.container]}>
      <Text style={[styles(theme).subscriptionTitle, customStyles?.title]}>
        {state.products.find(p => p.id === state.subscription?.productId)?.title ?? state.subscription.productId}
      </Text>
      <Text style={[
        styles(theme).subscriptionStatus,
        { color: !state.subscription.isExpired ? theme.successColor : theme.errorColor },
        customStyles?.status
      ]}>
        {state.subscription.isExpired && Locales.get('ActiveSubscription_Status_Expired')}
        {!state.subscription.isExpired && state.subscription.renewalIntent === 'Lapse' && (
          `⚠️ ${Locales.get('ActiveSubscription_WillCancel', formatDateTime(state.subscription.expiryDate))}`
        )}
        {!state.subscription.isExpired && state.subscription.renewalIntent === 'Renew' && (
          `${Locales.get('ActiveSubscription_WillRenew', formatDateTime(state.subscription.expiryDate))}`
        )}
      </Text>
      <View style={[styles(theme).tagsContainer, customStyles?.tagContainer]}>
        {state.subscription.isTrialPeriod && 
          <Text style={[
            styles(theme).tag, 
            styles(theme).trialTag,
            customStyles?.baseTag,
            customStyles?.trialTag
          ]}>
            {Locales.get('ActiveSubscription_Tag_Trial')}
          </Text>
        }
        {state.subscription.isBillingRetryPeriod && 
          <Text style={[
            styles(theme).tag, 
            styles(theme).retryTag,
            customStyles?.baseTag,
            customStyles?.retryTag
          ]}>
            {Locales.get('ActiveSubscription_Tag_Retry')}
          </Text>
        }
        {state.entitlements.map((entitlement: string) => (
          <Text key={entitlement} style={[
            styles(theme).tag, 
            customStyles?.baseTag,
            customStyles?.entitlementTag
          ]}>
            {entitlementLabels?.[entitlement]?.label ?? entitlement}
          </Text>
        ))}
      </View>
      <TouchableOpacity onPress={
        () => IapticRN.manageSubscriptions()
      }>
        <Text style={[styles(theme).manageLink, customStyles?.manageLink]}>
          {Locales.get('ActiveSubscription_ManageSubscriptions')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={
        () => IapticRN.manageBilling()
      }>
        <Text style={[styles(theme).manageLink, customStyles?.manageLink]}>
          {Locales.get('ActiveSubscription_ManageBilling')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (theme: IapticTheme) => StyleSheet.create({
  subscriptionItem: {
    padding: 10,
    backgroundColor: theme.backgroundColor,
    borderRadius: 8,
    marginBottom: 10,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscriptionStatus: {
    fontSize: 14,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
  trialTag: {
    backgroundColor: `${theme.primaryColor}20`, // 20% opacity
    color: theme.primaryColor,
  },
  retryTag: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
  },
  entitlementTag: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  manageLink: {
    color: theme.primaryColor,
    textDecorationLine: 'underline',
    marginTop: 3,
    marginBottom: 3,
  },
}); 
