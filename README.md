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

```bash
npm install react-native-iaptic
# or
yarn add react-native-iaptic
```

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

## 🤝 Need Help?

- 📘 [Documentation](https://www.iaptic.com/documentation/api/react-native-iaptic)
- 🐛 [Issue Tracker](https://github.com/iaptic/iaptic-react-native-sdk/issues)
- 📱 [Demo app](https://github.com/iaptic/react-native-iaptic-demo)
- 📧 [Support](mailto:support@iaptic.com)

## 📄 License

MIT © [Iaptic](https://www.iaptic.com)
