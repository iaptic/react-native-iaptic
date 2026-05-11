# Release Notes

## 1.3.0

### AsyncStorage now optional

`@react-native-async-storage/async-storage` is no longer a required peer dependency. It is now optional — only needed if using `IapticTokensManager` for consumable token tracking. This resolves a breaking upstream bug where async-storage 2.2.0–3.0.2 fails Android Gradle resolution due to an unpublished Maven artifact.

- If you use `IapticTokensManager`, install AsyncStorage explicitly: `npm install @react-native-async-storage/async-storage@~2.1.0`
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
