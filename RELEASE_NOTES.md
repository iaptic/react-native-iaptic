# Release Notes

## 2.2.0

Offer code redemption on iOS, via `@iaptic/react-native-iap@13.1.0` (iOS 27 result-based StoreKit API).

### New: `presentOfferCodeRedeemSheet()`

```typescript
try {
  await IapticRN.presentOfferCodeRedeemSheet();
} catch (error) {
  if (error?.code === 'E_USER_CANCELLED') return; // user closed the sheet
  // handle other errors like a purchase error
}
```

Presents the App Store "Offer Code Redemption" sheet. The redeemed transaction flows
through the usual `purchase.updated` → validation → finish path, exactly like a
purchase — no new request field, no extra code.

- **iOS 27+**: the promise resolves with the redeemed transaction (the raw StoreKit 2
  `TransactionSk2`, not the validated `IapticVerifiedPurchase` — validation arrives
  through `purchase.updated`). Cancel and error rejections are converted to an
  `IapticError` the same way `order()` converts them, so an app's existing purchase
  error handler works unchanged: `PAYMENT_CANCELLED` for a user cancel,
  `COMMUNICATION` / `SUBSCRIPTIONS_NOT_AVAILABLE` / `UNKNOWN` otherwise. The bridge-level
codes are `E_USER_CANCELLED` / `E_NETWORK_ERROR` / `E_IAP_NOT_AVAILABLE` / `E_UNKNOWN`;
  the error message carries the Apple case name.
- **Below iOS 27**: fire-and-forget on the deprecated sheet APIs (decision FOV-511b) —
  the promise resolves once the sheet has been presented and never reports cancel or
  errors (a documented limitation). A successful redemption still arrives through
  `purchase.updated`.
- `options` (RedeemOption values) is reserved for future use — the iOS 27 SDK exposes no
  public value yet, so anything passed today is ignored.
- Rejects with an `IapticError` on non-iOS platforms.
- The peer dependency on `@iaptic/react-native-iap` is bumped to `^13.1.0` — the release
  calls a method only 13.1.0 provides (with `^13.0.0` an app holding 13.0.x would install
  cleanly and fail at the first `presentOfferCodeRedeemSheet()` call). 13.1.0 also exports
  `TransactionSk2` from its package root. The bridge's deprecated
  `presentCodeRedemptionSheetIOS()` still works and now wraps the same native path, falling
  back to the legacy StoreKit 1 sheet
  on iOS < 15.

## 2.1.0

Value-add features on top of the GPBL V9 migration, leveraging Google Play Billing Library V8/V9 capabilities.

### New: `getStorefront()`

```typescript
const storefront = await IapticRN.getStorefront();
// Returns ISO 3166-1 alpha-2 country code, e.g. "US", "DE", "JP"
```

Returns the user's storefront country code. On Android, uses Google Play's `BillingConfig` API (GPBL 6.1+). On iOS, uses StoreKit 2's storefront API (iOS 16+).

### New: `changeSubscription()` and `IapticReplacementMode`

```typescript
import { IapticRN, IapticReplacementMode } from 'react-native-iaptic';

// Upgrade with immediate proration
await IapticRN.changeSubscription(
  newOffer,
  oldPurchaseToken,
  IapticReplacementMode.WITH_TIME_PRORATION,
);

// Downgrade with deferred change (new plan takes effect at next renewal)
await IapticRN.changeSubscription(
  basicOffer,
  oldPurchaseToken,
  IapticReplacementMode.DEFERRED,
);
```

Explicit API for subscription upgrades/downgrades on Android. Requires the old subscription's `purchaseToken` and a `replacementMode` to define how the billing transition is handled. Supports all 6 GPBL replacement modes including `KEEP_EXISTING` (V8.1+).

### New: `isSuspended` and `quantity` on `IapticVerifiedPurchase`

