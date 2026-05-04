# React Native Iaptic — Integration Guide (Subscriptions)

This document is the single reference for integrating `react-native-iaptic` into a React Native app that sells **subscriptions**. It bundles the README, the dashboard tutorial, the example app, the demo app, and the API reference into one place. Consumables and non-consumables are intentionally out of scope here.

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Platform setup](#4-platform-setup)
5. [Configuration (`Config.ts`)](#5-configuration-configts)
6. [Service layer (`AppService.ts`)](#6-service-layer-appservicets)
7. [App.tsx wiring](#7-apptsx-wiring)
8. [Entitlement gating](#8-entitlement-gating)
9. [Subscription view (drop-in UI)](#9-subscription-view-drop-in-ui)
10. [Manual purchase flow](#10-manual-purchase-flow)
11. [Events](#11-events)
12. [Error handling](#12-error-handling)
13. [API reference](#13-api-reference)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Overview

`react-native-iaptic` is a high-level React Native SDK that wraps `react-native-iap` and the Iaptic receipt-validation backend. It provides:

- A **single, cross-platform purchasing API** (`IapticRN`) that works for both iOS (StoreKit) and Android (Play Billing).
- **Server-side receipt validation** via Iaptic — clients never trust local receipts.
- **Real-time subscription tracking** through events (`subscription.updated`, `subscription.renewed`, `subscription.cancelled`, `subscription.expired`, `subscription.changed`).
- **Drop-in UI**: `IapticSubscriptionView` is a full-screen subscription picker, `IapticActiveSubscription` shows the active subscription, `IapticProductList` lists products. Theming and per-element style overrides supported.
- **Entitlements model**: code checks `IapticRN.checkEntitlement('premium')` rather than product IDs, decoupling features from SKUs.
- **Restore, manage, and re-validate** flows out of the box.

Architecture in one line: your app calls `IapticRN`, which talks to `react-native-iap` for the native store and to the Iaptic validator for receipt verification. The SDK then maintains an internal cache of verified purchases and emits events when state changes.

---

## 2. Prerequisites

- Node.js 18+ and npm or yarn.
- React Native CLI environment, or Expo (with `npx expo prebuild` / EAS Build — managed-only workflows are not supported because IAP requires native code).
- Xcode (iOS) and/or Android Studio (Android).
- An **Apple Developer account** with In-App Purchase enabled and an app in App Store Connect.
- A **Google Play Developer account** with an app and license testers configured.
- An **Iaptic account** (https://www.iaptic.com) with an app registered. From the Iaptic dashboard you will need the `appName` and `publicKey`.
- Tested with React Native 0.76.5, 0.78, and 0.83.6 (Expo SDK 55, new architecture). Peer deps: `react >= 17`, `react-native >= 0.64`, `react-native-iap >=12.16.1 <14`, `@react-native-async-storage/async-storage >=1.19.0 <4`.

---

## 3. Installation

As of 1.1.0, `react-native-iap` and `@react-native-async-storage/async-storage` are **peer dependencies** — install them yourself so you can pin and patch them independently, and so the `react-native-iap` Expo config plugin (`withIAP`) resolves at the project root. Pin `react-native-iap` to the 12.x line; 13.x ships the same JS API but trips the iOS build error described in §14, and 14.x is a Nitro Modules rewrite that's not yet supported.

```bash
npm install --save 'react-native-iap@^12.16.1' @react-native-async-storage/async-storage
npm install --save react-native-iaptic
# iOS only
cd ios && pod install && cd ..
```

Verify in `package.json`:

```json
"dependencies": {
  "@react-native-async-storage/async-storage": "^2.1.0",
  "react-native-iap": "^12.16.1",
  "react-native-iaptic": "^1.1.0"
}
```

> ⚠️ **Upgrading from 1.0.x?** `react-native-iap` and `@react-native-async-storage/async-storage` moved from `dependencies` to `peerDependencies` in 1.1.0. Install them explicitly as shown above.

### Expo

Add the `react-native-iap` config plugin to `app.json` / `app.config.js` so the Android `missingDimensionStrategy` (Play Store flavor) is wired up at prebuild time:

```js
// app.config.js (or "plugins": ["react-native-iap"] in app.json's "expo" object)
export default {
  expo: {
    plugins: ['react-native-iap'],
    // ...
  },
};
```

The plugin only resolves when `react-native-iap` is hoisted to the project root, which is exactly what the peer-dep model in 1.1.0 guarantees.

---

## 4. Platform setup

### 4.1 iOS

1. **Bundle ID**: open the iOS project in Xcode, set Team and Bundle Identifier to match the App Store Connect record. The bundle ID must equal `IapticConfig.iosBundleId`.
2. **Add the In-App Purchase capability**: Xcode → Project → Targets → *(your app)* → **Signing & Capabilities** → **+ Capability** → "In-App Purchase". Without this capability, products will silently fail to load.
3. **Create products in App Store Connect**: subscription group + auto-renewing subscriptions. Note the product IDs; they go into `IapticConfig.products[].id`.
4. **Sandbox testing**: in App Store Connect, create sandbox testers under Users and Access → Sandbox Testers. On the device, sign out of the production Apple ID (Settings → App Store) so iOS prompts for a sandbox login at first purchase. Sandbox purchases are not charged.
5. **Iaptic dashboard — iOS Shared Key**: in App Store Connect, App Information → App-Specific Shared Secret. Paste it into the Iaptic dashboard for your app so Iaptic can validate iOS receipts.

### 4.2 Android

1. **Package name**: `applicationId` in `android/app/build.gradle` must match the Play Console listing.
2. **License key in Gradle**: copy the Base64 RSA public key from Play Console → Monetisation Setup → Licensing into `android/app/build.gradle`:
   ```gradle
   android {
     defaultConfig {
       manifestPlaceholders = [
         BILLING_KEY: "your_license_key_from_play_console"
       ]
     }
   }
   ```
3. **Create products in Play Console**: subscriptions with base plans and offers. Product IDs go into `IapticConfig.products[].id`.
4. **License testers**: Play Console → Setup → License testing. Test accounts will not be billed.
5. **Iaptic dashboard — Android Service Account**: create a Google service account with access to the Play Developer API and upload its JSON key to the Iaptic dashboard. Iaptic uses it to validate Play receipts and acknowledge purchases.

---

## 5. Configuration (`Config.ts`)

Centralise all IAP settings in `src/Config.ts`. Treat it as the single source of truth — `appName`, `publicKey`, `iosBundleId`, the product catalogue, the entitlement labels, and the terms URL all live here.

```typescript
import { IapticConfig, IapticVerbosity } from 'react-native-iaptic';

export class Config {
  static iaptic: IapticConfig = {
    // baseUrl: 'https://validator-staging.iaptic.com',  // optional, defaults to production
    appName: 'your.app.name',
    publicKey: 'your-iaptic-public-key',
    iosBundleId: 'com.yourcompany.yourapp',
    verbosity: IapticVerbosity.DEBUG, // set to ERROR or NONE in production

    // Map each store product ID to one or more entitlement strings.
    // Code never checks product IDs — it checks entitlements.
    products: [
      { id: 'subscription1',       type: 'paid subscription', entitlements: ['basic'] },
      { id: 'subscription2',       type: 'paid subscription', entitlements: ['basic', 'premium'] },
      { id: 'monthly_with_intro',  type: 'paid subscription', entitlements: ['basic', 'premium', 'pro'] },
    ],
  };

  // Labels shown in IapticSubscriptionView — one entry per entitlement key above.
  static entitlements = {
    basic:   { label: 'Basic Access',   detail: 'Access to Basic Features' },
    premium: { label: 'Premium Access', detail: 'Access to Premium Features' },
    pro:     { label: 'Pro Access',     detail: 'Access to All Pro Features' },
  };

  static termsUrl = 'https://www.example.com/terms';
}
```

### Field reference

| Field | Purpose |
|---|---|
| `appName` | Iaptic app slug (from the Iaptic dashboard). |
| `publicKey` | Iaptic public API key. |
| `iosBundleId` | Must equal Xcode bundle ID; used for iOS receipt validation. |
| `baseUrl` | Override only when pointing at a staging validator. Defaults to production. |
| `verbosity` | `IapticVerbosity.{NONE,ERROR,WARN,INFO,DEBUG}`. Use `DEBUG` while integrating. |
| `products[].id` | Store product ID (App Store Connect / Play Console). |
| `products[].type` | For this guide, always `'paid subscription'`. |
| `products[].entitlements` | Array of entitlement strings this product grants. |

### Why entitlements, not product IDs

Different SKUs (monthly, yearly, intro-priced) often grant the same access. By giving them the same entitlement string, your feature gate stays a single line — `IapticRN.checkEntitlement('premium')` — regardless of which SKU the user bought, and you can introduce or retire SKUs without touching feature code.

---

## 6. Service layer (`AppService.ts`)

Wrap all `IapticRN` interaction in a small service class. The service is created once with a `setEntitlements` callback that updates React state. It owns:

- one-time SDK initialisation,
- the `subscription.updated` listener (the source of truth for entitlement changes),
- helpers for entitlement checks and post-purchase callbacks,
- error formatting.

```typescript
// src/AppService.ts
import { Alert, Platform, ToastAndroid } from 'react-native';
import { IapticError, IapticRN, IapticSeverity } from 'react-native-iaptic';
import { Config } from './Config';

export class AppService {
  DEBUG = true;

  constructor(private setEntitlements: (entitlements: string[]) => void) {}

  log(message: string, severity: IapticSeverity = IapticSeverity.INFO) {
    const SYMBOLS = ['info', 'warn', 'error'];
    console.log(`${new Date().toISOString()} [${SYMBOLS[severity]}] ${message}`);
  }

  showAlert(title: string, message: string, debug: string = '') {
    Alert.alert(title, this.DEBUG && debug ? `${message}\n\n${debug}` : message);
  }

  showError(error: Error | IapticError) {
    if (error instanceof IapticError) {
      this.log(`IapticRN #${error.code}: ${error.message}`, error.severity);
      if (error.severity === IapticSeverity.INFO) return;
      if (error.severity === IapticSeverity.WARNING && Platform.OS === 'android') {
        ToastAndroid.show(error.localizedMessage, ToastAndroid.SHORT);
      } else {
        this.showAlert(error.localizedTitle, error.localizedMessage, error.debugMessage);
      }
    } else {
      this.log(error.message, IapticSeverity.ERROR);
      this.showAlert('Error', error.message);
    }
  }

  /** Called once at app startup. Returns a cleanup function for useEffect. */
  onAppStartup() {
    this.log('onAppStartup');
    this.initializeIaptic();
    return () => {
      IapticRN.destroy();
    };
  }

  async initializeIaptic() {
    try {
      // Source of truth for entitlement changes (renewals, cancellations, expirations, plan changes).
      IapticRN.addEventListener('subscription.updated', (reason, purchase) => {
        this.log(`subscription.updated: ${reason} for ${JSON.stringify(purchase)}`);
        this.setEntitlements(IapticRN.listEntitlements());
      });

      await IapticRN.initialize(Config.iaptic);

      // Associate purchases with this user. Use a stable, anonymous ID (e.g. hashed user ID).
      IapticRN.setApplicationUsername('iaptic-rn-demo-user');

      // Initial UI sync — products may already have been validated.
      this.setEntitlements(IapticRN.listEntitlements());
    } catch (err: any) {
      this.showError(err);
    }
  }

  /** Show a feature gate alert based on the current entitlements. */
  checkFeatureAccess(featureId: string) {
    if (IapticRN.checkEntitlement(featureId)) {
      Alert.alert(`"${featureId}" feature is unlocked.`);
    } else {
      Alert.alert(`Please subscribe to unlock feature "${featureId}".`);
    }
  }

  /** Called by IapticSubscriptionView's onPurchaseComplete callback. */
  handlePurchaseComplete() {
    Alert.alert('Thank you for your purchase');
    this.log(`Entitlements: ${JSON.stringify(IapticRN.listEntitlements())}`);
    this.log(`Active subscription: ${JSON.stringify(IapticRN.getActiveSubscription())}`);
  }
}
```

Notes:

- `IapticRN.initialize` is async — always `await` it. It loads products and the user's verified purchases from Iaptic.
- `setApplicationUsername` should be called after `initialize` and any time the logged-in user changes.
- `IapticRN.destroy` removes listeners and tears down the SDK; call it on app teardown.
- The `subscription.updated` listener gives you renewals, cancellations, expirations, and upgrades/downgrades in one place — prefer it over the granular `subscription.renewed/cancelled/expired/changed` events unless you need per-event branching.

---

## 7. App.tsx wiring

The service must survive React re-renders. Use a module-level singleton plus `useRef`, and a one-shot `useEffect` to start the lifecycle:

```typescript
// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { IapticRN, IapticSubscriptionView } from 'react-native-iaptic';
import { AppService } from './src/AppService';
import { Config } from './src/Config';

let iapServiceInstance: AppService | null = null;

function App(): React.JSX.Element {
  const [entitlements, setEntitlements] = useState<string[]>([]);

  const iapService = useRef<AppService>(
    iapServiceInstance ||
      (iapServiceInstance = new AppService(setEntitlements)),
  ).current;

  // One-time init + cleanup. The empty dep array is intentional.
  useEffect(() => iapService.onAppStartup(), []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.productsContainer}
      >
        <Text style={styles.subscriptionText}>Subscription</Text>

        <TouchableOpacity
          onPress={() => iapService.checkFeatureAccess('basic')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Basic Access:{' '}
            {entitlements.includes('basic') ? 'Granted' : 'Locked'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => iapService.checkFeatureAccess('premium')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Premium Access:{' '}
            {entitlements.includes('premium') ? 'Granted' : 'Locked'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.subscriptionButton]}
          onPress={() => IapticRN.presentSubscriptionView()}
        >
          <Text style={styles.buttonText}>
            {entitlements.includes('basic')
              ? 'Manage Subscription'
              : 'Subscribe To Unlock'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <IapticSubscriptionView
        entitlementLabels={Config.entitlements}
        onPurchaseComplete={() => iapService.handlePurchaseComplete()}
        termsUrl={Config.termsUrl}
        theme={{ primaryColor: '#FF7A00', secondaryColor: '#FF0000' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  productsContainer: { padding: 10, gap: 10, paddingBottom: 20 },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
  subscriptionButton: { marginTop: 20, backgroundColor: '#5856D6' },
  subscriptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default App;
```

Why the singleton pattern: a fresh `AppService` on every render would re-add the `subscription.updated` listener on every render, leaking listeners and causing duplicate handlers. The module-level `iapServiceInstance` plus `useRef` guarantee exactly one instance.

---

## 8. Entitlement gating

Two primitives:

```typescript
IapticRN.checkEntitlement('premium')     // boolean — does the current user have it?
IapticRN.listEntitlements()              // string[] — all currently granted entitlements
```

Drive UI from React state populated by `setEntitlements`, then call `checkEntitlement` at the moment of action (button press, navigation guard) so you cannot get out of sync with a freshly-cancelled subscription.

```tsx
<TouchableOpacity onPress={() => iapService.checkFeatureAccess('premium')}>
  <Text>
    Premium: {entitlements.includes('premium') ? 'Granted' : 'Locked'}
  </Text>
</TouchableOpacity>
```

For the subscribe button, branch text on whether the user already has the lowest-tier entitlement:

```tsx
<Text>
  {entitlements.includes('basic') ? 'Manage Subscription' : 'Subscribe To Unlock'}
</Text>
```

`IapticRN.getActiveSubscription()` returns the current `IapticVerifiedPurchase` (or `undefined`) if you need product-level details — expiration date, trial status, billing retry — for a custom display.

---

## 9. Subscription view (drop-in UI)

`IapticSubscriptionView` is a full-screen modal that renders product cards from `Config.products`, shows the entitlements they grant, runs the purchase flow, and offers Restore Purchases. Mount it once near the root of your tree:

```tsx
<IapticSubscriptionView
  entitlementLabels={Config.entitlements}
  onPurchaseComplete={() => iapService.handlePurchaseComplete()}
  termsUrl={Config.termsUrl}
  theme={{ primaryColor: '#FF7A00', secondaryColor: '#FF0000' }}
/>
```

Open it from anywhere with:

```typescript
IapticRN.presentSubscriptionView();
```

### Props

| Prop | Type | Purpose |
|---|---|---|
| `entitlementLabels` | `Record<string, { label: string; detail?: string }>` | Display labels per entitlement key. Required for the feature grid. |
| `onPurchaseComplete` | `() => void` | Fires after a successful, server-validated purchase. |
| `termsUrl` | `string` | Renders a "Terms & Conditions" link. |
| `theme` | `IapticTheme` | Color tokens — see below. |
| `styles` | `IapticSubscriptionViewStyles` | Per-element style overrides (productCard, ctaButton, etc.). |
| `sortProducts` | `(a, b) => number` | Custom product ordering. |
| `showRestorePurchase` | `boolean` | Toggle the Restore button. Default `true`. |

### Theme tokens

`IapticTheme` accepts: `primaryColor`, `secondaryColor`, `backgroundColor`, `textColor`, `secondaryTextColor`, `borderColor`, `successColor`, `warningColor`, `errorColor`. Pass only the keys you want to override.

### Style overrides

```tsx
<IapticSubscriptionView
  styles={{
    productCard: { backgroundColor: '#FFFFFF', borderRadius: 12 },
    ctaButton: { backgroundColor: '#4CAF50' },
  }}
/>
```

The component handles purchase state, active-subscription display, restore, terms link, validation, and landscape/portrait layout automatically.

### Other ready-made components

- `IapticActiveSubscription` — small status block showing the current subscription, trial/retry indicators, and a manage link. Drop in anywhere.
- `IapticProductList` — bare list of products with offer pricing and an `onOrder` callback. Use when you want a non-modal layout.

---

## 10. Manual purchase flow

If you need a custom UI instead of `IapticSubscriptionView`, drive purchases directly:

```typescript
// Order an offer
const product = IapticRN.getProduct('subscription2');
const offer = product?.offers[0];
if (offer) {
  try {
    await IapticRN.order(offer);
    // Success: subscription.updated will fire and listEntitlements() will reflect it.
  } catch (error) {
    iapService.showError(error as Error);
  }
}

// Restore previous purchases (call from a button on your paywall)
try {
  const numRestored = await IapticRN.restorePurchases((processed, total) => {
    console.log(`Processed ${processed} of ${total}`);
  });
  Alert.alert(`${numRestored} purchases restored.`);
} catch (error) {
  iapService.showError(error as Error);
}

// Send the user to the platform subscription management screen
IapticRN.manageSubscriptions();   // App Store / Play Store subscription settings
IapticRN.manageBilling();         // platform billing settings
```

Each `IapticProduct` exposes `offers: IapticOffer[]`, and each offer has `pricingPhases` describing intro pricing, free trials, and the full price. For a single-tier monthly subscription you typically have one product with one offer.

---

## 11. Events

Subscribe with `IapticRN.addEventListener(eventType, listener)`. The returned `{ remove() }` handle removes that single listener; `IapticRN.removeAllEventListeners()` clears everything. `IapticRN.destroy()` clears listeners and the SDK state.

| Event | Payload | When |
|---|---|---|
| `subscription.updated` | `(reason: IapticSubscriptionReason, purchase: IapticVerifiedPurchase)` | Any subscription state change. **Use this as the primary listener.** |
| `subscription.renewed` | `(purchase)` | Renewal succeeded. |
| `subscription.cancelled` | `(purchase)` | User cancelled (still active until expiration). |
| `subscription.expired` | `(purchase)` | Period ended without renewal. |
| `subscription.changed` | `(purchase)` | Plan changed (upgrade / downgrade / crossgrade). |
| `purchase.updated` | `(purchase: IapticVerifiedPurchase)` | Any verified purchase changed. |
| `pendingPurchase.updated` | `(pending: IapticPendingPurchase)` | In-flight purchase moved between `purchasing → processing → validating → finishing → completed/cancelled`. Useful for spinners. |
| `products.updated` | `(products: IapticProduct[])` | Catalogue refreshed (after `loadProducts` or `initialize`). |
| `error` | `(error: IapticError)` | SDK-internal error (in addition to thrown errors from awaited calls). |

Typical pattern:

```typescript
IapticRN.addEventListener('subscription.updated', (reason, purchase) => {
  setEntitlements(IapticRN.listEntitlements());
});

IapticRN.addEventListener('pendingPurchase.updated', (pending) => {
  setBusy(pending.status === 'purchasing' || pending.status === 'validating');
});
```

Always call `IapticRN.destroy()` (or `removeAllEventListeners()`) when tearing down — failing to do so leaks listeners across hot reloads.

---

## 12. Error handling

`IapticRN` throws `IapticError` for known failure modes and plain `Error` otherwise. Branch on `instanceof IapticError`, and within that branch, on `severity`:

```typescript
import { IapticError, IapticSeverity } from 'react-native-iaptic';

function showError(error: Error | IapticError) {
  if (error instanceof IapticError) {
    if (error.severity === IapticSeverity.INFO) {
      console.log('Info:', error.localizedMessage);
      return;
    }
    if (error.severity === IapticSeverity.WARNING && Platform.OS === 'android') {
      ToastAndroid.show(error.localizedMessage, ToastAndroid.SHORT);
      return;
    }
    Alert.alert(error.localizedTitle, error.localizedMessage);
  } else {
    Alert.alert('Unknown error', error.message);
  }
}
```

### `IapticError` shape

| Field | Purpose |
|---|---|
| `code` | `IapticErrorCode` enum — machine-readable code (e.g. `PAYMENT_CANCELLED`, `VERIFICATION_FAILED`, `LOAD`, `SETUP`). |
| `severity` | `IapticSeverity.{INFO, WARNING, ERROR}`. |
| `localizedTitle` | User-facing title in the active locale. |
| `localizedMessage` | User-facing body. |
| `debugMessage` | Developer-only detail; safe to surface only in DEBUG builds. |
| `status` | HTTP status when the failure was a validator response. |

Typical conventions:

- `INFO` (e.g. user cancelled) — silent log, no UI.
- `WARNING` — non-fatal hint; on Android use Toast, on iOS use Alert.
- `ERROR` — Alert. Send `code` to your analytics so you can track conversion drop-offs.

---

## 13. API reference

### Public exports (`react-native-iaptic`)

```typescript
// Core
IapticRN, IapticConfig
IapticError, IapticSeverity
IapticUtils, IapticLogger

// Domain helpers (rarely needed directly)
IapticStoreProducts, IapticPurchases, IapticSubscriptions,
IapticPendingPurchases, IapticNonConsumables, IapticConsumables,
IapticTokensManager, IapticTokenTransaction

// Localisation
IapticLocales, IapticLocale, IapticSupportedLocales

// UI components and styles
IapticSubscriptionView, IapticSubscriptionViewProps, IapticSubscriptionViewStyles
IapticActiveSubscription, IapticActiveSubscriptionProps
IapticProductList, IapticProductListProps, IapticProductListStyles
IapticProductPrice
IapticTheme

// Types and enums (re-exported from types.ts)
// — see "Key types" below
```

### `IapticRN` static methods

| Method | Purpose |
|---|---|
| `initialize(config: IapticConfig): Promise<void>` | One-time setup. Loads products and verified purchases. |
| `destroy(): void` | Tear down singleton. Removes listeners. |
| `setApplicationUsername(username?: string): Promise<void>` | Bind purchases to a user ID. |
| `setVerbosity(v: IapticVerbosity): void` | Adjust log level at runtime. |
| `setProductDefinitions(defs: IapticProductDefinition[]): void` | Override the product catalogue (rarely needed if `IapticConfig.products` was set). |
| `loadProducts(defs?): Promise<IapticProduct[]>` | Force a refresh from the store. |
| `loadPurchases(): Promise<IapticVerifiedPurchase[]>` | Force a refresh of verified purchases. |
| `checkEntitlement(featureId: string): boolean` | Feature gate. |
| `listEntitlements(): string[]` | All currently granted entitlement strings. |
| `getProducts(): IapticProduct[]` | Current product catalogue. |
| `getProduct(id: string): IapticProduct \| undefined` | Single product lookup. |
| `getPurchases(): IapticVerifiedPurchase[]` | All verified purchases. |
| `getPendingPurchases(): IapticPendingPurchase[]` | In-flight purchases. |
| `getActiveSubscription(): IapticVerifiedPurchase \| undefined` | First active subscription, if any. |
| `isOwned(productId: string): boolean` | Has this SKU ever been verified for the current user? |
| `order(offer: IapticOffer): Promise<void>` | Initiate purchase of an offer. |
| `restorePurchases(progress: (done, total) => void): Promise<number>` | Re-validate purchases from the store. |
| `consume(p: IapticVerifiedPurchase): Promise<void>` | Consumables only — out of scope here. |
| `manageSubscriptions(): Promise<void>` | Open platform subscription settings. |
| `manageBilling(): Promise<void>` | Open platform billing settings. |
| `presentSubscriptionView(): void` | Show the mounted `IapticSubscriptionView`. |
| `addEventListener<T>(type: T, listener): { remove(): void }` | Subscribe to events. |
| `removeAllEventListeners(type?): void` | Unsubscribe. |
| `addLocale(code, messages): void` | Register a custom language. |
| `setLocale(code, fallback = 'en'): void` | Switch UI language. |
| `utils: IapticUtils` | MD5, formatting, misc helpers. |

### Key types

| Type | Notes |
|---|---|
| `IapticConfig` | `{ appName, publicKey, iosBundleId, baseUrl?, verbosity?, products, applicationUsername?, showAlerts? }`. |
| `IapticProductDefinition` | `{ id, type, entitlements?, tokenType?, tokenValue? }`. For subscriptions, set `type: 'paid subscription'` and provide `entitlements`. |
| `IapticProduct` | Store-loaded product: `{ id, type, title, description, offers, platform, entitlements, tokens? }`. |
| `IapticOffer` | `{ id, platform, productId, productType, offerType, offerToken?, pricingPhases }`. |
| `IapticPricingPhase` | `{ price, priceMicros, currency, billingPeriod, billingCycles, recurrenceMode, paymentMode }`. |
| `IapticVerifiedPurchase` | Server-validated purchase. Includes `productId`, `platform`, `purchaseDate`, `expirationDate`, `isTrial`, `isIntroPrice`, `cancelationReason`, `priceConsentStatus`, etc. |
| `IapticPendingPurchase` | `{ productId, status, offerId? }` where `status` is one of `purchasing | processing | validating | finishing | completed | cancelled`. |
| `IapticTheme` | Color tokens (see §9). |
| `IapticErrorCode` | Enum of failure modes. Stable identifiers safe to send to analytics. |
| `IapticCancelationReason` | `CUSTOMER \| DEVELOPER \| SYSTEM \| SYSTEM_REPLACED \| SYSTEM_BILLING_ERROR \| ...`. |
| `IapticPurchasePlatform` | `APPLE_APPSTORE \| GOOGLE_PLAY \| WINDOWS_STORE \| BRAINTREE \| TEST`. |
| `IapticPaymentMode` | `PayAsYouGo \| UpFront \| FreeTrial`. |
| `IapticRecurrenceMode` | `NON_RECURRING \| FINITE_RECURRING \| INFINITE_RECURRING`. |
| `IapticVerbosity` | `NONE \| ERROR \| WARN \| INFO \| DEBUG`. |
| `IapticEventType` | Union of all event names listed in §11. |

For exhaustive field lists, see `react-native-iaptic/api.md` (TypeDoc-generated).

---

## 14. Troubleshooting

**Products fail to load on iOS.**
1. Verify the **In-App Purchase** capability is enabled in Xcode (Project → Targets → Signing & Capabilities). This is the most common cause.
2. Confirm `IapticConfig.iosBundleId` exactly matches the Xcode bundle ID and the App Store Connect record.
3. Confirm products exist in App Store Connect, are in **Ready to Submit** state, and the device is signed into a sandbox tester (not a production Apple ID).
4. Sign out of Settings → App Store, then trigger a purchase — iOS will prompt for the sandbox login at the StoreKit dialog, not in Settings.

**Products fail to load on Android.**
1. Confirm `BILLING_KEY` placeholder in `android/app/build.gradle` is set to the Play Console license key.
2. Confirm the Play Console product IDs exactly match `IapticConfig.products[].id`.
3. The signed-in Google account on the device must be a registered license tester.
4. Subscriptions require an Android Service Account configured in the Iaptic dashboard — without it, validation will fail with `VERIFICATION_FAILED`.

**Purchases succeed on the device but `listEntitlements()` is empty.**
- The `subscription.updated` listener must be registered **before** `IapticRN.initialize` (otherwise initial purchases pass without firing it). The `AppService.initializeIaptic` ordering above is correct.
- Confirm the Iaptic dashboard shows the user's purchase. If not, validation is failing — check the Iaptic dashboard logs and the `iosBundleId` / Play package name.

**Validator returns errors / `IapticError` with `code: 'VERIFICATION_FAILED'`.**
- iOS: missing or wrong **App-Specific Shared Secret** in the Iaptic dashboard.
- Android: missing or wrong **Service Account JSON** in the Iaptic dashboard.

**Listeners firing twice on Android during development.**
- Hot reload re-executes module-level code. The singleton pattern in §7 (`iapServiceInstance` outside the component) plus `IapticRN.destroy()` on cleanup prevents listener leaks.

**Need detailed logs.**
- Set `verbosity: IapticVerbosity.DEBUG` in `IapticConfig` and read the device console. Drop to `ERROR` or `NONE` before shipping.

**iOS build fails on React Native ≥ 0.83 / Expo SDK ≥ 55 with `Unable to find a specification for RCT-Folly depended upon by RNIap`.**

Cause: `react-native-iap`'s `RNIap.podspec` (≤ 13.0.4 at the time of writing) depends directly on `RCT-Folly`, `RCTRequired`, `RCTTypeSafety`, and `ReactCommon/turbomodule/core` under `RCT_NEW_ARCH_ENABLED=1`. RN ≥ 0.83's prebuilt-artifacts pipeline ships those inside the `ReactNativeDependencies` pod and no longer publishes them as standalone podspecs, so CocoaPods can't resolve them.

Workaround using [`patch-package`](https://github.com/ds300/patch-package):

1. `npm install --save-dev patch-package postinstall-postinstall`
2. Add to your `package.json`:
   ```json
   "scripts": { "postinstall": "patch-package" }
   ```
3. Save the patch file as `patches/react-native-iap+12.16.4.patch` (adjust the version suffix to match your installed `react-native-iap` version):
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

This swaps the four hard-coded subspecs for React Native's `install_modules_dependencies(s)` helper, which wires up the right pods whether you build RN from source or use the prebuilt artifacts. `@react-native-async-storage/async-storage` and other maintained native modules use the same pattern.

Track upstream at [hyochan/react-native-iap](https://github.com/hyochan/react-native-iap). Once a fixed `react-native-iap` is published, drop the patch and pin to that version.
