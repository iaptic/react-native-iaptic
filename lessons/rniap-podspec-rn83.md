# `react-native-iap` podspec breaks on RN ≥ 0.83 + new arch (as of 2026-05)

`react-native-iap` versions ≤ 13.0.4 ship an `RNIap.podspec` that, under
`RCT_NEW_ARCH_ENABLED=1`, depends directly on the unbundled subspecs
`RCT-Folly`, `RCTRequired`, `RCTTypeSafety`, `ReactCommon/turbomodule/core`.

RN ≥ 0.83 (Expo SDK 55+) bundles those into the prebuilt
`ReactNativeDependencies` pod and no longer publishes them as standalone
podspecs, so `pod install` fails with
`Unable to find a specification for RCT-Folly depended upon by RNIap`.

`react-native-iap@14+` is a Nitro Modules rewrite — different JS API, not a
drop-in upgrade.

**Fix shipped to users:** README troubleshooting documents a `patch-package`
diff that swaps the four hard-coded dependencies for
`install_modules_dependencies(s)` (RN's blessed helper, used by
`@react-native-async-storage/async-storage` and other maintained modules).

Reproduction project lives at `../experiments/react-native-expo-55-test/`.