- **`isSuspended`** — `true` when a subscription has been paused or put on hold due to payment decline. A suspended subscription is not considered "owned" by `IapticRN.isOwned()` or `IapticRN.checkEntitlement()`. Returns `undefined` on Android until `@iaptic/react-native-iap` v13.0.2+, which serialises the field from native.
- **`quantity`** — the number of items purchased (for multi-quantity purchases on iOS and Android). Returns `undefined` on Android until `@iaptic/react-native-iap` v13.0.2+, which serialises the field from native.

### New: `subscription.suspended` event

A new event type emitted when a subscription transitions to a suspended state (paused by user or on hold due to payment decline).

```typescript
IapticRN.addEventListener('subscription.suspended', (purchase) => {
  console.log(`Subscription ${purchase.productId} is suspended`);
});
```

### Locale updates

Added `ActiveSubscription_Status_Suspended` locale key to all 7 supported languages (EN, ES, FR, DE, JA, ZH, PT).

### Review feedback addressed

- **`order()` auto-detection is now scoped** — `findOldPurchaseToken()` only replaces a subscription in the same `productGroup` (when declared) and, among multiple candidates, picks the **most recently purchased** one instead of an arbitrary iteration-order match. This avoids accidentally converting a new subscription purchase into a replacement when the user owns several subscriptions.
- **`changeSubscription()` error code fixed** — cancellation/failure now surfaces `PAYMENT_CANCELLED` / `PURCHASE` instead of the misleading `SUBSCRIPTION_UPDATE_NOT_AVAILABLE`.
- **`KEEP_EXISTING` is validated** — when `KEEP_EXISTING` is passed with an `offerToken`, the token is dropped (with a warning) and the call routes through `order()`, matching the GPBL requirement that the offer token must not be set.
- **`getStorefront()` no longer throws** — returns an empty string if the native call fails (e.g. Play Store unavailable).
- Restored the Spanish/French locale JSDoc headers and documented the `changeSubscription()` Android-without-offerToken fallback path.

### ⚠️ Fork gaps (require `@iaptic/react-native-iap` v13.0.2+)

| Feature | Fork status | Wrapper status |
|---|---|---|
| `Purchase.isSuspended` native serialization | Not serialized | Type + `owned()` check ready |
| `Purchase.getQuantity` native serialization | Not serialized (Android) | Type ready |
| `ReplacementModesAndroid` enum values | Wrong (CHARGE_FULL_PRICE=5, DEFERRED=6) | Workaround: cast via `as unknown as` |
| `KEEP_EXISTING` mode (value 6) | Not in native `when` statement | Enum value added |

## 2.0.0

Breaking peer-dependency bump: `@iaptic/react-native-iap` from `^12.16.6` to `^13.0.0`.

### Google Play Billing Library V9

`@iaptic/react-native-iap@13.0.0` upgrades Google Play Billing Library from V7 to V9. This is a breaking change because GPBL V9 removes `queryPurchaseHistoryAsync` and changes several API signatures:

- **`getPurchaseHistory` removed** — GPBL V9 dropped `queryPurchaseHistoryAsync`. Use `getAvailablePurchases` instead. The `purchaseHistory` state and `getPurchaseHistory` hook helper are also removed from `useIAP`.
- **`enablePendingPurchases()` now requires `PendingPurchasesParams`** — explicitly enables one-time products and prepaid plans. Omitting `enableOneTimeProducts()` silently breaks pending purchase flows in cash-payment markets.
- **`queryProductDetailsAsync` callback changed** — the second parameter is now `QueryProductDetailsResult` (wrapping `productDetailsList` + `unfetchedProductIds`) instead of a plain `List<ProductDetails>`. Unfetched product IDs are logged as warnings.
- **Play Store blocked detection** — GPBL V9 reclassified "Play Store is blocked" errors from `ERROR` to `BILLING_UNAVAILABLE`. A new `E_STORE_BLOCKED` error code is now emitted.
- **`billing-ktx` → `billing`** — the Kotlin extensions artifact was merged into the main `billing` artifact in V8+.
- **`enableAutoServiceReconnection()`** added to the `BillingClient` builder.
- Consumers who need GPBL V7 can stay on `@iaptic/react-native-iap@12.x` / `react-native-iaptic@1.x`.

