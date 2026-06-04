---
name: gpbl-v9-impact
description: GPBL V9 migration impact on react-native-iaptic — key findings including compile-breaking callback change
metadata:
  type: project
---

# GPBL V9 Migration — Key Findings for react-native-iaptic

As of 2026-06-04.

## Key Finding 1: `getPurchaseHistory` is NOT used

`react-native-iaptic` does NOT call `IAP.getPurchaseHistory()` anywhere in its source code (verified by grep). This means the V9 removal of `queryPurchaseHistoryAsync` in the native layer does NOT require any changes in the TypeScript layer.

The fork (`@iaptic/react-native-iap`) still exposes `getPurchaseHistory()` in its JS API, so the native method must be removed/adapted in the fork, but react-native-iaptic consumers are unaffected.

## Key Finding 2: `queryProductDetailsAsync` callback signature is COMPILE-BREAKING

The fork at `RNIapModule.kt:279` uses the V7 callback `(BillingResult, List<ProductDetails>)`. In V8+, this changed to `(BillingResult, QueryProductDetailsResult)` where `QueryProductDetailsResult` wraps both `productDetailsList` and `unfetchedProductIds`.

**This is a compile-breaking change** — the fork won't build against GPBL 9.0.0 without updating this callback. The cordova plugin already uses the new signature (`PurchasePlugin.java:1281`).

Recommendation: Extract `.getProductDetailsList()` from result (as cordova does) to minimize JS bridge impact.

## Key Finding 3: `enablePendingPurchases()` must change

The fork's `RNIapModule.kt:46` uses the old no-arg `enablePendingPurchases()` which is removed in V9. Must become `enablePendingPurchases(PendingPurchasesParams)`.

⚠️ **Testing gotcha**: Omitting `.enableOneTimeProducts()` silently breaks pending purchase flows in cash-payment markets (JP, DE, BR, MX, ID) — invisible in credit-card test environments.

The cordova plugin already uses the new API:
```java
.enablePendingPurchases(
    PendingPurchasesParams.newBuilder()
        .enableOneTimeProducts()
        .enablePrepaidPlans()
        .build())
.enableAutoServiceReconnection()
```

## Other Findings

- `SubscriptionUpdateParams.setSubscriptionReplacementMode()` is **deprecated** (V8.1+) but **NOT removed** in V9. The fork uses it at `RNIapModule.kt:528`. Can defer migration to `SubscriptionProductReplacementParams` — not a V9 blocker.
- `Purchase.isSuspended()` was added in V8.1. Neither the fork nor react-native-iaptic currently handle this. Value-add for future.
- No `externalOffer`/`AlternativeBilling`/`UserChoiceBilling` APIs used in the fork — not applicable.

## Dependency Chain

- `@iaptic/react-native-iap` v12.16.6 is on GPBL 7.0.0 (fork of react-native-iap 12.16.4)
- `cordova-plugin-purchase` v13.16.1 is already on GPBL 9.0.0
- The fork must be upgraded first before react-native-iaptic can bump its peer dependency

**Why:** react-native-iaptic has no native code; all GPBL changes happen in the fork.

**How to apply:** When starting GPBL V9 migration work, focus on the fork first. The TS layer changes in react-native-iaptic are minimal (peer dep bump + optional error code additions).

## Versioning Strategy

Publish V9-compatible fork as a new major version (e.g., `13.0.0` or `14.0.0`) so consumers can pin to `12.x` until ready. Update `react-native-iaptic` peer dependency accordingly. This follows the same approach used for the `@iaptic/react-native-iap` fork migration (v1.2.0 breaking change).