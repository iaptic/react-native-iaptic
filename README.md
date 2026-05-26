# Iaptic React Native SDK

[![npm version](https://img.shields.io/npm/v/iaptic-rn)](https://www.npmjs.com/package/iaptic-rn)
[![npm downloads](https://img.shields.io/npm/dm/iaptic-rn)](https://www.npmjs.com/package/iaptic-rn)
[![types included](https://img.shields.io/npm/types/iaptic-rn)](https://www.npmjs.com/package/iaptic-rn)
[![bundle size](https://img.shields.io/bundlephobia/minzip/iaptic-rn)](https://bundlephobia.com/package/iaptic-rn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made by Iaptic](https://img.shields.io/badge/made%20by-Iaptic-1e88e5)](https://www.iaptic.com)

Drop-in subscription paywall and server-validated in-app purchases for **React Native**, backed by the [Iaptic](https://www.iaptic.com) service. Works on **iOS (StoreKit)** and **Android (Google Play Billing)**, with first-class **TypeScript** support.

> **What is Iaptic?** Iaptic is a hosted receipt-validation and subscription-management service. The SDK never trusts a local receipt — every purchase is verified server-side. [Learn more →](https://www.iaptic.com)

<p align="center">
  <a href="https://www.iaptic.com/documentation/react-native">
    <img src="https://www.iaptic.com/images/react-native-iaptic.jpg" alt="IapticSubscriptionView drop-in UI screenshot" width="320" />
  </a>
  <br />
  <em>The <code>IapticSubscriptionView</code> drop-in paywall, rendered on iOS.</em>
</p>

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
  - [Expo](#expo)
- [Quick Start](#quick-start)
- [Drop-in Subscription UI](#drop-in-subscription-ui)
  - [Props reference](#props-reference)
  - [Customization](#customization)
- [Core Concepts](#core-concepts)
  - [Product definitions](#product-definitions)
  - [Purchase flow](#purchase-flow)
  - [Restore purchases](#restore-purchases)
  - [Event handling](#event-handling)
  - [Feature access control](#feature-access-control)
- [Manual Purchase Flow](#manual-purchase-flow)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)
- [Upgrading](#upgrading)
- [Why the fork?](#why-the-fork)
- [Documentation](#documentation)
- [Support & Community](#support--community)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## ✨ Features

- 🛒 Unified iOS + Android purchasing API
- 🔄 Subscription tracking with renewal events
- 🔒 Server-side receipt validation via Iaptic
- 🎨 Themable drop-in paywall (`IapticSubscriptionView`)
- 📦 Product catalog with entitlements model
- 🛡 Typed errors with localized messages
- 🪙 Optional token/credit tracking (`IapticTokensManager`)
- ⚛️ First-class TypeScript types

## Requirements

| Requirement | Version |
|---|---|
| React Native | ≥ 0.71 (tested through 0.85) |
| Expo SDK | ≥ 49 (new architecture supported on SDK 55+) |
| iOS deployment target | 13.0 |
| Android `minSdkVersion` | 24 |
| Node | ≥ 18 |
| TypeScript | ≥ 4.7 (types ship with the package) |
| `@iaptic/react-native-iap` | ^12.16.6 (peer) |
| `react` | ≥ 17 (peer) |
| `@react-native-async-storage/async-storage` | optional — `^3.1.0` or `~2.1.0` (only if using `IapticTokensManager`) |

## Installation

`react-native-iaptic` requires [`@iaptic/react-native-iap`](https://github.com/iaptic/react-native-iap), an Iaptic-maintained fork of `react-native-iap@12.16.4` with the iOS new-architecture pod fix and the Kotlin `currentActivity` fix baked in. See [Why the fork?](#why-the-fork) below.

```bash
npm install @iaptic/react-native-iap react-native-iaptic
# iOS only
cd ios && pod install && cd ..

# Only if using IapticTokensManager (consumable token tracking):
npm install @react-native-async-storage/async-storage@^3.1.0
```

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

## Quick Start

```typescript
import { IapticRN } from 'react-native-iaptic';

IapticRN.initialize({
  appName: 'app.example.com',
  publicKey: 'YOUR_PUBLIC_KEY',
  iosBundleId: 'com.yourcompany.app',
  products: [
    { id: 'premium_monthly', type: 'paid subscription', entitlements: ['premium'] },
    { id: 'coins_100',       type: 'consumable',        tokenType: 'coins', tokenValue: 100 },
  ],
});
```

That's the minimum needed to load products. From here you can either drop in the prebuilt [subscription UI](#drop-in-subscription-ui), or wire up the [manual purchase flow](#manual-purchase-flow) yourself.

## Drop-in Subscription UI

`IapticSubscriptionView` is a full-screen subscription picker with built-in purchase, restore, and active-subscription management. Render it once near your app root and open it on demand.

<p align="center">
  <img src="https://www.iaptic.com/images/react-native-iaptic.jpg" alt="IapticSubscriptionView on iOS" width="280" />
</p>

```tsx
<IapticSubscriptionView
  entitlementLabels={{
    premium: {
      label: 'Premium Features',
      detail: 'Exclusive content and advanced tools',
    },
  }}
  onPurchaseComplete={() => {
    setEntitlements(IapticRN.listEntitlements());
  }}
  termsUrl="https://yourdomain.com/terms"
/>
```

The component automatically handles landscape/portrait layouts, localization, purchase states, active-subscription management, and receipt validation.

### Props reference

| Prop | Type | Description |
|------|------|-------------|
| `entitlementLabels` | `Record<string, { label: string, detail?: string }>` | Labels and descriptions for each entitlement |
| `onPurchaseComplete` | `() => void` | Callback after successful purchase |
| `termsUrl` | `string` | URL for terms & conditions |
| `theme` | `IapticTheme` | Customize colors — see [IapticTheme](https://www.iaptic.com/documentation/api/react-native-iaptic/interfaces/IapticTheme) |
| `styles` | `Partial<IapticSubscriptionViewStyles>` | Per-element style overrides — see [IapticSubscriptionViewStyles](https://www.iaptic.com/documentation/api/react-native-iaptic/interfaces/IapticSubscriptionViewStyles) |

### Customization

```tsx
<IapticSubscriptionView
  styles={{
    productCard: { backgroundColor: '#FFFFFF', borderRadius: 12 },
    ctaButton:   { backgroundColor: '#4CAF50' },
  }}
/>
```

For the full list of overridable style slots, see [`IapticSubscriptionViewStyles`](https://www.iaptic.com/documentation/api/react-native-iaptic/interfaces/IapticSubscriptionViewStyles).

## Core Concepts

### Product definitions

Products can be subscriptions, consumables, or non-consumables. Each can grant one or more entitlements:

```typescript
IapticRN.setProductDefinitions([
  // Subscription that unlocks premium features
  { id: 'premium_monthly', type: 'paid subscription', entitlements: ['premium'] },

  // Non-consumable that unlocks a specific feature
  { id: 'dark_theme', type: 'non consumable', entitlements: ['cool_feature'] },

  // Consumable tokens / currency
  { id: 'coins_100', type: 'consumable', tokenType: 'coins', tokenValue: 100 },
]);
```

### Purchase flow

```typescript
try {
  await IapticRN.order(productOffer);
} catch (error) {
  showError(error);
}
```

### Restore purchases

```typescript
try {
  await IapticRN.restorePurchases((processed, total) => {
    console.log(`Processed ${processed} of ${total} purchases`);
  });
} catch (error) {
  showError(error);
}
```

### Event handling

```typescript
IapticRN.addEventListener('subscription.updated', (reason, purchase) => {
  console.log(`Subscription ${purchase.id} ${reason}`);
});

IapticRN.addEventListener('pendingPurchase.updated', (pendingPurchase) => {
  console.log(`Purchase ${pendingPurchase.productId} is now ${pendingPurchase.status}`);
});

IapticRN.addEventListener('purchase.updated', (purchase) => {
  console.log(`Purchase ${purchase.id} ${purchase.status}`);
});
```

### Feature access control

```typescript
if (IapticRN.checkEntitlement('premium')) {
  showPremiumContent();
} else {
  showUpgradePrompt();
}

// All currently active entitlements
const unlocked = IapticRN.listEntitlements(); // ['basic', 'premium', 'cool_feature']
```

## Manual Purchase Flow

If you don't want the drop-in UI, drive purchases yourself:

```typescript
const offer = IapticRN.getProduct('premium_monthly')?.offers[0];
if (offer) {
  await IapticRN.order(offer);
}

if (IapticRN.checkEntitlement('premium')) {
  // Unlock premium features
}
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

## Troubleshooting

- **Products won't load on iOS** — verify your Xcode project has the **In-App Purchase** capability enabled (Xcode → Project → Targets → your app → Signing & Capabilities → **+ Capability** → In-App Purchase).

- **iOS build fails on React Native ≥ 0.83 / Expo SDK ≥ 55 with `Unable to find a specification for RCT-Folly depended upon by RNIap`** — you're depending on upstream `react-native-iap` instead of `@iaptic/react-native-iap`. Switch to the fork (see [Installation](#installation)) and the error goes away. Background: [Why the fork?](#why-the-fork).

- **Android build fails with `Unresolved reference 'currentActivity'`** — bump `@iaptic/react-native-iap` to `^12.16.6`, which contains the Kotlin fix for RN 0.83+ / new architecture.

- **Android Gradle resolution fails inside `@react-native-async-storage/async-storage`** — versions `2.2.0`–`3.0.2` are broken on Android due to an unpublished Maven artifact. Use `^3.1.0` or stay on `~2.1.0`. See [release notes](./RELEASE_NOTES.md#130) for details.

For more, see [INTEGRATION_GUIDE.md → Troubleshooting](./INTEGRATION_GUIDE.md#14-troubleshooting).

## Upgrading

### From 1.2.x → 1.3.0

- Install `@react-native-async-storage/async-storage` explicitly if (and only if) you use `IapticTokensManager`. It is now an **optional** peer dependency.
- Bump `@iaptic/react-native-iap` to `^12.16.6` to pick up the Kotlin `currentActivity` fix on RN 0.83+.

### From 1.0.x → 1.1+

- Install `@iaptic/react-native-iap` explicitly — it moved from a regular dependency to a peer dependency.
- The JavaScript API surface and Expo `withIAP` plugin behaviour are identical to upstream `react-native-iap@12.16.4`.

See [`RELEASE_NOTES.md`](./RELEASE_NOTES.md) for the full changelog.

## Why the fork?

Upstream [`hyochan/react-native-iap`](https://github.com/hyochan/react-native-iap) was archived on 2026-04-26; development moved to the [OpenIAP monorepo](https://github.com/hyodotdev/openiap/tree/main/libraries/react-native-iap), where it shipped as a Nitro Modules rewrite (v15+, different API). The 12.x line therefore won't receive any further patches upstream — including the iOS pod fix needed for React Native ≥ 0.83 / Expo SDK ≥ 55 / new architecture (`Unable to find a specification for RCT-Folly depended upon by RNIap`), and the Kotlin `currentActivity` fix for the same RN versions.

[`@iaptic/react-native-iap@12.16.6`](https://github.com/iaptic/react-native-iap) is `12.16.4` with those fixes applied — JavaScript / Java / Kotlin / Obj-C / Swift code is otherwise byte-identical to upstream `12.16.4`. Skeptical readers can verify by browsing the [fork's commit history](https://github.com/iaptic/react-native-iap/commits).

## Documentation

- [**Integration guide**](./INTEGRATION_GUIDE.md) — step-by-step setup for subscriptions (single reference combining install, dashboard, example app, and API)
- [**API reference**](https://www.iaptic.com/documentation/react-native) — generated TypeDoc for all public types
- [**Release notes**](./RELEASE_NOTES.md) — changelog and upgrade notes
- [**Demo app**](https://github.com/iaptic/react-native-iaptic-demo) — a runnable example app

## Support & Community

- 🐛 [Issue tracker](https://github.com/iaptic/react-native-iaptic/issues) — bug reports and feature requests
- 📧 [support@iaptic.com](mailto:support@iaptic.com) — direct support for Iaptic customers
- 🌐 [iaptic.com](https://www.iaptic.com) — service status, pricing, dashboard

## Contributing

This repository is maintained by [Iaptic](https://www.iaptic.com). PRs and issue reports are welcome — please file an issue first for non-trivial changes so we can align on direction before you invest the work.

## Security

Receipts are validated **server-side** by Iaptic; no validation logic runs in the app bundle, and your validation secret never ships to clients. To report a security issue, email [security@iaptic.com](mailto:security@iaptic.com) rather than opening a public GitHub issue.

## License

MIT © [Iaptic](https://www.iaptic.com)
