import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Locales } from '../classes/Locales';
import { IapticRN } from '../IapticRN';

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
 * @usage
 * 
 * Basic usage:
 * ```tsx
 * <ActiveSubscription 
 *   iaptic={iapticInstance} 
 * />
 * ```
 * 
 * With custom styling:
 * ```tsx
 * <ActiveSubscription
 *   iaptic={iapticInstance}
 *   styles={{
 *     container: { borderWidth: 1, borderRadius: 10 },
 *     title: { color: '#2c3e50' },
 *     trialTag: { backgroundColor: '#f0e6fa' }
 *   }}
 * />
 * ```
 * 
 * @props
 * - `iaptic` (required): IapticRN instance - Must be properly initialized
 * - `styles`: Optional style overrides for complete visual control
 * 
 * @behavior
 * - Automatically subscribes to subscription updates
 * - Shows nothing when no active subscription exists
 * - Handles platform-specific management links (opens native UI)
 * 
 * @localization
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
 * @styling
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
 */
interface ActiveSubscriptionProps {
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
}

/**
 * Subscription status component that automatically updates when subscription changes.
 * 
 * @component
 * 
 * @example
 * // Full example with entitlements
 * <ActiveSubscription
 *   iaptic={iapticInstance}
 *   styles={{
 *     entitlementTag: { 
 *       backgroundColor: '#e3f2fd',
 *       color: '#1976d2'
 *     }
 *   }}
 * />
 */
export const ActiveSubscription: React.FC<ActiveSubscriptionProps> = ({
  styles: customStyles,
}) => {
  // Track subscription state
  const [state, setState] = useState({
    subscription: IapticRN.getActiveSubscription(),
    entitlements: IapticRN.listEntitlements(),
  });

  useEffect(() => {
    // Subscribe to changes in the IapticRN instance
    const listener = IapticRN.addEventListener('subscription.updated', (_subscription) => {
      setState({
        subscription: IapticRN.getActiveSubscription(),
        entitlements: IapticRN.listEntitlements(),
      });
    });
    
    // Cleanup on unmount
    return () => listener.remove();
  }, []);

  if (!state.subscription) {
    return null;
  }

  const formatDateTime = (date: number | undefined): [string, string] => {
    if (!date) return ['', ''];
    const dateObj = new Date(date);
    return [dateObj.toLocaleDateString(), dateObj.toLocaleTimeString()];
  };

  return (
    <View style={[styles.subscriptionItem, customStyles?.container]}>
      <Text style={[styles.subscriptionTitle, customStyles?.title]}>
        {state.subscription.id}
      </Text>
      <Text style={[
        styles.subscriptionStatus,
        { color: !state.subscription.isExpired ? 'green' : 'red' },
        customStyles?.status
      ]}>
        {!state.subscription.isExpired 
          ? Locales.get('ActiveSubscription_Status_Active')
          : Locales.get('ActiveSubscription_Status_Expired')
        }
        {!state.subscription.isExpired && state.subscription.renewalIntent === 'Lapse' && (
          `\n ⚠️ ${Locales.get('ActiveSubscription_WillCancel', formatDateTime(state.subscription.expiryDate))}`
        )}
        {!state.subscription.isExpired && state.subscription.renewalIntent === 'Renew' && (
          `\n${Locales.get('ActiveSubscription_WillRenew', formatDateTime(state.subscription.expiryDate))}`
        )}
      </Text>
      <View style={[styles.tagsContainer, customStyles?.tagContainer]}>
        {state.subscription.isTrialPeriod && 
          <Text style={[
            styles.tag, 
            styles.trialTag,
            customStyles?.baseTag,
            customStyles?.trialTag
          ]}>
            {Locales.get('ActiveSubscription_Tag_Trial')}
          </Text>
        }
        {state.subscription.isBillingRetryPeriod && 
          <Text style={[
            styles.tag, 
            styles.retryTag,
            customStyles?.baseTag,
            customStyles?.retryTag
          ]}>
            {Locales.get('ActiveSubscription_Tag_Retry')}
          </Text>
        }
        {state.entitlements.map((entitlement: string) => (
          <Text key={entitlement} style={[
            styles.tag, 
            customStyles?.baseTag,
            customStyles?.entitlementTag
          ]}>
            {entitlement}
          </Text>
        ))}
      </View>
      <TouchableOpacity onPress={
        () => IapticRN.manageSubscriptions()
      }>
        <Text style={[styles.manageLink, customStyles?.manageLink]}>
          {Locales.get('ActiveSubscription_ManageSubscriptions')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={
        () => IapticRN.manageBilling()
      }>
        <Text style={[styles.manageLink, customStyles?.manageLink]}>
          {Locales.get('ActiveSubscription_ManageBilling')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  subscriptionItem: {
    padding: 10,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#f3e5f5',
    color: '#6200ee',
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
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginTop: 3,
    marginBottom: 3,
  },
}); 
