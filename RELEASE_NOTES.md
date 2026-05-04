# Release Notes

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
