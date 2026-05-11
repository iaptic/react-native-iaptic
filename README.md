# Iaptic React Native SDK

[![npm version](https://img.shields.io/npm/v/iaptic-rn)](https://www.npmjs.com/package/iaptic-rn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust in-app purchase library for React Native that simplifies receipt validation and subscription management through the Iaptic service.

## ✨ Features

### Cross-Platform Support
- 🛒 **Unified Purchasing API** - Single interface for iOS and Android
- 🔄 **Subscription Management** - Easy status tracking and renewal handling

### Security & Reliability
- 🔒 **Secure Receipt Validation** - Server-side validation via Iaptic
- 🛡 **Error Handling** - Comprehensive error codes and localization

### Product Management
- 📦 **Product Catalog** - Structured product definitions with pricing phases
- 📊 **Entitlement Tracking** - Real-time purchase state management

## 📦 Installation

`react-native-iaptic` requires [`@iaptic/react-native-iap`](https://github.com/iaptic/react-native-iap) (an Iaptic-maintained fork of `react-native-iap@12.16.4` with the iOS new-architecture pod fix baked in — see [Why the fork](#why-the-fork) below). `@react-native-async-storage/async-storage` is optional — only needed if using `IapticTokensManager` for consumable token tracking.

```bash
npm install @iaptic/react-native-iap
npm install react-native-iaptic
# iOS only
cd ios && pod install && cd ..

# Only if using IapticTokensManager (consumable token tracking):
npm install @react-native-async-storage/async-storage@~2.1.0
```

> ⚠️ **Upgrading from 1.0.x?** Install `@iaptic/react-native-iap` explicitly — it moved to a peer dependency. `@react-native-async-storage/async-storage` is now optional (only needed for `IapticTokensManager`). The JavaScript API surface and Expo `withIAP` plugin behaviour are identical to upstream `react-native-iap@12.16.4`.

### Expo

Add the config plugin to your `app.json` / `app.config.js` so the Android `missingDimensionStrategy` (Play Store flavor) is wired up at prebuild time:

```js
// app.config.js
export default {
  expo: {
    plugins: [
      ['@iaptic/react-native-iap', { paymentProvider: 'Play Store' }]
    ],
    // ...
  },
};
```

### Why the fork

Upstream [`hyochan/react-native-iap`](https://github.com/hyochan/react-native-iap) was archived on 2026-04-26; development moved to the [OpenIAP monorepo](https://github.com/hyodotdev/openiap/tree/main/libraries/react-native-iap), where it shipped as a Nitro Modules rewrite (v15+, different API). The 12.x line therefore won't receive any further patches upstream — including the iOS pod fix needed for React Native ≥ 0.83 / Expo SDK ≥ 55 / new architecture (`Unable to find a specification for RCT-Folly depended upon by RNIap`). [`@iaptic/react-native-iap@12.16.5`](https://github.com/iaptic/react-native-iap) is `12.16.4` with that one fix applied — JavaScript / Java / Obj-C / Swift code is otherwise byte-identical to upstream `12.16.4`.

## 🚀 Quick Start

Here's a complete example to get you started:

```typescript
import { IapticRN } from 'react-native-iaptic';

// 1. Initialize with your configuration
IapticRN.initialize({
  appName: 'app.example.com',
  publicKey: 'YOUR_PUBLIC_KEY',
  iosBundleId: 'com.yourcompany.app',
  products: [{
    id: 'premium_monthly',
    type: 'paid subscription',
    entitlements: ['premium']
  },
  {
    id: 'coins_100',
    type: 'consumable',
    tokenType: 'coins',
    tokenValue: 100
  }
]);
```

### Using Subscription UI

The `IapticSubscriptionView` component provides a complete subscription management interface with purchase handling.

```tsx
// In your root node, add the modal component
<IapticSubscriptionView
  entitlementLabels={{
    premium: {
      label: "Premium Features",
      detail: "Exclusive content and advanced tools"
    }
  }}
  onPurchaseComplete={() => {
    // Update app state after purchase
    setEntitlements(IapticRN.listEntitlements());
  }}
  termsUrl="https://yourdomain.com/terms"
/>
```

### Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `entitlementLabels` | `Record<string, { label: string, detail?: string }>` | Labels and descriptions for each entitlement |
| `onPurchaseComplete` | `() => void` | Callback after successful purchase |
| `termsUrl` | `string` | URL for terms & conditions |
| `theme` | `object` | Customize colors (see [IapticTheme](https://www.iaptic.com/documentation/api/react-native-iaptic/interfaces/IapticTheme)) |

### Entitlement Management Example

```typescript
// AppState.ts
interface AppState {
  entitlements: string[];
}

// In your component
<TouchableOpacity
  onPress={() => checkAccess('premium')}
  style={styles.button}
>
  <Text>
    Premium Access: {appState.entitlements.includes('premium') ? '✅' : '🔒'}
  </Text>
</TouchableOpacity>
```

### Customization

Customize styles using the `styles` prop:

```typescript
<IapticSubscriptionView
  styles={{
    productCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12
    },
    ctaButton: {
      backgroundColor: '#4CAF50'
    }
  }}
/>
```

The component automatically handles:
- Landscape/portrait layouts
- Localization
- Purchase states
- Active subscription management
- Receipt validation

## Manual Purchase Flow

```typescript
// 4. Handle purchases
const offer = IapticRN.getProduct('premium_monthly')?.offers[0];
if (offer) {
  await IapticRN.order(offer);
}

// 5. Check access
if (IapticRN.checkEntitlement('premium')) {
  // Unlock premium features
}
```

## 💡 Core Concepts

### Product Definitions

Products can be subscriptions, consumables, or non-consumables. Each product can grant one or more entitlements:

```typescript
IapticRN.setProductDefinitions([
  // Subscription that unlocks premium features
  { 
    id: 'premium_monthly',
    type: 'paid subscription',
    entitlements: ['premium']
  },
  // Non-consumable that unlocks a specific feature
  {
    id: 'dark_theme',
    type: 'non consumable',
    entitlements: ['cool_feature']
  },
  // Consumable tokens/currency
  { 
    id: 'coins_100',
    type: 'consumable',
    tokenType: 'coins',
    tokenValue: 100
  }
]);
```

### Purchase Flow

Handle purchases with proper error management:

```typescript
try {
  await IapticRN.order(productOffer);
} catch (error) {
  showError(error);
}
```

### Restore Purchases

Allow users to restore their previous purchases:

```typescript
try {
  await IapticRN.restorePurchases((processed, total) => {
    console.log(`Processed ${processed} of ${total} purchases`);
  });
}
catch (error) {
  showError(error);
}
```

### Event Handling

Listen for purchase and subscription updates:

```typescript
// Listen for subscription updates
IapticRN.addEventListener('subscription.updated', (reason, purchase) => {
  console.log(`Subscription ${purchase.id} ${reason}`);
});

// Listen for pending purchase updates
IapticRN.addEventListener('pendingPurchase.updated', (pendingPurchase) => {
  console.log(`Purchase ${pendingPurchase.productId} is now ${pendingPurchase.status}`);
});

// Listen for purchase updates
IapticRN.addEventListener('purchase.updated', (purchase) => {
  console.log(`Purchase ${purchase.id} ${purchase.status}`);
});
```

### Feature Access Control

Check if users have access to specific features:

```typescript
// Check premium access
if (IapticRN.checkEntitlement('premium')) {
  showPremiumContent();
} else {
  showUpgradePrompt();
}

// List all active entitlements
const unlockedFeatures = IapticRN.listEntitlements();
// ['basic', 'premium', 'cool_feature']
```

## Error Handling

```typescript
function showError(error: Error | IapticError) {
  if (error instanceof IapticError) {
    trackAnalyticsEvent(error.code);
    if (error.severity === IapticSeverity.INFO) {
      console.log('Info:', error.localizedMessage);
      return;
    }
    Alert.alert(error.localizedTitle, error.localizedMessage);
  } else {
    Alert.alert('Unknown error', error.message);
  }
}
```

## 📚 API Reference

For complete API documentation, visit our [API Reference](https://www.iaptic.com/documentation/react-native).

#### Troubleshooting

- If your app fails to load products, check that your XCode project contains the "In-App Purchase" capability (XCode -> Project -> Targets (your app name) -> Capabilities). Hit "+ Capability" and add the In-App Purchase capability if it's missing.

- **iOS build fails on React Native ≥ 0.83 / Expo SDK ≥ 55 with `Unable to find a specification for RCT-Folly depended upon by RNIap`** — you're using upstream `react-native-iap` instead of `@iaptic/react-native-iap`. Switch to the fork (see [Installation](#installation)) and the error goes away. Background on why the fork exists is in [Why the fork](#why-the-fork).

## 🤝 Need Help?

- 📘 [API Documentation](https://www.iaptic.com/documentation/api/react-native-iaptic)
- 🐛 [Issue Tracker](https://github.com/iaptic/react-native-iaptic/issues)
- 📱 [Demo app](https://github.com/iaptic/react-native-iaptic-demo)
- 📧 [Support](mailto:support@iaptic.com)

## 📄 License

MIT © [Iaptic](https://www.iaptic.com)