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

`react-native-iaptic` relies on two peer modules you must install yourself. **Pin `react-native-iap` to the 12.x line** — `13.x` keeps the same JS API but still trips the iOS build error described under [Troubleshooting](#troubleshooting), and `14.x`+ is a Nitro Modules rewrite that's not yet supported by this SDK:

```bash
npm install 'react-native-iap@^12.16.1' @react-native-async-storage/async-storage
npm install react-native-iaptic
cd ios && pod install && cd ..
```

> ⚠️ **Breaking change in 1.1.0** — `react-native-iap` and `@react-native-async-storage/async-storage` moved from `dependencies` to `peerDependencies` so you can pin and upgrade them independently (and so the `react-native-iap` Expo config plugin resolves correctly). If you're upgrading from `1.0.x`, install the two peers explicitly as shown above.

### Expo

If you use Expo, add the `react-native-iap` config plugin to your `app.config.js` (or `app.json`) so the Android `missingDimensionStrategy` is wired up at prebuild time:

```js
// app.config.js
export default {
  expo: {
    plugins: ['react-native-iap'],
    // ...
  },
};
```

The plugin only resolves when `react-native-iap` is hoisted to your project's `node_modules/`, which is exactly what the peer-dep model in 1.1.0 guarantees.

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

- **iOS build fails on React Native ≥ 0.83 / Expo SDK ≥ 55 with New Architecture: `Unable to find a specification for RCT-Folly depended upon by RNIap`**

  Cause: `react-native-iap`'s `RNIap.podspec` (≤ 13.0.4 at the time of writing) depends directly on `RCT-Folly`, `RCTRequired`, `RCTTypeSafety`, and `ReactCommon/turbomodule/core` under `RCT_NEW_ARCH_ENABLED=1`. RN ≥ 0.83's prebuilt-artifacts pipeline ships those inside the `ReactNativeDependencies` pod and no longer publishes them as standalone podspecs, so CocoaPods can't resolve them.

  Workaround using [`patch-package`](https://github.com/ds300/patch-package) until upstream ships a fix:

  1. `npm install --save-dev patch-package postinstall-postinstall`
  2. Add to your `package.json`:
     ```json
     "scripts": { "postinstall": "patch-package" }
     ```
  3. Save the patch file below as `patches/react-native-iap+12.16.4.patch` (adjust the version suffix to match your installed `react-native-iap` version):
     ```diff
     diff --git a/node_modules/react-native-iap/RNIap.podspec b/node_modules/react-native-iap/RNIap.podspec
     --- a/node_modules/react-native-iap/RNIap.podspec
     +++ b/node_modules/react-native-iap/RNIap.podspec
     @@ -23,9 +23,13 @@ Pod::Spec.new do |s|
              "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
          }

     -    s.dependency "RCT-Folly"
     -    s.dependency "RCTRequired"
     -    s.dependency "RCTTypeSafety"
     -    s.dependency "ReactCommon/turbomodule/core"
     +    if respond_to?(:install_modules_dependencies, true)
     +      install_modules_dependencies(s)
     +    else
     +      s.dependency "RCT-Folly"
     +      s.dependency "RCTRequired"
     +      s.dependency "RCTTypeSafety"
     +      s.dependency "ReactCommon/turbomodule/core"
     +    end
        end
      end
     ```
  4. Run `npm install` (or `npx patch-package` once) to apply, then `cd ios && pod install`.

  This swaps the four hard-coded dependencies for React Native's `install_modules_dependencies(s)` helper, which already wires up the right pods whether you build RN from source or use the prebuilt artifacts. The same pattern is used by `@react-native-async-storage/async-storage` and other maintained native modules.

  Track upstream at [hyochan/react-native-iap](https://github.com/hyochan/react-native-iap). Once a fixed `react-native-iap` is published, you can drop the patch and pin to that version.

## 🤝 Need Help?

- 📘 [API Documentation](https://www.iaptic.com/documentation/api/react-native-iaptic)
- 🐛 [Issue Tracker](https://github.com/iaptic/react-native-iaptic/issues)
- 📱 [Demo app](https://github.com/iaptic/react-native-iaptic-demo)
- 📧 [Support](mailto:support@iaptic.com)

## 📄 License

MIT © [Iaptic](https://www.iaptic.com)