---
name: gpbl-v9-impact
description: GPBL V9 migration impact on react-native-iaptic — key findings including compile-breaking callback change
metadata:
  type: project
---

# GPBL V9 Migration — Key Findings for react-native-iaptic

As of 2026-06-05 (updated after migration + bugfix).

## Status: COMPLETED ✅

The GPBL V9 migration has been completed. The fork is published as `@iaptic/react-native-iap@13.0.1` (patch fix for E_STORE_BLOCKED double-reject) and `react-native-iaptic` is updated to v2.0.0.

## Key Finding 1: `getPurchaseHistory` removed

`getPurchaseHistoryByType` native method and `getPurchaseHistory()` JS function were **removed** from the fork (GPBL V9 removed `queryPurchaseHistoryAsync`). `react-native-iaptic` never used this API, so no impact on consumers.

## Key Finding 2: `queryProductDetailsAsync` callback — COMPILE-BREAKING (FIXED)

Changed from `(BillingResult, List<ProductDetails>)` to `(BillingResult, QueryProductDetailsResult)`. The fork now extracts `.productDetailsList` from the result and logs `unfetchedProductIds` as a warning.

## Key Finding 3: `enablePendingPurchases()` must use params (FIXED)

Replaced no-arg `enablePendingPurchases()` with `enablePendingPurchases(PendingPurchasesParams)` including `enableOneTimeProducts()` and `enablePrepaidPlans()`. Also added `enableAutoServiceReconnection()`.

⚠️ **Testing gotcha**: Omitting `.enableOneTimeProducts()` silently breaks pending purchase flows in cash-payment markets (JP, DE, BR, MX, ID) — invisible in credit-card test environments.

## Other Findings

- `SubscriptionUpdateParams.setSubscriptionReplacementMode()` is **deprecated** (V8.1+) but **NOT removed** in V9. Deferred to future work.
- `Purchase.isSuspended()` added in V8.1 — not yet handled. Value-add for future.
- No `externalOffer`/`AlternativeBilling`/`UserChoiceBilling` APIs used — not applicable.

## Build Config Changes

| Property | Before | After |
|---|---|---|
| `playBillingSdkVersion` | 7.0.0 | 9.0.0 |
| `compileSdkVersion` | 33 | 35 |
| `targetSdkVersion` | 33 | 35 |
| `minSdkVersion` | 21 | 23 |
| AGP | 7.4.2 | 8.7.3 |
| Java compat | 1.8 | 17 |
| Kotlin stdlib | 1.8.0 | 1.8.22 (forced) |
| `billing-ktx` | used | replaced with `billing` (KTX merged in V7.1+) |
| `namespace` | missing | `com.dooboolab.rniap` (required by AGP 8.x) |

## New Error Code

`E_STORE_BLOCKED` added to both the native (PromiseUtils) and JS (ErrorCode) layers. Maps to `IapticErrorCode.STORE_BLOCKED` in the wrapper. Detects "Play Store is blocked" condition (OEM kids mode, parental controls, enterprise policies).

⚠️ **Bug fixed in 13.0.1**: The initial 13.0.0 release had a double-reject bug in `initConnection()` — `isValidResult()` would reject with `E_SERVICE_ERROR` first, then `isPlayStoreBlocked()` tried to reject again with `E_STORE_BLOCKED`. The second rejection was silently swallowed by `safeReject`. Fixed by checking `isPlayStoreBlocked()` before `isValidResult()` so the specific error code is sent.

## Versioning

- Fork: `@iaptic/react-native-iap@13.0.1` (breaking change from 12.x, patch fix for E_STORE_BLOCKED)
- Wrapper: `react-native-iaptic@2.0.0` (peer dep `^13.0.0`)
- Consumers pinning to `12.x` can stay on `react-native-iaptic@1.x`