## 1.3.2

Patch release fixing a TypeScript regression introduced in 1.3.1 that broke the `prepare` script (and therefore every `npm install` of the package).

### Fix `TS2749` in `SubscriptionView/Modal.tsx`

`productRefs` was typed as `useRef<Array<React.RefObject<TouchableOpacity>>>`, which uses the `TouchableOpacity` *value* as a type. Newer TypeScript / `@types/react` rejects this:

```
src/components/SubscriptionView/Modal.tsx(362,52): error TS2749:
'TouchableOpacity' refers to a value, but is being used as a type here.
Did you mean 'typeof TouchableOpacity'?
```

Replaced with `React.ElementRef<typeof TouchableOpacity>`, which is the canonical React/TS pattern for typing a ref to a component instance. `tsc` now passes cleanly, unblocking `npm install` and any downstream build that consumes `react-native-iaptic` from source.

## 1.3.1

Docs-only patch. No source, API, or peer-dependency changes — `lib/` is unchanged.

### AsyncStorage guidance corrected

Updated install guidance to recommend `@react-native-async-storage/async-storage@^3.1.0` and explicitly document the `2.2.0`–`3.0.2` broken window (Android Gradle resolution failure due to an unpublished Maven artifact, fixed upstream in [3.1.0](https://github.com/react-native-async-storage/async-storage/releases/tag/%40react-native-async-storage%2Fasync-storage%403.1.0)). The previous manual `maven { url ... }` workaround is no longer needed and has been removed from `INTEGRATION_GUIDE.md` and `README.md` ([#2](https://github.com/iaptic/react-native-iaptic/pull/2)).

### README revamp

`README.md` rewritten for a clearer first impression — restructured feature overview, install steps, and quick-start example ([#3](https://github.com/iaptic/react-native-iaptic/pull/3)). Badge fixes: correct the npm package name (`iaptic-rn` → `react-native-iaptic`, [#4](https://github.com/iaptic/react-native-iaptic/pull/4)) and drop the rate-limited bundlephobia badge ([#5](https://github.com/iaptic/react-native-iaptic/pull/5)).

## 1.3.0

### AsyncStorage now optional

`@react-native-async-storage/async-storage` is no longer a required peer dependency. It is now optional — only needed if using `IapticTokensManager` for consumable token tracking. This sidesteps a breaking upstream bug where async-storage 2.2.0–3.0.2 (inclusive) fail Android Gradle resolution due to an unpublished Maven artifact. Upstream fixed it in [3.1.0](https://github.com/react-native-async-storage/async-storage/releases/tag/%40react-native-async-storage%2Fasync-storage%403.1.0) by republishing the split artifact to Maven Central ([upstream issue #1280](https://github.com/react-native-async-storage/async-storage/issues/1280)).

- If you use `IapticTokensManager`, install AsyncStorage explicitly: `npm install @react-native-async-storage/async-storage@^3.1.0` (or stay on `~2.1.0`; avoid `2.2.0`–`3.0.2`).
- If you don't use tokens, you can remove AsyncStorage entirely.
- Existing token data is preserved (no storage backend change).

### Kotlin fix for RN 0.83 / Expo SDK 55 (via `@iaptic/react-native-iap@12.16.6`)

Minimum `@iaptic/react-native-iap` bumped to `^12.16.6`, which contains a fix for the `Unresolved reference 'currentActivity'` Kotlin compile error on React Native 0.83+ with the new architecture.

### Bug fix: unhandled promise rejection in IapticTokensManager

Fixed a pre-existing issue where `IapticTokensManager` constructor called `loadTransactions()` (an async method) without `await` or `.catch()`, causing unhandled promise rejections if loading failed. Errors are now properly caught and logged.

### Documentation

- `INTEGRATION_GUIDE.md`: updated prerequisites and install commands for optional AsyncStorage; added troubleshooting entries for async-storage 2.2.0+ and Kotlin `currentActivity` issues; added migration guide for 1.2.x → 1.3.0.
- `README.md`: updated dependency description and install commands.

## 1.2.1

Metadata-only fix:

- Correct the `repository.url` and `bugs.url` fields in `package.json` to point at https://github.com/iaptic/react-native-iaptic (the actual repo) instead of the previous stale URL.

No code or behaviour changes vs. 1.2.0.

---

## 1.2.0

### Breaking change — IAP layer now uses `@iaptic/react-native-iap`

`react-native-iaptic` no longer consumes upstream `react-native-iap` (which was archived on 2026-04-26 and replaced by an OpenIAP/Nitro Modules rewrite at v15+). The SDK now peer-depends on [`@iaptic/react-native-iap@^12.16.5`](https://github.com/iaptic/react-native-iap) — an Iaptic-maintained fork of `12.16.4` with the iOS new-architecture pod fix built in.

Why: the v12.x line will not receive any further upstream patches, so the RN ≥ 0.83 / Expo SDK ≥ 55 build error (`Unable to find a specification for RCT-Folly`) had no future fix path. Maintaining a frozen v12.x fork was lower-cost than asking every user to maintain a `patch-package` patch.

Migration from 1.1.0:

```bash
# Remove upstream package and any patch-package workaround
npm uninstall react-native-iap
rm -f patches/react-native-iap+*.patch

# Install the fork
npm install @iaptic/react-native-iap @react-native-async-storage/async-storage
```

If you reference the Expo config plugin in `app.json` / `app.config.js`, change `"react-native-iap"` to `"@iaptic/react-native-iap"`.

The JavaScript API surface, Java/Obj-C/Swift native code, and the `withIAP` Expo plugin behaviour are unchanged from upstream `12.16.4`.

### Verified against

- Expo SDK 55.0.19 / React Native 0.83.6 / new architecture / iOS prebuilt artifacts.
- `npm install @iaptic/react-native-iap` → `expo prebuild` → `pod install` → full iOS Debug `xcodebuild` (BUILD SUCCEEDED), with no `patch-package` involved.

### Future direction

`react-native-iaptic@2.x` is planned to migrate to the OpenIAP/Nitro Modules-based v15+ react-native-iap (the long-term successor). The fork is a stop-gap for the v12.x line and will be sunset when 2.x ships.

---

## 1.1.0

### Breaking change — peer dependencies

`react-native-iap` and `@react-native-async-storage/async-storage` moved from `dependencies` to `peerDependencies`. You must now install them explicitly:

```bash
npm install 'react-native-iap@^12.16.1' @react-native-async-storage/async-storage
npm install react-native-iaptic
```

Why:

- The `react-native-iap` Expo config plugin (`withIAP`, referenced as `"react-native-iap"` in `app.json` / `app.config.js`) only resolves when the package is hoisted to your project root. With the previous nested install, Expo prebuild could not load it.
- You can now pin or `patch-package` `react-native-iap` independently — required to apply the iOS build fix for React Native ≥ 0.83 (see Troubleshooting below).

Pin `react-native-iap` to the 12.x line. v13.x has the same JS API but ships the same broken iOS podspec; v14.x is a Nitro Modules rewrite and is not API-compatible.

Peer ranges:

- `react-native-iap`: `>=12.16.1 <14`
- `@react-native-async-storage/async-storage`: `>=1.19.0 <4`
- `react`: `>=17`
- `react-native`: `>=0.64`

### Documentation

- README and INTEGRATION_GUIDE.md now cover the Expo config plugin setup.
- New troubleshooting entry for the React Native ≥ 0.83 / Expo SDK ≥ 55 / new architecture iOS build error (`Unable to find a specification for RCT-Folly depended upon by RNIap`), with a validated `patch-package` diff.

### Verified against

- Expo SDK 55.0.19 / React Native 0.83.6 / new architecture / iOS prebuilt artifacts.
- Full iOS Debug compile + link succeeds with the documented `patch-package` workaround applied.

---

## 1.0.1

- Fix `IapticRN.listEntitlements()`.
- Declare `base-64` as a dependency.
- Misc bug fix and lint warning cleanup.
