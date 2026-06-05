# Release Notes

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
