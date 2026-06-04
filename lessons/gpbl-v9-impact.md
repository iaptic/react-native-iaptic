---
name: gpbl-v9-impact
description: GPBL V9 migration impact on react-native-iaptic — key finding that getPurchaseHistory is unused
metadata:
  type: project
---

# GPBL V9 Migration — Key Findings for react-native-iaptic

As of 2026-06-04.

## Key Finding: `getPurchaseHistory` is NOT used

`react-native-iaptic` does NOT call `IAP.getPurchaseHistory()` anywhere in its source code (verified by grep). This means the V9 removal of `queryPurchaseHistoryAsync` in the native layer does NOT require any changes in the TypeScript layer.

The fork (`@iaptic/react-native-iap`) still exposes `getPurchaseHistory()` in its JS API, so the native method must be removed/adapted in the fork, but react-native-iaptic consumers are unaffected.

## Another Finding: `enablePendingPurchases()` must change

The fork's `RNIapModule.kt:46` uses the old no-arg `enablePendingPurchases()` which is removed in V9. Must become `enablePendingPurchases(PendingPurchasesParams)`.

The cordova plugin already uses the new API:
```java
.enablePendingPurchases(
    PendingPurchasesParams.newBuilder()
        .enableOneTimeProducts()
        .enablePrepaidPlans()
        .build())
.enableAutoServiceReconnection()
```

## Dependency Chain

- `@iaptic/react-native-iap` v12.16.6 is on GPBL 7.0.0 (fork of react-native-iap 12.16.4)
- `cordova-plugin-purchase` v13.16.1 is already on GPBL 9.0.0
- The fork must be upgraded first before react-native-iaptic can bump its peer dependency

**Why:** react-native-iaptic has no native code; all GPBL changes happen in the fork.

**How to apply:** When starting GPBL V9 migration work, focus on the fork first. The TS layer changes in react-native-iaptic are minimal (peer dep bump + optional error code additions).